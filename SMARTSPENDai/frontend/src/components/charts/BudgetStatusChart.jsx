import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function BudgetStatusChart({ budgets = [] }) {
  // Compute chart data dynamically
  let onTrack = 0;
  let nearLimit = 0;
  let overBudget = 0;
  let notUsed = 0;
  
  let totalLimit = 0;
  let totalSpent = 0;

  budgets.forEach(b => {
    const bLimit = b.limit || b.limitAmount || 0;
    totalLimit += bLimit;
    totalSpent += b.spent || 0;
    
    if (bLimit === 0) return;
    
    const percentage = ((b.spent || 0) / bLimit) * 100;
    if (percentage === 0) {
      notUsed++;
    } else if (percentage >= 100) {
      overBudget++;
    } else if (percentage >= 80) {
      nearLimit++;
    } else {
      onTrack++;
    }
  });

  const data = [
    { name: 'On Track', value: onTrack, color: '#22c55e' }, // Green
    { name: 'Near Limit', value: nearLimit, color: '#f59e0b' }, // Orange
    { name: 'Over Budget', value: overBudget, color: '#ef4444' }, // Red
    { name: 'Not Used', value: notUsed, color: '#9ca3af' }, // Gray
  ].filter(d => d.value > 0);

  // Fallback if no budgets
  if (data.length === 0) {
    data.push({ name: 'No Budgets', value: 1, color: '#e5e7eb' });
  }

  const overallPercentage = totalLimit > 0 ? ((totalSpent / totalLimit) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="h-[200px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 500 }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-xl font-bold text-gray-900">{overallPercentage}%</p>
          <p className="text-xs text-gray-500 font-medium">Used</p>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-4 space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
