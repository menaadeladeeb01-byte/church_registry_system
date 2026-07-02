import familyServices from '../services/family.service.js';

const addFamily = async (req, res, next) => {
    try {
        const { name, place, phone_number } = req.body;
      
        const church_id = req.user.churchId; 

        const newFamily = await familyServices.createNewFamily({
            name,
            place,
            phone_number,
            church_id
        });

        return res.status(201).json({
            success: true,
            message: "Family registered successfully!",
            data: {
                family: newFamily
            }
        });

    } catch (error) {
        next(error); 
    }
};

export default {
    addFamily
};