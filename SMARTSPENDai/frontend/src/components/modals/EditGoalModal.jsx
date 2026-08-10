import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Loader2, Car, Plane, Home, Laptop, Gift, Wallet, GraduationCap, Heart, Trash2 } from 'lucide-react';
import { updateGoal, deleteGoal } from '../../services/goalService';

const ICONS = [
  { name: 'wallet', icon: Wallet },
  { name: 'car', icon: Car },
  { name: 'plane', icon: Plane },
  { name: 'home', icon: Home },
  { name: 'laptop', icon: Laptop },
  { name: 'gift', icon: Gift },
  { name: 'graduation-cap', icon: GraduationCap },
  { name: 'heart', icon: Heart }
];

const COLORS = [
  'bg-blue-500', 
  'bg-purple-500', 
  'bg-green-500', 
  'bg-orange-500', 
  'bg-pink-500', 
  'bg-indigo-500'
];

export default function EditGoalModal({ isOpen, onClose, onGoalUpdated, goal }) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    icon: 'wallet',
    color: 'bg-blue-500'
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal && isOpen) {
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
        icon: goal.icon || 'wallet',
        color: goal.color || 'bg-blue-500'
      });
      setError('');
    }
  }, [goal, isOpen]);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetAmountNum = Number(formData.targetAmount);
    if (!formData.title || isNaN(targetAmountNum) || targetAmountNum <= 0) {
      setError('Please provide a valid title and target amount greater than 0.');
      return;
    }

    if (targetAmountNum < goal.currentAmount) {
      setError(`Target amount cannot be less than the currently saved amount (₹${goal.currentAmount}).`);
      return;
    }

    try {
      setLoading(true);
      await updateGoal(goal._id, {
        title: formData.title,
        targetAmount: targetAmountNum,
        deadline: formData.deadline || null,
        icon: formData.icon,
        color: formData.color
      });
      onGoalUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the goal "${goal.title}"? This cannot be undone.`)) {
      try {
        setDeleteLoading(true);
        await deleteGoal(goal._id);
        onGoalUpdated();
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete goal');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Edit Savings Goal</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Goal Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Target Amount</label>
            <div className="relative">
              <Target className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="number"
                required
                min={goal.currentAmount}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              />
            </div>
            {goal.currentAmount > 0 && (
              <p className="text-xs text-gray-500 mt-1">Cannot be less than the ₹{goal.currentAmount} already saved.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Target Deadline <span className="text-gray-400 font-normal">(Optional)</span></label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Select Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({...formData, icon: name})}
                  className={`flex justify-center items-center py-2 rounded-xl border transition-all ${
                    formData.icon === name 
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm' 
                      : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Select Color</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-8 h-8 rounded-full ${color} flex items-center justify-center transition-transform ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || deleteLoading}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || deleteLoading}
              className="w-full py-3 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-70"
            >
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleteLoading ? 'Deleting...' : 'Delete Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
