import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, ChevronDown, Bell, Plus } from 'lucide-react';

export default function Header({ onAddClick, hideControls }) {
  const { currentUser } = useAuth();
  
  // Extract name from email or use displayName
  const getFirstName = () => {
    if (currentUser?.displayName) return currentUser.displayName.split(' ')[0];
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'User';
  };

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = 1;
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const currentMonthStr = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const dateRangeStr = `${firstDay} ${currentMonthStr} – ${lastDay} ${currentMonthStr} ${currentDate.getFullYear()}`;

  return (
    <header className="flex items-center justify-between py-6 px-8 bg-transparent">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span role="img" aria-label="wave">👋</span> 
          Welcome back, {getFirstName()}!
        </h2>
        <p className="text-gray-400 text-sm mt-1">Here's your financial overview for {currentMonthYear}</p>
      </div>

      {!hideControls && (
        <div className="flex items-center gap-4">
          {/* Date Selector */}
          <div className="flex items-center gap-2 glass-card border border-white/10 rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-white/5 transition-colors text-sm font-medium text-gray-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{dateRangeStr}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="w-10 h-10 glass-card border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors shadow-sm text-gray-400">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#050505]">
              3
            </span>
          </div>

          {/* Add Transaction Button */}
          <button 
            onClick={onAddClick}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      )}
    </header>
  );
}
