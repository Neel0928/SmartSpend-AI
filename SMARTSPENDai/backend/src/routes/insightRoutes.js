const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getInsights, scanReceipt, getBudgetInsights } = require('../controllers/insightController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', protect, getInsights);
router.post('/scan-receipt', protect, upload.single('receipt'), scanReceipt);
router.post('/budgets', protect, getBudgetInsights);

module.exports = router;
