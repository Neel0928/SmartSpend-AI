import React from 'react';
import { Laptop, Plane, ShieldCheck, Car, Home, Gift, Wallet, GraduationCap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockGoals = [
  { name: 'Buy MacBook', saved: 45000, target: 80000, icon: Laptop, bg: 'bg-blue-100', text: 'text-blue-500', color: 'bg-blue-600' },
  { name: 'Goa Trip', saved: 12500, target: 25000, icon: Plane, bg: 'bg-green-100', text: 'text-green-500', color: 'bg-green-500' },
  { name: 'Emergency Fund', saved: 35000, target: 100000, icon: ShieldCheck, bg: 'bg-orange-100', text: 'text-orange-500', color: 'bg-orange-400' },
];

const ICON_MAP = {
  'wallet': Wallet,
  'car': Car,
  'plane': Plane,
  'home': Home,
  'laptop': Laptop,
  'gift': Gift,
  'graduation-cap': GraduationCap,
  'heart': Heart
};

export default function GoalList({ customGoals }) {
  const navigate = useNavigate();
  
  const displayGoals = customGoals ? customGoals.map(g => ({
    name: g.title,
    saved: g.currentAmount,
    target: g.targetAmount,
    icon: ICON_MAP[g.icon] || Wallet,
    color: g.color || 'bg-blue-500',
    bg: (g.color || 'bg-blue-500').replace('bg-', 'bg-').replace('500', '100'),
    text: (g.color || 'bg-blue-500').replace('bg-', 'text-')
  })).slice(0, 3) : mockGoals; // Show top 3 max

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">Goals Progress</h3>
        <button onClick={() => navigate('/goals')} className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
      </div>

      <div className="flex-1 space-y-5">
        {displayGoals.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">No active goals yet.</div>
        ) : (
          displayGoals.map((goal, idx) => {
            const percentage = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${goal.bg} ${goal.text}`}>
                      <goal.icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{goal.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      ₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}
                    </p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{percentage}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div 
                    className={`${goal.color} h-1.5 rounded-full`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
