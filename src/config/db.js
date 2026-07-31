import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: String(process.env.DB_PASSWORD),
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
      };

const pool = new Pool(poolConfig);

pool.connect()
    .then((client) => {
        console.log("🟢 Connection to Postgres is successful!");
        client.release(); 
    })
    .catch(err => console.log("🔴 Error in DB connection:", err));

export default pool;
