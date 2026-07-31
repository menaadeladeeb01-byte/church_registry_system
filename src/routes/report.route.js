import express from 'express';
import authMiddleware from "../middlewares/auth.middleware.js";
import reportController from "../controllers/report.controller.js";


const router = express.Router();

router.get('/age-categories' , authMiddleware , reportController.getAgeCategories);

export default router ;

