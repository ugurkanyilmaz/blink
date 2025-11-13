import { Router } from "express";
import {getMe, updateMe } from "../controllers/user.controller";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);

export default router;