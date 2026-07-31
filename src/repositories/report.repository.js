import pool from '../config/db.js';

const getAgeCategoriesBreakDown = async (churchId) =>{

    const query = `
        SELECT 
            COUNT(*)::INT AS total_alive_members,
            
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 6 AND 11 THEN 1 END)::INT AS primary_school,
            
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 12 AND 14 THEN 1 END)::INT AS preparatory_school,
            
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 15 AND 17 THEN 1 END)::INT AS secondary_school,
            
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 18 AND 22 THEN 1 END)::INT AS university,
            
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(),date_of_birth)) BETWEEN 23 AND 35 THEN 1 END)::INT AS youth,
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 36 AND 50 THEN 1 END)::INT AS adults,
            
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) > 50 THEN 1 END)::INT AS elders
            
        FROM members
        WHERE church_id = $1 AND status = 'ALIVE';
    `;

    const result = await pool.query(query, [churchId]);
    return result.rows[0];
};

export default {getAgeCategoriesBreakDown };


