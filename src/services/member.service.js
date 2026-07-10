import memberRepo from "../repositories/member.repository.js";
import AppError from "../utils/appError.js";
import familyRepo from "../repositories/family.repository.js";

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


export default {
    createNewMember,
    getAllMembers,
    updateMember ,
    deleteMember,
    recordDeathEvent

}
