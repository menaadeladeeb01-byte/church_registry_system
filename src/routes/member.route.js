import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import memberController from "../controllers/member.controller.js";

const router = express.Router();

router.post('/',authMiddleware , memberController.addMember);
router.get('/' , authMiddleware , memberController.getAllMembers);
router.put('/:id' , authMiddleware , memberController.updateMember);
router.delete('/:id' , authMiddleware , memberController.deleteMember);


router.post('/events/death' , authMiddleware , memberController.recordDeathEvent);
router.get('/search' , authMiddleware , memberController.searchMembers);

export default router ;




import { uploadExcel } from '../middlewares/upload.middleware.js';
import { bulkUploadMembers } from '../controllers/member.controller.js';

// ⚠️ لاحظ السلسلة: 1. فحص التوكن -> 2. استقبال الملف مفتاحه 'file' -> 3. الـ Controller
router.post('/upload-excel', authMiddleware, uploadExcel.single('file'), bulkUploadMembers);
