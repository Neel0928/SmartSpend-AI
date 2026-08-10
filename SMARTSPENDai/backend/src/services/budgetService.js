return {
  _id: budget._id,
  category: budget.category,
  limit,
  spent,
  remaining,
  percentage,
  status,
  month: budget.month,
  year: budget.year,
  createdAt: budget.createdAt,
  updatedAt: budget.updatedAt
};
};

module.exports = {
  calculateBudgetStatus
};
