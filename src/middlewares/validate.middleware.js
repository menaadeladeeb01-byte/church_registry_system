import AppError from '../utils/appError.js';

const validate = (schema) => (req, res, next) => {
    try {
        // 🎯 التعديل السحري: بنباصي الأوبجكت متغلف جوه حقل الـ body 
        // عشان يطابق الـ registerSchema بتاعتك بالملي وبدون أي تضارب!
        schema.parse({
            body: req.body
        }); 
        
        next(); 
    } catch (error) {
        // تأمين الـ Zod Error واستخراج رسايلك النظيفة
        const errorMessage = error.issues?.map(err => err.message).join(', ') 
            || error.errors?.map(err => err.message).join(', ') 
            || error.message;

        return next(new AppError(errorMessage, 400));
    }
};

export default validate;