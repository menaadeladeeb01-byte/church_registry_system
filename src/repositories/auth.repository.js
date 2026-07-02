import pool from '../config/db.js';

const findUserByEmail = async (email) =>{
    const res = await pool.query('select * from users where user_email = $1',[email])
    return res.rows[0];
};

const createUser = async (data) =>{

    const { name , email , password , church_id } = data ;
    const res = await pool.query('insert into users (user_name , user_email , user_password , church_id) values ($1 , $2 , $3 , $4) returning *;',
    [name , email , password , church_id]);
    return res.rows[0];

};

const saveRefreshToken = async (userId, token, expiresAt) => {

    const res = await pool.query('insert into refresh_tokens (user_id , token , expires_at) values ($1 , $2 , $3) returning *'
        , [userId, token, expiresAt]);
        return res.rows[0];

}

const deleteRefreshToken = async (token) => {
    const res = await pool.query('delete from refresh_tokens where token = $1 returning *' , [token]) ;
    return res.rows[0];

};
const searchRefreshToken = async (token) =>{
    const res = await pool.query('select * from refresh_tokens where token = $1', [token]);
    return res.rows[0];
};

export default{
    findUserByEmail ,
    createUser ,
    saveRefreshToken ,
    deleteRefreshToken ,
    searchRefreshToken
};
