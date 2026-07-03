import familyRepo from '../repositories/family.repository.js';
import AppError from '../utils/appError.js';

const createNewFamily = async (familyData) => {
    const { name, place, phone_number, church_id } = familyData;

    if (!name || !place || !phone_number || !church_id) {
        throw new AppError('All fields (name, place, phone_number, church_id) are required!', 400);
    }

    const existingFamily = await familyRepo.findFamilyByPhone(phone_number, church_id);
    if (existingFamily) {
        throw new AppError('A family with this phone number is already registered in this church!', 400);
    }

    const newFamily = await familyRepo.createFamily({ name, place, phone_number, church_id });

    return newFamily;
};


const fetchAllFamilies = async (churchId , search)=>{
    if(!churchId){
        throw new AppError('Church ID is required to fetch families!' , 400);
    }

return await familyRepo.getFamilies(churchId , search);

}

const updatedFamily = async (familyId , familyData, churchId) =>{

const {name , place , phone_number} = familyData ;

const existingFamily = await familyRepo.findFamilyById(familyId);
if(!existingFamily || existingFamily.church_id !== churchId){
    throw new AppError('Family not found or not have permission!' , 404);
}

const finalData = {
    name : name || existingFamily.name , 
    place : place || existingFamily.place ,
    phone_number : phone_number || existingFamily.phone_number
}
const updatedFamily = await familyRepo.updateFamily(familyId , finalData);

return updatedFamily ;

}



const deleteFamily = async (familyId , churchId) =>{

if(!familyId){
    throw new AppError('Family ID is required to delete a family!' , 400);
}

const existingFamily = await familyRepo.findFamilyById(familyId);
if(!existingFamily || existingFamily.church_id !== churchId){
    throw new AppError('Family not found or not have permission!',404);
}
await familyRepo.deleteFamily(familyId);

return true ;

};
export default {
    createNewFamily,
    fetchAllFamilies,
    updatedFamily,
    deleteFamily
};