import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function SummaryCard({ title, amount, trend, icon: Icon, iconBg, trendUp }) {
  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col h-full">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{amount}</p>
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-sm">
          {trendUp ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={`font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
          <span className="text-gray-400">from last month</span>
        </div>
      )}
    </div>
  );
}
