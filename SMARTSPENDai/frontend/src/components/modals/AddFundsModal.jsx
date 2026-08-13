import React, { useState } from 'react';
import { X, Loader2, ArrowUpCircle } from 'lucide-react';
import { contributeToGoal } from '../../services/goalService';

export default function AddFundsModal({ isOpen, onClose, goal, onFundsAdded }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const addAmount = Number(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (addAmount > goal.remaining) {
      setError(`Cannot exceed the target. Maximum allowed: ₹${goal.remaining.toLocaleString()}`);
      return;
    }

    try {
      setLoading(true);
      await contributeToGoal(goal._id, addAmount);
      
      setSuccessMsg('Goal updated successfully!');
      setTimeout(() => {
        onFundsAdded();
        onClose();
        setAmount('');
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">Add Funds</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex justify-center items-center gap-2">
              <ArrowUpCircle className="w-5 h-5" />
              {successMsg}
            </div>
          )}

          <div className="text-center mb-2">
            <h3 className="font-bold text-white text-lg">{goal.title}</h3>
            <div className="flex justify-between items-center text-sm mt-3 px-4">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs">Target</span>
                <span className="font-semibold text-white">₹{goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs">Saved</span>
                <span className="font-semibold text-blue-400">₹{goal.currentAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs">Remaining</span>
                <span className="font-semibold text-white">₹{goal.remaining.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-gray-300">Amount to Add (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                type="number"
                required
                min="1"
                max={goal.remaining}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-white/10 text-lg font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-black/40"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:bg-blue-600"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Adding...' : 'Add Funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
