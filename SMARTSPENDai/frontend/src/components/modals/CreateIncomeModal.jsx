import React, { useState } from 'react';
import { X, Calendar, Tag, CreditCard, Landmark, FileText, CheckCircle } from 'lucide-react';
import { createTransaction } from '../../services/transactionService';
import { useSettings } from '../../context/SettingsContext';

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Gifts',
  'Other'
];

const PAYMENT_METHODS = [
  'Bank Transfer',
  'UPI',
  'Cash',
  'Cheque'
];

const ACCOUNTS = [
  'Main Account',
  'Savings Account',
  'Joint Account',
  'Business Account'
];

export default function CreateIncomeModal({ isOpen, onClose, onIncomeCreated }) {
  const { currencySymbol } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Salary',
    paymentMethod: 'Bank Transfer',
    account: 'Main Account',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createTransaction({
        ...formData,
        type: 'income',
        amount: Number(formData.amount)
      });
      
      setSuccess(true);
      setTimeout(() => {
        onIncomeCreated();
        onClose();
        setSuccess(false);
        setFormData({
          name: '',
          amount: '',
          category: 'Salary',
          paymentMethod: 'Bank Transfer',
          account: 'Main Account',
          date: new Date().toISOString().split('T')[0],
          description: ''
        });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">Add Income</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-100 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Income saved successfully!
            </div>
          )}

          <div className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">{currencySymbol}</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-8 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-lg text-green-600"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Source / Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Source / Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="e.g. Acme Corp, Web Project"
                />
              </div>
            </div>

            {/* Category & Date Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method & Account Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Payment Method</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="pl-9 pr-3 py-2.5 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                  >
                    {PAYMENT_METHODS.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Account</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Landmark className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    className="pl-9 pr-3 py-2.5 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                  >
                    {ACCOUNTS.map(acc => (
                      <option key={acc} value={acc}>{acc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes (Optional)</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                  placeholder="Add details about this income..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : success ? (
                'Saved!'
              ) : (
                'Save Income'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
