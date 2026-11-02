const express = require('express');
const router = express.Router();
const { getQuestion, submitScore, getLeaderboard } = require('../controllers/gameController');
const authMiddleware = require('../middleware/auth');

router.get('/question', authMiddleware, getQuestion);
router.post('/score', authMiddleware, submitScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
