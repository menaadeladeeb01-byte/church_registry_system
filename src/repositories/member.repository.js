import pool from '../config/db.js';

const findFamilyInChurch = async (familyId , churchId) =>{
    const query = 'select * from families where id = $1 and church_id = $2 ';
    const res = await pool.query(query, [familyId , churchId]);
    return res.rows[0];
};

const findMemberByNationalId = async (nationalId) =>{
    const query = 'select * from members where national_id = $1';
    const res = await pool.query(query, [nationalId]);
    return res.rows[0];
};

const createNewMember = async (memberData) =>{
    
    const {name , date_of_birth , phone_number , national_id ,gender ,status ,  family_id , church_id} = memberData ;

    const query = 'insert into members (name , date_of_birth , phone_number , national_id , gender, status, family_id , church_id) values ( $1 , $2 , $3, $4, $5 , $6 , $7 , $8 ) returning *' ;
    const res = await pool.query(query , [name , date_of_birth , phone_number , national_id ,gender ,status , family_id , church_id]);
    return res.rows[0];
};

const getAllMembers = async (churchId , search , limit , offset) =>{

let query = 'select * from members where church_id = $1 ';

const params = [churchId];

if(search){
    query +=' and (name ilike $2 or phone_number ilike $2 or national_id ilike $2 or gender ilike $2 or status ilike $2)';
    params.push(`%${search}%`);
}

query += ' order by id desc';

const limitParamIndex = params.length + 1;
const offsetParamIndex = params.length + 2;

query += ` LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`;
params.push(limit, offset);

const res = await pool.query(query , params);
return res.rows ;


}


const getMembersCount = async (churchId, search) => {
    let query = 'SELECT COUNT(*) FROM members WHERE church_id = $1';
    const params = [churchId];

    if (search) {
        query += ` AND ( name ILIKE $2 OR phone_number ILIKE $2 OR national_id ILIKE $2 OR status ILIKE $2 OR gender ILIKE $2)`;
        params.push(`%${search}%`);
    }

    const res = await pool.query(query, params);

    return parseInt(res.rows[0].count);
};

const findMemberByIdAndChurch = async (memberId, churchId) => {
    const query = 'SELECT * FROM members WHERE id = $1 AND church_id = $2';
    const res = await pool.query(query, [memberId, churchId]);
    return res.rows[0];
};

const updateMember = async (memberId, updateData) => {
    const { name, date_of_birth, phone_number, national_id, gender, status, family_id } = updateData;

    const query = `
        UPDATE members 
        SET 
            name = COALESCE($1, name),
            date_of_birth = COALESCE($2, date_of_birth),
            phone_number = COALESCE($3, phone_number),
            national_id = COALESCE($4, national_id),
            gender = COALESCE($5, gender),
            status = COALESCE($6, status),
            family_id = COALESCE($7, family_id)
        WHERE id = $8
        RETURNING *;
    `;

    const res = await pool.query(query, [
        name || null,
        date_of_birth || null,
        phone_number || null,
        national_id || null,
        gender || null,
        status || null,
        family_id || null,
        memberId
    ]);

    return res.rows[0];
};


const deleteMember = async (memberId) => {
    const query = 'DELETE FROM members WHERE id = $1 RETURNING *;';
    const res = await pool.query(query, [memberId]);
    return res.rows[0];
};

const executeDeathTransaction = async (data) => {
    const { memberId, churchId, familyId, isFamilyHead, newHeadId, eventDate, notes } = data;
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const updateMemberQuery = `
            UPDATE members SET status = 'DECEASED' WHERE id = $1 AND church_id = $2;
        `;
        await client.query(updateMemberQuery, [memberId, churchId]);

        const insertEventQuery = `
            INSERT INTO family_events (event_date, event_type, notes, member_id, church_id)
            VALUES ($1, 'DEATH', $2, $3, $4);
        `;
        await client.query(insertEventQuery, [eventDate, notes, memberId, churchId]);

        if (isFamilyHead) {
            const updateFamilyHeadQuery = `
                UPDATE families SET head_id = $1 WHERE id = $2 AND church_id = $3;
            `;
            await client.query(updateFamilyHeadQuery, [newHeadId, familyId, churchId]);
        }

        await client.query('COMMIT');
        return { memberId, isFamilyHead, newHeadId, status: 'DECEASED' };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};


export default {
    findFamilyInChurch,
    findMemberByNationalId,
    createNewMember, 
    getAllMembers,
    getMembersCount , 
    findMemberByIdAndChurch,
    updateMember,
    deleteMember,
    executeDeathTransaction

};
