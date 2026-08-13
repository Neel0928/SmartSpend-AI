import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardInsights } from '../services/aiService';
import {
  LayoutDashboard,
  WalletCards,
  ArrowDownToLine,
  PieChart,
  Target,
  BarChart3,
  FileText,
  ScanLine,
  Sparkles,
  Settings,
  ChevronDown,
  Loader2
} from 'lucide-react';

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const [insight, setInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login'; // Alternatively use useNavigate if imported
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    const fetchInsight = async () => {
      if (!currentUser) return;
      try {
        setLoadingInsight(true);
        const data = await getDashboardInsights();
        setInsight(data.insight || 'No insights available right now.');
      } catch (error) {
        setInsight('Could not load AI insight.');
      } finally {
        setLoadingInsight(false);
      }
    };
    
    fetchInsight();
  }, [currentUser]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: WalletCards },
    { name: 'Income', path: '/income', icon: ArrowDownToLine },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },

    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/10 h-screen flex flex-col text-gray-300 relative z-20">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          S
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">SmartSpend AI</h1>
          <p className="text-[10px] text-gray-400">AI-Powered Finance Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${isActive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 opacity-80" strokeWidth={1.5} />
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-auto text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded border border-white/20">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* AI Insight Quick Card */}
      <div className="px-4 pb-4">
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 text-white mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold">AI Insight</span>
          </div>
          {loadingInsight ? (
            <div className="flex justify-center items-center py-3">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
          ) : (
            <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3">
              {insight}
            </p>
          )}
          <Link to="/analytics" className="block w-full text-center py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors">
            View Details &rarr;
          </Link>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 relative">
        <button 
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border border-white/20">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold">{currentUser?.email?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.displayName || 'User Profile'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentUser?.email}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {/* Dropdown Menu */}
        {profileMenuOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 bg-[#121212] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
            <Link to="/settings" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
              View Profile
            </Link>
            <Link to="/settings" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
              Settings
            </Link>
            <button 
              onClick={handleLogout} 
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
