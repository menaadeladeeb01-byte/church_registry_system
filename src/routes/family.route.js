import express from 'express';
import familyController from '../controllers/family.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/addFamily', authMiddleware, familyController.addFamily);

export default router ; 
