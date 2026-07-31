import { Result } from "pg";
import memberService from "../services/member.service.js";


    const addMember = async (req , res , next) =>{

        try{
    const { name , date_of_birth , phone_number , national_id  , gender ,status , family_id } = req.body;

    const church_id = req.user.churchId ;
   
        console.log("=== DEBUG ADD MEMBER ===");
        console.log("Family ID from body:", req.body.family_id);
        console.log("Church ID from token:", req.user.churchId);
        console.log("========================");


    const newMember = await memberService.createNewMember({
        name , 
        date_of_birth , 
        phone_number , 
        national_id , 
        gender , 
        status ,
         church_id, 
         family_id
    });

    return res.status(201).json({
        success : true , 
        message : 'Member added successfully!',
        data : newMember
    })


}catch(error){
    next(error);
    }};

    const getAllMembers = async (req , res , next) =>{

        try{
            const churchId = req.user.churchId;
            const {search , page = 1 , limit = 10} = req.query ;

            const members = await memberService.getAllMembers(churchId , {search , page , limit})

            return res.status(200).json({
                success : true , 
                message : 'members fetched successfully!',
                pagination : members.pagination,
                count : members.length ,
                data : members
               
            })

        }catch(error){
            next(error);
        }

    };


    const updateMember = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const churchId = req.user.churchId; 
        
        const updatedMember = await memberService.updateMember(id, churchId, req.body);
        
        return res.status(200).json({
            success: true,
            message: 'Member updated successfully!',
            data: updatedMember
        });
    } catch (error) {
        next(error);
    }
};


const deleteMember = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const churchId = req.user.churchId; 

        await memberService.deleteMember(id, churchId);

        return res.status(200).json({
            success: true,
            message: 'Member deleted successfully!'
        });
    } catch (error) {
        next(error);
    }
};


const recordDeathEvent = async (req , res , next ) =>{
try{
    const { memberId , eventDate , notes , familyId , newHeadId } = req.body ;
    const churchId = req.user.churchId;

    if(!memberId){
        return res.status(400).json({
            success : false , 
            message : "Member ID is required!"
        })
    }
    const result = await memberService.recordDeathEvent(churchId , {
        memberId : memberId ,
        eventDate : eventDate || new Date(),
        notes : notes || null , 
        newHead : newHeadId || null 
    });

    return res.status(200).json({
        success : true , 
        message : "Death event recorded successfully and family leadership updated!" , 
        data : result
    })


}catch(error){
    next(error);
}

};

const searchMembers = async (req , res , next) =>{
try{
    const churchId = req.user.churchId ;
    const filters = req.query ;

    const members = await memberService.searchMembers(churchId , filters);

return res.status(200).json({
    success : true , 
    count : members.length , 
    data : members 
})

}catch(error){
    next(error);
}
};


import { parseExcelService } from '../services/member.service.js';
import { bulkInsertMembersRepository } from '../repositories/member.repository.js';

export const bulkUploadMembers = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "عفواً، يرجى رفع ملف Excel في الـ Body!" 
            });
        }

        const churchId = req.user.churchId;

        const members = parseExcelService(req.file.buffer);

        const insertedCount = await bulkInsertMembersRepository(churchId, members);

        return res.status(201).json({
            success: true,
            message: `تم بنجاح رفع وتنسيق ${insertedCount} فرد داخل قاعدة البيانات!`,
            insertedCount
        });

    } catch (error) {
        next(error);
    }
};


export default {
    addMember,
    getAllMembers,
    updateMember,
    deleteMember,
    recordDeathEvent,
    searchMembers

}
