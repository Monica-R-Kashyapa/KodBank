const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const verifyToken = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Verify token exists in database
    const [tokens] = await pool.execute(
      'SELECT * FROM UserToken WHERE token = ? AND uid = ? AND expiry > NOW()',
      [token, decoded.uid]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ error: 'Token not found or expired.' });
    }

    // Attach user info to request
    req.user = {
      username: decoded.sub,
      role: decoded.role,
      uid: decoded.uid
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

module.exports = { verifyToken };
