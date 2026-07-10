import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import memberController from "../controllers/member.controller.js";

const router = express.Router();

router.post('/',authMiddleware , memberController.addMember);
router.get('/' , authMiddleware , memberController.getAllMembers);
router.put('/:id' , authMiddleware , memberController.updateMember);
router.delete('/:id' , authMiddleware , memberController.deleteMember);


router.post('/events/death' , authMiddleware , memberController.recordDeathEvent);

export default router ;


