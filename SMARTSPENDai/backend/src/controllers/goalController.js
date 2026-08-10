const Goal = require('../models/Goal');

// Helper to calculate extra fields and auto-expire
const processGoal = async (goalDoc) => {
  const goal = goalDoc.toObject();
  const now = new Date();
  
  // Auto-expire if deadline passed and not completed
  if (goal.status === 'active' && goal.deadline && new Date(goal.deadline) < now) {
    goal.status = 'expired';
    await Goal.findByIdAndUpdate(goal._id, { status: 'expired' });
  }

  goal.remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  
  let progress = (goal.currentAmount / goal.targetAmount) * 100;
  goal.progress = Math.min(100, Math.max(0, Math.round(progress)));

  return goal;
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    const processedGoals = await Promise.all(goals.map(processGoal));
    res.json(processedGoals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    const processedGoal = await processGoal(goal);
    res.json(processedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, color, icon } = req.body;
    
    if (!title || !targetAmount || targetAmount <= 0) {
      return res.status(400).json({ message: 'Title and valid target amount are required' });
    }

    const goal = await Goal.create({
      userId: req.user.uid,
      title,
      targetAmount,
      currentAmount: 0,
      deadline,
      color,
      icon,
      status: 'active'
    });

    const processedGoal = await processGoal(goal);
    res.status(201).json(processedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, color, icon } = req.body;
    
    // Do not allow currentAmount to be updated directly here
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (targetAmount !== undefined) updateData.targetAmount = targetAmount;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;

    let goal = await Goal.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal = await Goal.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    // Check if targetAmount changed and we need to update status
    if (goal.currentAmount >= goal.targetAmount && goal.status !== 'completed') {
      goal = await Goal.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    } else if (goal.currentAmount < goal.targetAmount && goal.status === 'completed') {
      goal = await Goal.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    }

    const processedGoal = await processGoal(goal);
    res.json(processedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.contributeToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Contribution amount must be greater than 0' });
    }

    let goal = await Goal.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    if (goal.status === 'completed') {
      return res.status(400).json({ message: 'Goal is already completed' });
    }

    const remaining = goal.targetAmount - goal.currentAmount;
    if (amount > remaining) {
      return res.status(400).json({ message: `Cannot overfund goal. Maximum contribution is ${remaining}` });
    }

    const newAmount = goal.currentAmount + amount;
    let newStatus = goal.status;
    
    if (newAmount >= goal.targetAmount) {
      newStatus = 'completed';
    }

    goal = await Goal.findByIdAndUpdate(
      req.params.id, 
      { 
        currentAmount: newAmount,
        status: newStatus
      }, 
      { new: true }
    );

    const processedGoal = await processGoal(goal);
    res.json(processedGoal);
  } catch (error) {
    // Handle Mongoose cast errors gracefully
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Goal not found (invalid ID)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
