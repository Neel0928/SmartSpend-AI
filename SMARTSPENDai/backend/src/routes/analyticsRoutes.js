const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/category', analyticsController.getCategoryBreakdown);
router.get('/trend', analyticsController.getMonthlyTrend);

module.exports = router;
