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

const getFamilies = async (churchId , search) =>{

  let query = 'select * from families where church_id = $1';

  const params = [churchId];
  
  if(search){

    query +=' and (name ilike $2 or place ilike $2 or phone_number ilike $2)';
    params.push(`%${search}%`);
  }

query += ' order by id desc' ; 

    const res = await pool.query(query , params);
    return res.rows ;

}

const findFamilyById = async (familyId) =>{
    let query = 'select * from families where id = $1 ' ; 
    const res = await pool.query(query , [familyId]);
    return res.rows[0];

}

const updateFamily = async (familyId , familyData) =>{

    const {name , place , phone_number}  = familyData ;
    const query = 'update families set name = $1 , place = $2 , phone_number = $3 where id = $4 returning *';
    const res = await pool.query(query , [name , place , phone_number , familyId ]);
    return res.rows[0];
};

const deleteFamily = async (familyId) =>{
const query = 'delete from families where id = $1 returning *';
const res = await pool.query (query , [familyId]);
return res.rows[0];

};

export default {
    createFamily,
    findFamilyByPhone,
    getFamilies,
    findFamilyById,
    updateFamily,
    deleteFamily
};

