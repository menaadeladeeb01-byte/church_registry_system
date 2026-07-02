import pool from '../config/db.js';

const createFamily = async (familyData) => {
    const { name, place, phone_number, church_id } = familyData;
    
    const query = `
        INSERT INTO families (name, place, phone_number, church_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;
    
    const res = await pool.query(query, [name, place, phone_number, church_id]);
    return res.rows[0]; 
};

const findFamilyByPhone = async (phone_number, church_id) => {
    const query = `
        SELECT * FROM families 
        WHERE phone_number = $1 AND church_id = $2;
    `;  

    const res = await pool.query(query, [phone_number, church_id]);
    return res.rows[0];
};

export default {
    createFamily,
    findFamilyByPhone
};

