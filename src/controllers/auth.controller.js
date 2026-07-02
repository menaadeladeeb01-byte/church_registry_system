
import authServices from '../services/auth.service.js' ;
//import { success } from 'zod' ;


const register = async (req , res , next)=>{

    try{
        const {name , email , password , church_id} = req.body ;

        const result = await authServices.authRegister({name , email , password , church_id}) ;

        return res.status(201).json({
            success: true , 
            message : "Admin registered successfully!",
            data :{
                user : result.newUser
            }
            
        });

    }catch(error){
        next(error)
    }
};


const login = async (req , res , next )=> {

const { email , password } = req.body ; 

try{
const result = await authServices.authLogin({email , password}) ;
return res.status(200).json({
    success : true , 
    message :"user login successfully!",
    data: {
        user : result.user , 
        accessToken : result.accessToken , 
        refreshToken : result.refreshToken
}
})

}catch(error){
    next(error)
}
};


const logout = async (req , res , next) =>{
 try{
    const {refreshToken} = req.body ; 

    await authServices.authLogout(refreshToken);

return res.status(200).json({
    success : true , 
    message : "user logout successfully!",

})

}catch(error){
    next(error)
}

};

export default {
    register , 
    login,
    logout
};



