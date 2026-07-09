import express from 'express';

import dotenv from 'dotenv';
dotenv.config();
import './src/config/db.js';

import authRoutes from './src/routes/auth.route.js';
import errorHandler from './src/middlewares/error.middleware.js';
import familyRoutes from './src/routes/family.route.js';
import memberRoutes from './src/routes/member.route.js';

const app = express();

app.use(express.json());

app.use('/api/auth',authRoutes);

app.use('/api/families',familyRoutes);

app.use('/api/members' , memberRoutes);


// app.get('/get/health',(req , res)=>{
//     res.json({
//         statuse : "success" , message : "App is running smoothly!"
//     });
// });

app.use(errorHandler);

export default app ; 

