import React from 'react';
import { Utensils, ShoppingBag, Car, Tv, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const mockBudgets = [
  { name: 'Food & Dining', spent: 8450, limit: 10000, icon: Utensils, color: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-500' },
  { name: 'Shopping', spent: 6250, limit: 8000, icon: ShoppingBag, color: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-500' },
  { name: 'Transport', spent: 4850, limit: 6000, icon: Car, color: 'bg-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-500' },
  { name: 'Entertainment', spent: 3150, limit: 4000, icon: Tv, color: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-500' },
  { name: 'Bills & Utilities', spent: 4200, limit: 5000, icon: Zap, color: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-500' },
];

export default function BudgetList({ standalone = true, customBudgets = null }) {
  const { currencySymbol } = useSettings();
  const displayBudgets = customBudgets && customBudgets.length > 0
    ? customBudgets.map((b, index) => {
      // Assign alternating colors
      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-indigo-500'];
      const colorCls = colors[index % colors.length];
      return {
        name: b.category,
        spent: b.spent || 0,
        limit: b.limit || b.limitAmount || 0,
        icon: Utensils, // Fallback icon
        color: colorCls,
        bg: colorCls.replace('500', '100').replace('bg-', 'bg-'),
        text: colorCls.replace('bg-', 'text-')
      };
    })
    : [];

  const content = (
    <div className="flex-1 space-y-5">
      {displayBudgets.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">No active budgets yet.</div>
      ) : (
        displayBudgets.map((budget, idx) => {
          const percentage = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0;
          return (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${budget.bg} ${budget.text}`}>
                    <budget.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{budget.name}</p>
                    <p className="text-xs text-gray-400">{currencySymbol}{budget.spent.toLocaleString()} / {currencySymbol}{budget.limit.toLocaleString()}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-300">{percentage}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`${budget.color} h-2 rounded-full`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (!standalone) {
    return content;
  }

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white">Budget Status</h3>
        <span className="text-sm text-emerald-400 font-medium">{currentMonthYear}</span>
      </div>
      {content}
      <div className="mt-4 pt-4 border-t border-white/10">
        <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
          View All Budgets &rarr;
        </button>
      </div>
    </div>
  );
}
