import React from 'react';
import { Utensils, ArrowDownCircle, Car, ShoppingBag, Zap, DollarSign, Briefcase, Plus, HeartPulse } from 'lucide-react';

const categoryIcons = {
  'Food & Dining': { icon: Utensils, bg: 'bg-red-100', text: 'text-red-500' },
  'Shopping': { icon: ShoppingBag, bg: 'bg-blue-100', text: 'text-blue-500' },
  'Transportation': { icon: Car, bg: 'bg-indigo-100', text: 'text-indigo-500' },
  'Bills & Utilities': { icon: Zap, bg: 'bg-purple-100', text: 'text-purple-500' },
  'Entertainment': { icon: DollarSign, bg: 'bg-orange-100', text: 'text-orange-500' },
  'Health': { icon: HeartPulse, bg: 'bg-pink-100', text: 'text-pink-500' },
  'Salary': { icon: Briefcase, bg: 'bg-green-100', text: 'text-green-500' },
  'Freelance': { icon: DollarSign, bg: 'bg-teal-100', text: 'text-teal-500' },
  'default': { icon: Plus, bg: 'bg-gray-100', text: 'text-gray-500' }
};

export default function TransactionList({ transactions, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full flex flex-col max-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No transactions yet. Add one!
          </div>
        ) : (
          transactions.map((tx) => {
            const style = categoryIcons[tx.category] || categoryIcons.default;
            const Icon = style.icon;
            const dateStr = new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

            return (
              <div key={tx._id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bg} ${style.text}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{tx.name}</p>
                    <p className="text-xs text-gray-500">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{dateStr}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
