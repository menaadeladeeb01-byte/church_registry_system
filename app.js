import express from 'express';

import dotenv from 'dotenv';
dotenv.config();
import './src/config/db.js';

import authRoutes from './src/routes/auth.route.js';
import errorHandler from './src/middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use('/api/auth',authRoutes);

// app.get('/get/health',(req , res)=>{
//     res.json({
//         statuse : "success" , message : "App is running smoothly!"
//     });
// });

app.use(errorHandler);

export default app ; 

