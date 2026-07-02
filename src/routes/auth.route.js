import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { registerSchema } from '../validations/auth.validation.js';


const router = express.Router();

router.post('/register', validate(registerSchema),authController.register);

router.post('/login' , authController.login);

// router.get('/getProfile' , authMiddleware , authController.getProfile);
// router.put('/updateUser', authMiddleware , authController.updateUser);
// router.put('/changePassword' , authMiddleware , authController.changePassword);
 router.delete('/logout', authMiddleware , authController.logout);

export default router ;

