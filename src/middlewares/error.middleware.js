import appError from '../utils/appError.js';

function errorHandler (err , req , res , next){
    console.error("error is:",err);

    err.statusCode = err.statusCode || 500 ; 
    err.message = err.message || 'internal server error!';

    res.status(err.statusCode).json({
        success : false ,
        message : err.message,
        stack : process.env.NODE_ENV === "development" ? err.stack : undefined
    })
}
export default errorHandler ;
