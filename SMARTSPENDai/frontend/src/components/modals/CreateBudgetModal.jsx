import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createBudget } from '../../services/budgetService';

export default function CreateBudgetModal({ isOpen, onClose, onBudgetCreated, currentMonthYear }) {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(currentMonthYear || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBudget({ category, limit: Number(limit), month });
      onBudgetCreated();
      onClose();
      setCategory('');
      setLimit('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create New Budget</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Health">Health</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
              placeholder="e.g. 5000"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 outline-none bg-gray-50 text-gray-500 cursor-not-allowed"
              value={month}
              readOnly
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
