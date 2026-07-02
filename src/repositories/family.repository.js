import pool from '../config/db.js';

// 🎯 دالة لإضافة عائلة جديدة في الداتا بيز
const createFamily = async (familyData) => {
    const { name, place, phone_number, church_id } = familyData;
    
    const query = `
        INSERT INTO families (name, place, phone_number, church_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;
    
    const res = await pool.query(query, [name, place, phone_number, church_id]);
    return res.rows[0]; // بنرجع العائلة اللي اتكريتت فوراً
};

export default {
    createFamily
};