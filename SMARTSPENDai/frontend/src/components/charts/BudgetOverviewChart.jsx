import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function BudgetOverviewChart({ budgets = [], currencySymbol = '₹' }) {
  const data = budgets.map((budget) => ({
    name: budget.category,
    budget: budget.limit || budget.limitAmount || 0,
    spent: budget.spent || 0,
  }));

  if (data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-sm text-gray-500">
        Create a budget to see its spending overview.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="mb-6">
        <h3 className="font-bold text-white">Budget Overview</h3>
        <p className="text-xs text-gray-500 mt-1">Current month by category</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(value) => `${currencySymbol}${value >= 1000 ? `${value / 1000}k` : value}`} />
            <Tooltip
              formatter={(value) => `${currencySymbol}${Number(value).toLocaleString()}`}
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
              labelStyle={{ color: '#f9fafb' }}
            />
            <Legend />
            <Bar dataKey="budget" name="Budget" fill="#a855f7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spent" name="Spent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
