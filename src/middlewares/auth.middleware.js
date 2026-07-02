import express from 'express';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';


const authMiddelware = (req , res , next)=> {

const authHeader = req.headers.authorization ;

if(!authHeader || !authHeader.startsWith('Bearer')){
    return(next (new AppError('unothorized-no token provided' , 401)))
}
    const token = authHeader.split(' ')[1];

try{
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    req.user = decoded;
    next();
}catch(err){
    return (next(new AppError('unothorized-token invalid',401)));
}

}
export default authMiddelware ;
