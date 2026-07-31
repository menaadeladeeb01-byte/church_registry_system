import pool from '../config/db.js';

const getAgeCategoriesBreakDown = async (churchId) =>{

    const query = `
        SELECT 
            COUNT(*)::INT AS total_alive_members,
            
            -- 1. ابتدائي (6 - 11)
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 6 AND 11 THEN 1 END)::INT AS primary_school,
            
            -- 2. إعدادي (12 - 14)
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 12 AND 14 THEN 1 END)::INT AS preparatory_school,
            
            -- 3. ثانوي (15 - 17)
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 15 AND 17 THEN 1 END)::INT AS secondary_school,
            
            -- 4. جامعي (18 - 22)
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 18 AND 22 THEN 1 END)::INT AS university,
            
            -- 5. شباب وخريجين (23 - 35)
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 23 AND 35 THEN 1 END)::INT AS youth,
            
            -- 6. الكبار / الخدام وأولياء الأمور (36 - 50)
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 36 AND 50 THEN 1 END)::INT AS adults,
            
            -- 7. كبار السن والمسنين (أكبر من 50)
            COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) > 50 THEN 1 END)::INT AS elders
            
        FROM members
        WHERE church_id = $1 AND status = 'ALIVE';
    `;

    const result = await pool.query(query, [churchId]);
    return result.rows[0];
};

export default {getAgeCategoriesBreakDown };


