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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Add Funds</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl flex justify-center items-center gap-2">
              <ArrowUpCircle className="w-5 h-5" />
              {successMsg}
            </div>
          )}

          <div className="text-center mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{goal.title}</h3>
            <div className="flex justify-between items-center text-sm mt-3 px-4">
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-xs">Target</span>
                <span className="font-semibold text-gray-900">₹{goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-xs">Saved</span>
                <span className="font-semibold text-blue-600">₹{goal.currentAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-xs">Remaining</span>
                <span className="font-semibold text-gray-900">₹{goal.remaining.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-gray-700">Amount to Add (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                type="number"
                required
                min="1"
                max={goal.remaining}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 disabled:opacity-70"
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
