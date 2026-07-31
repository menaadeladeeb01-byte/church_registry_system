import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req , file , cb)=>{

    const isExcel =
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel'; 

    if(isExcel){
        cb(null , true );
    }else{
    cb(new Error ('عفواً، يرجى رفع ملف Excel فقط!'), false);  
 }
};

export const uploadExcel = multer ({
storage , 
fileFilter , 
limits : {fileSize : 5 * 1024 * 1024}

});