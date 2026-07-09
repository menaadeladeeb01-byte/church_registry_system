import express from 'express';
import bcrypt from 'bcrypt';
import authRepo from '../repositories/auth.repository.js';
import AppError from '../utils/appError.js';
import JWT from 'jsonwebtoken';

const authRegister = async (data)=>{
const existingUser = await authRepo.findUserByEmail(data.email);

if(existingUser){
throw new AppError('this email is already exists' , 400);
}

const hashedPassword = await bcrypt.hash(data.password , 10);

const newUser = await authRepo.createUser({name : data.name , email : data.email , password : hashedPassword ,church_id :data.church_id });

return { newUser };
};


const authLogin = async (data)=>{

const {email , password } = data ; 

const existingUser = await authRepo.findUserByEmail(email);
if(!existingUser){
    throw new AppError('this email is not exists, please register firstly!' , 400);
}
const isPasswordConrrect = await bcrypt.compare(password ,existingUser.user_password );

if(!isPasswordConrrect){
throw new appError ('Invalid email or password', 404);
}

const accessToken = JWT.sign(
    { userId: existingUser.id, churchId: existingUser.church_id }, 
    process.env.JWT_SECRET || 'super-access-secret', 
    { expiresIn: '20m' }
);

const refreshToken = JWT.sign(
    { userId: existingUser.id }, 
    process.env.JWT_REFRESH_SECRET || 'super-refresh-secret', 
    { expiresIn: '7d' } 
);

const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepo.saveRefreshToken(existingUser.id, refreshToken, expiresAt);
    
    existingUser.user_password = undefined;
    return { user: existingUser, accessToken, refreshToken };

};

const authLogout = async (refreshToken) =>{
if(!refreshToken){
    throw new AppError('Refresh token is required' , 400);
}
const existingRefreshToken = await authRepo.searchRefreshToken(refreshToken);
if(!existingRefreshToken){
    throw new AppError('Refresh token not found' , 404);
}

const deletedToken = await authRepo.deleteRefreshToken(existingRefreshToken.token);

return true ;
}




export default{

    authRegister ,
    authLogin ,
    authLogout
}