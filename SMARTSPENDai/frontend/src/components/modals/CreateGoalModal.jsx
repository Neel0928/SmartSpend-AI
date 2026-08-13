import React, { useState } from 'react';
import { X, Target, Calendar, Loader2, Car, Plane, Home, Laptop, Gift, Wallet, GraduationCap, Heart } from 'lucide-react';
import { createGoal } from '../../services/goalService';

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

export default function CreateGoalModal({ isOpen, onClose, onGoalCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    icon: 'wallet',
    color: 'bg-blue-500'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetAmountNum = Number(formData.targetAmount);
    if (!formData.title || isNaN(targetAmountNum) || targetAmountNum <= 0) {
      setError('Please provide a valid title and target amount greater than 0.');
      return;
    }

    try {
      setLoading(true);
      await createGoal({
        title: formData.title,
        targetAmount: targetAmountNum,
        deadline: formData.deadline || null,
        icon: formData.icon,
        color: formData.color
      });
      
      setFormData({
        title: '',
        targetAmount: '',
        deadline: '',
        icon: 'wallet',
        color: 'bg-blue-500'
      });
      onGoalCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">Create Savings Goal</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Goal Title</label>
            <input
              type="text"
              required
              placeholder="e.g., New Car, Vacation"
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-black/40"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Target Amount (₹)</label>
            <div className="relative">
              <Target className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-black/40"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Target Deadline <span className="text-gray-500 font-normal">(Optional)</span></label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-black/40 css-invert-calendar-icon"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Select Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({...formData, icon: name})}
                  className={`flex justify-center items-center py-2 rounded-xl border transition-all ${
                    formData.icon === name 
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                      : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Select Color</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-8 h-8 rounded-full ${color} flex items-center justify-center transition-transform ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[#121212] ring-blue-500 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:bg-blue-600"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
