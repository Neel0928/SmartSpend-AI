import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function AddTransactionModal({ isOpen, onClose, onTransactionAdded, initialData = null }) {
  const { currencySymbol } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.merchantName || '',
        amount: initialData.totalAmount ? String(initialData.totalAmount) : '',
        type: 'expense',
        category: initialData.category || 'Food & Dining',
        date: initialData.date || new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const categories = {
    expense: ['Food & Dining', 'Shopping', 'Transportation', 'Bills & Utilities', 'Entertainment', 'Health', 'Others'],
    income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Others']
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Auto-update category when type changes if current category isn't valid for new type
    if (e.target.name === 'type') {
      const validCategories = categories[e.target.value];
      if (!validCategories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: validCategories[0] }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/transactions', {
        ...formData,
        amount: Number(formData.amount)
      });
      onTransactionAdded();
      onClose();
      // Reset form
      setFormData({
        name: '', amount: '', type: 'expense', category: 'Food & Dining', date: new Date().toISOString().split('T')[0], description: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card border border-white/10 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input 
                type="radio" name="type" value="expense" className="peer sr-only" 
                checked={formData.type === 'expense'} onChange={handleChange} 
              />
              <div className="text-center py-2 px-4 rounded-lg border border-white/10 peer-checked:border-red-500 peer-checked:bg-red-500/20 peer-checked:text-red-400 text-gray-400 hover:bg-white/5 font-medium transition-colors">
                Expense
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input 
                type="radio" name="type" value="income" className="peer sr-only" 
                checked={formData.type === 'income'} onChange={handleChange} 
              />
              <div className="text-center py-2 px-4 rounded-lg border border-white/10 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/20 peer-checked:text-emerald-400 text-gray-400 hover:bg-white/5 font-medium transition-colors">
                Income
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount ({currencySymbol})</label>
            <input 
              type="number" name="amount" required min="1" step="any"
              value={formData.amount} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 placeholder-gray-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input 
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 placeholder-gray-500 outline-none"
              placeholder="e.g. Zomato, Salary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select 
                name="category" required
                value={formData.category} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 outline-none"
              >
                {categories[formData.type].map(c => (
                  <option key={c} value={c} className="bg-[#050505] text-white">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input 
                type="date" name="date" required
                value={formData.date} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
