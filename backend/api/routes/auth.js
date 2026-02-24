const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');
const crypto = require('crypto');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    // Check database connection first
    const connectionError = pool.getConnectionError();
    if (connectionError) {
      console.error('Database not connected:', connectionError.message);
      return res.status(503).json({
        error: 'Database service unavailable.',
        details: 'Unable to connect to the database. Please check your database configuration.'
      });
    }

    const { uid, username, password, email, phone, role } = req.body;

    // Basic validation
    if (!uid || !username || !password || !email) {
      return res.status(400).json({ error: 'User ID, username, password, and email are required.' });
    }

    // Ensure uid length fits varchar(36)
    if (String(uid).length > 36) {
      return res.status(400).json({ error: 'User ID must be 36 characters or fewer.' });
    }

    // Validate role: only customer (lowercase in DB enum)
    const normalizedRole = (role || 'customer').toLowerCase();
    if (!['customer'].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Only customer role is allowed for registration.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Phone is NOT NULL in DB schema, so make sure we have some value
    const safePhone = phone && String(phone).trim().length > 0 ? String(phone).trim() : 'N/A';

    // Check if uid, username, or email already exists
    const [existingUsers] = await pool.execute(
      'SELECT uid, username, email FROM KodUser WHERE uid = ? OR username = ? OR email = ?',
      [uid, username, email]
    );

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      if (existing.uid === uid) {
        return res.status(400).json({ error: 'User ID already exists.' });
      }
      if (existing.username === username) {
        return res.status(400).json({ error: 'Username already exists.' });
      }
      if (existing.email === email) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user (explicit uid because it is PK and NOT NULL)
    const insertData = {
      uid: String(uid),
      username,
      email,
      password: hashedPassword,
      phone: safePhone,
      role: normalizedRole,
      balance: 100000.0
    };

    const [result] = await pool.execute(
      'INSERT INTO KodUser (uid, username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        insertData.uid,
        insertData.username,
        insertData.email,
        insertData.password,
        insertData.phone,
        insertData.role,
        insertData.balance
      ]
    );

    // Return success response (excluding password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: result.insertId,
        username: insertData.username,
        email: insertData.email,
        phone: insertData.phone,
        role: insertData.role,
        balance: insertData.balance
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: 'Database connection failed. Please check your database configuration.',
        details: 'Unable to connect to the database server.'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error during registration.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    // Check database connection first
    const connectionError = pool.getConnectionError();
    if (connectionError) {
      console.error('Database not connected:', connectionError.message);
      return res.status(503).json({ 
        error: 'Database service unavailable.',
        details: 'Unable to connect to the database. Please check your database configuration.'
      });
    }

    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Find user by username
    const [users] = await pool.execute(
      'SELECT uid, username, email, password, role, balance FROM KodUser WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Generate JWT token
    const tokenPayload = {
      sub: user.username,
      role: user.role,
      uid: user.uid
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
      algorithm: 'HS256'
    });

    // Calculate expiry time
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    // Generate token id (tid) for UserToken table (varchar(36) PK)
    const tid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

    // Store token in database (explicit tid because it is PK and NOT NULL)
    await pool.execute(
      'INSERT INTO UserToken (tid, token, uid, expiry) VALUES (?, ?, ?, ?)',
      [tid, token, user.uid, expiryDate]
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    // Return success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: 'Database connection failed. Please check your database configuration.',
        details: 'Unable to connect to the database server.'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error during login.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
