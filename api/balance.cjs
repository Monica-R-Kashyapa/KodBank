const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import the routes
const authRoutes = require('../backend/api/routes/auth');
const balanceRoutes = require('../backend/api/routes/balance');

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
app.use('/api', balanceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export for Vercel
module.exports = (req, res) => {
  app(req, res);
};
