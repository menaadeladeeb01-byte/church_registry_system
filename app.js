import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import './src/config/db.js';

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.route.js';
import errorHandler from './src/middlewares/error.middleware.js';
import familyRoutes from './src/routes/family.route.js';
import memberRoutes from './src/routes/member.route.js';
import reportRoutes from './src/routes/report.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(helmet({
    contentSecurityPolicy: false, 
}));
app.use(cors({ 
    origin: '*', 
    credentials: true 
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'طلبات كثيرة جداً من هذا الجهاز! يرجى المحاولة بعد 15 دقيقة.'
    }
});
app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/reports', reportRoutes);

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (req, res) => {
    res.json({ success: true, message: "App is running smoothly on cloud!" });
});

app.use(errorHandler);

export default app;