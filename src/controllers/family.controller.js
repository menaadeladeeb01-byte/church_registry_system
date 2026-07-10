import familyServices from '../services/family.service.js';

const addFamily = async (req, res, next) => {
    try {
        const { name, place, phone_number , head_id } = req.body;
      
        const church_id = req.user.churchId; 

        const newFamily = await familyServices.createNewFamily({
            name,
            place,
            phone_number,
            head_id : head_id || null ,
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

const getAllFamilies = async (req , res , next) =>{
    try{
    const churchId = req.user.churchId;
    const {search} = req.query ;

    const families = await familyServices.fetchAllFamilies(churchId , search);

return res.status(200).json({
    success : true , 
    message : "Families fetched successfully!",
    count : families.length , 
    data: {
        families
    }
})

}catch(error){
    next(error);
}
}
    const updateFamily = async (req , res , next) =>{
        try{
            const familyId = req.params.Id;
            const {name , place , phone_number , head_id} = req.body ; 
            const churchId = req.user.churchId ;

    const family = await familyServices.updatedFamily(familyId , {name , place , phone_number , head_id},churchId);
        return res.status(200).json({
            success : true , 
            message : 'family updated successfully!' , 
            family
})

}       catch(error){
            next(error);
}

}
    const deleteFamily = async (req , res , next) =>{

        try{
            const familyId = req.params.Id;
            const churchId = req.user.churchId;
            await familyServices.deleteFamily(familyId, churchId);

            return res.status(200).json({
                success : true , 
                message : 'family deleted successfully!'
            })

        }catch(error){
            next(error);
        }

    }


export default {
    addFamily,
    getAllFamilies,
    updateFamily,
    deleteFamily
};