const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

// Protect all goal routes with Firebase auth middleware
router.use(protect);

router.route('/')
  .get(goalController.getGoals)
  .post(goalController.createGoal);

router.route('/:id')
  .get(goalController.getGoal)
  .patch(goalController.updateGoal)
  .delete(goalController.deleteGoal);

router.post('/:id/contribute', goalController.contributeToGoal);

module.exports = router;
