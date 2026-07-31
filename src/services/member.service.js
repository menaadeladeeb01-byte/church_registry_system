import memberRepo from "../repositories/member.repository.js";
import AppError from "../utils/appError.js";
import familyRepo from "../repositories/family.repository.js";
import xlsx from 'xlsx';

const parseExcelDate = (rawDate) => {
    if (!rawDate) return null;
    if (rawDate instanceof Date) {
        return rawDate.toISOString().split('T')[0];
    }
    if (typeof rawDate === 'number' || !isNaN(Number(rawDate))) {
        const dateObj = xlsx.SSF.parse_date_code(Number(rawDate));
        if (dateObj) {
            const yyyy = dateObj.y;
            const mm = String(dateObj.m).padStart(2, '0');
            const dd = String(dateObj.d).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }
    return new Date(rawDate).toISOString().split('T')[0];
};

export const parseExcelService = (fileBuffer) => {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const rawRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!rawRows || rawRows.length === 0) {
        throw new Error('ملف الـ Excel فارغ أو لا يحتوي على صفوف صالحة!');
    }

    return rawRows.map((row, index) => {
        const name = 
            row['الاسم'] || 
            row['اسم'] || 
            row['إسم'] || 
            row['Name'] || 
            row['name'] || 
            row['Full Name'];

        if (!name || name.toString().trim() === '') {
            throw new Error(`الصف رقم ${index + 2} في ملف الإكسيل لا يحتوي على "اسم"! يرجى التأكد من كتابة رأس العمود بـ "الاسم" أو "Name".`);
        }

        const rawDob = row['تاريخ الميلاد'] || row['Date of Birth'] || row['date_of_birth'];

        return {
            name: name.toString().trim(),
            dateOfBirth: parseExcelDate(rawDob),
            phoneNumber: (row['التليفون'] || row['Phone'] || row['phone'] || '').toString().trim() || null,
            nationalId: (row['الرقم القومي'] || row['National ID'] || row['national_id'] || '').toString().trim() || null,
            gender: (row['النوع'] || row['Gender'] || 'MALE').toString().toUpperCase().trim(),
            status: (row['الحالة'] || row['Status'] || 'ALIVE').toString().toUpperCase().trim(),
            familyId: parseInt(row['رقم العائلة'] || row['Family ID'] || row['family_id'])
        };
    });
};

const createNewMember = async (memberData)=>{
    const {name ,date_of_birth,phone_number, national_id , gender ,status , church_id , family_id} = memberData;

    if(!name || !date_of_birth || !phone_number || !gender || !family_id){

        throw new AppError('All fields (name, date_of_birth, phone_number, gender , family_id) are required!' , 400);
    }
    const existingFamilyInChurch = await memberRepo.findFamilyInChurch(family_id , church_id);
    if(!existingFamilyInChurch){
        throw new AppError('The specified family does not exist in your church!',404);
    }

    if(national_id){
        const existingMember = await memberRepo.findMemberByNationalId(national_id);
        if(existingMember){
            throw new AppError('A member with this national ID is already exists in the system!' , 400);
        }
    }

  
    const newMember = await memberRepo.createNewMember(memberData);

    return newMember;
};

const getAllMembers = async (churchId , queryParams ) =>{
if(!churchId){
    throw new AppError('Church ID is required!' ,400);
}
    const search = queryParams.search || null;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    const offset = (page -1 )*limit ;

    const members = await memberRepo.getAllMembers(churchId , search , limit , offset);

    const totalCount = await memberRepo.getMembersCount(churchId, search);

    const totalPages = Math.ceil(totalCount / limit);

    return {
        members,
        pagination: {
            totalItems: totalCount,
            totalPages: totalPages,
            currentPage: page,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };


};


const updateMember = async (memberId, churchId, updateData) => {
    if (!memberId || !churchId) {
        throw new AppError('Member ID and Church ID are required!', 400);
    }

    const member = await memberRepo.findMemberByIdAndChurch(memberId, churchId);
    if (!member) {
        throw new AppError('Member not found in your church!', 404);
    }

    if (updateData.national_id && updateData.national_id !== member.national_id) {
        const existingMember = await memberRepo.findMemberByNationalId(updateData.national_id);
        if (existingMember) {
            throw new AppError('A member with this national ID already exists!', 400);
        }
    }

    
    return await memberRepo.updateMember(memberId, updateData);
};

const deleteMember = async (memberId, churchId) => {
    if (!memberId || !churchId) {
        throw new AppError('Member ID and Church ID are required!', 400);
    }

    const member = await memberRepo.findMemberByIdAndChurch(memberId, churchId);
    if (!member) {
        throw new AppError('Member not found in your church!', 404);
    }

    return await memberRepo.deleteMember(memberId);
};


const recordDeathEvent = async (churchId , eventData) =>{

    const { memberId , eventDate , notes , newHeadId } = eventData ;

    const member = await memberRepo.findMemberByIdAndChurch(memberId , churchId);
    if(!member){
        throw new AppError("Member not found in your church!" , 404);
    }
    if(member.status === 'DECEASED'){
        throw new AppError("This member is already recorded as deceased!" , 400);
    }

    const family = await familyRepo.findFamilyById(member.family_id);


let isFamilyHead = false ;
if(family && Number(family.head_id) === Number(memberId)){
    isFamilyHead = true ;

if(!newHeadId){
    throw new AppError('This member is the Family Head! You must provide a new_head_id to lead this family' , 400);
}
   const newHead = await memberRepo.findMemberByIdAndChurch(newHeadId, churchId);
   if(!newHead || Number(newHead.family_id) !== Number(member.family_id) ){
    throw new AppError("The new family head must be an active member of the same family!" ,400);
   }
   if(newHead.status === 'DECEASED'){
    throw new AppError('The new family head cannot be a deceased member' , 400);
   }

};
return await memberRepo.executeDeathTransaction({
    memberId , 
    churchId , 
    eventDate , 
    notes , 
    familyId : member.family_id , 
    newHeadId , 
    isFamilyHead
})


};

const searchMembers = async(churchId , filters) =>{
    return await memberRepo.searchMembers(churchId, filters);
}




export default {
    createNewMember,
    getAllMembers,
    updateMember ,
    deleteMember,
    recordDeathEvent,
    searchMembers
}
