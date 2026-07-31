import reportService from '../services/report.service.js';

const getAgeCategories = async (req , res , next) =>{

try {

    const churchId = req.user.churchId;

    const data = await reportService.getAgeCategories(churchId);

    return res.status(200).json({
        success : true , 
        message : "Age category breakdown fetched successfully",
        data
    });

}catch(error){
    next(error)
}
}
export default { getAgeCategories } ;