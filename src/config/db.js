import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';

const { Pool } = pkg ;

const pool = new Pool ({
    host :process.env.DB_HOST,
    user :process.env.DB_USER,
    password :String (process.env.DB_PASSWORD),
    database : process.env.DB_NAME,
    port :Number(process.env.DB_PORT),

});

console.log("DB_user:" ,process.env.DB_USER);
pool.connect()
.then(()=>{console.log("connection to postgres is successfully")})
.catch(err => console.log("error in connection :" , err));

export default pool;
