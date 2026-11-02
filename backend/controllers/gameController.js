const axios = require('axios');
const pool = require('../db/connection');

const getQuestion = async (req, res) => {
  try {
    const response = await axios.get('https://marcconrad.com/uob/banana/api.php');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};

const submitScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.userId;
    
    if (score === undefined || score === null) {
      return res.status(400).json({ error: 'Score required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO scores (user_id, score) VALUES (?, ?)',
      [userId, score]
    );
    
    const [scores] = await pool.query('SELECT * FROM scores WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ score: scores[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const [leaderboard] = await pool.query(
      `SELECT u.username, s.score, s.created_at 
       FROM scores s 
       JOIN users u ON s.user_id = u.id 
       ORDER BY s.score DESC, s.created_at ASC 
       LIMIT 100`
    );
    
    res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getQuestion, submitScore, getLeaderboard };
