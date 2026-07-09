import AppError from '../utils/appError.js';

const validate = (schema) => (req, res, next) => {
    try {
      
        schema.parse({
            body: req.body
        }); 
        
        next(); 
    } catch (error) {
        const errorMessage = error.issues?.map(err => err.message).join(', ') 
            || error.errors?.map(err => err.message).join(', ') 
            || error.message;

        return next(new AppError(errorMessage, 400));
    }
};

export default validate;