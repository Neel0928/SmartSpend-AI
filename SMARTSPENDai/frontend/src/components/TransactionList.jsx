import React from 'react';
import { Utensils, ArrowDownCircle, Car, ShoppingBag, Zap, DollarSign, Briefcase, Plus, HeartPulse } from 'lucide-react';

const categoryIcons = {
  'Food & Dining': { icon: Utensils, bg: 'bg-red-500/20', text: 'text-red-400' },
  'Shopping': { icon: ShoppingBag, bg: 'bg-blue-500/20', text: 'text-blue-400' },
  'Transportation': { icon: Car, bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  'Bills & Utilities': { icon: Zap, bg: 'bg-purple-500/20', text: 'text-purple-400' },
  'Entertainment': { icon: DollarSign, bg: 'bg-orange-500/20', text: 'text-orange-400' },
  'Health': { icon: HeartPulse, bg: 'bg-pink-500/20', text: 'text-pink-400' },
  'Salary': { icon: Briefcase, bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  'Freelance': { icon: DollarSign, bg: 'bg-teal-500/20', text: 'text-teal-400' },
  'default': { icon: Plus, bg: 'bg-white/10', text: 'text-gray-400' }
};

export default function TransactionList({ transactions, loading }) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 border border-white/10 h-full flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 h-full flex flex-col max-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white">Recent Transactions</h3>
        <button className="text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">View All</button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
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
                    <p className="text-sm font-semibold text-white truncate max-w-[120px]">{tx.name}</p>
                    <p className="text-xs text-gray-400">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{dateStr}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
