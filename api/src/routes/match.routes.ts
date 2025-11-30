import { Router } from 'express';
import { getMatches } from '../controllers/match.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getMatches);

export default router;
