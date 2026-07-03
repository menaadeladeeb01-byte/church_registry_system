import express from 'express';
import familyController from '../controllers/family.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/addFamily', authMiddleware, familyController.addFamily);
router.get('/getAllFamilies' , authMiddleware , familyController.getAllFamilies);
router.put('/updateFamily/:Id' , authMiddleware , familyController.updateFamily);
router.delete('/deleteFamily/:Id' , authMiddleware , familyController.deleteFamily);

export default router ; 
    