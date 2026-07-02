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

export default {
    createNewFamily
};