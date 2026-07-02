import app from './app.js';
import express from 'express';
import pool from './src/config/db.js'; 


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Server is listening and flying on port ${PORT}...`);
});


