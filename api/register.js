const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('DB_HOST:', process.env.DB_HOST ? 'SET' : 'MISSING');
console.log('DB_USER:', process.env.DB_USER ? 'SET' : 'MISSING');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'MISSING');
console.log('DB_NAME:', process.env.DB_NAME ? 'SET' : 'MISSING');
console.log('DB_PORT:', process.env.DB_PORT ? 'SET' : 'MISSING');
console.log('DB_SSL:', process.env.DB_SSL ? 'SET' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING');

// Import the auth routes
const authRoutes = require('../backend/api/routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://kodnestkodbank.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export for Vercel
module.exports = (req, res) => {
  app(req, res);
};
