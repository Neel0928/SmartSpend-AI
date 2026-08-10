const express = require('express');
const cors = require('cors');
require('dotenv').config();

const transactionRoutes = require('./routes/transactionRoutes');
const insightRoutes = require('./routes/insightRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic health check routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SMARTSPEND AI API is running' });
});

// We will plug in auth, transactions, budget routes here later
// app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app;
