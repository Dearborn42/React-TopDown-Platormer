import express from 'express';
import { getLeaderboard, editLeaderboard } from '../controllers/leaderboard-controller.js';
const router = express.Router();

router.get('/get', getLeaderboard);
router.put("/edit", editLeaderboard);

export default router