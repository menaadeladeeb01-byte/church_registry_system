import reportRepo from '../repositories/report.repository.js';

const getAgeCategories = async (churchId)=>{

const reportData = await reportRepo.getAgeCategoriesBreakDown(churchId);
return reportData ;

}

export default { getAgeCategories };