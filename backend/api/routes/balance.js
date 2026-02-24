const express = require('express');
const { verifyToken } = require('../middleware/auth');
const pool = require('../db/connection');

const router = express.Router();

// Balance check endpoint (protected)
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const username = req.user.username;

    // Fetch balance from database
    const [users] = await pool.execute(
      'SELECT balance FROM KodUser WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const balance = parseFloat(users[0].balance);

    res.status(200).json({
      balance: balance,
      message: 'Balance retrieved successfully'
    });
  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({ error: 'Internal server error while fetching balance.' });
  }
});

module.exports = router;
