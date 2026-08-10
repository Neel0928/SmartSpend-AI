import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: '1 May', budget: 50000, spent: 0 },
  { name: '8 May', budget: 50000, spent: 8500 },
  { name: '15 May', budget: 50000, spent: 18200 },
  { name: '22 May', budget: 50000, spent: 25400 },
  { name: '29 May', budget: 50000, spent: 31200 },
  { name: '31 May', budget: 50000, spent: 34250 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-purple-100 text-sm">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <p className="text-purple-600 font-medium">Budget: ₹{payload[0].value.toLocaleString()}</p>
        <p className="text-blue-600 font-medium">Spent: ₹{payload[1].value.toLocaleString()}</p>
        <p className="text-gray-500 text-xs mt-1">
          {Math.round((payload[1].value / payload[0].value) * 100)}% used
        </p>
      </div>
    );
  }
  return null;
};

export default function BudgetOverviewChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-purple-400 rounded-full border-t border-purple-400 border-dashed border-2"></div>
            <span className="text-xs text-gray-500 font-medium">Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500 font-medium">Spent</span>
          </div>
        </div>
        <select className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => `₹${value >= 1000 ? value / 1000 + 'k' : value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* The Budget line is a dashed line */}
            <Area
              type="monotone"
              dataKey="budget"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              activeDot={false}
            />
            {/* The Spent line is a solid line with area gradient */}
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSpent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <button className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1">
          View Detailed Report &rarr;
        </button>
      </div>
    </div>
  );
}
