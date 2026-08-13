import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function SpendingChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white">Spending Overview</h3>
        <select className="text-sm text-gray-300 bg-white/5 border border-white/10 rounded-md px-2 py-1 outline-none">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div className="flex-1 flex items-center">
        {/* Doughnut Chart */}
        <div className="w-1/2 relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
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
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-400 font-medium">Total</span>
            <span className="text-lg font-bold text-white">₹{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-1/2 pl-4 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <div 
                className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <span className="text-gray-300 truncate flex-1">{item.name}</span>
              <span className="font-medium text-white ml-2 text-right">
                ₹{item.value.toLocaleString()}
              </span>
              <span className="text-gray-400 w-8 text-right ml-1">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <button className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
          View Full Analytics &rarr;
        </button>
      </div>
    </div>
  );
}
