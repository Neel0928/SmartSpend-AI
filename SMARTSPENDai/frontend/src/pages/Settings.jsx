import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Bell, Palette, CreditCard, Save, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { updateSettings as apiUpdateSettings } from '../services/settingsService';
import { updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { settings, setSettings, refreshSettings } = useSettings();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Local state for forms
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [currency, setCurrency] = useState(settings?.currency || 'INR');
  const [theme, setTheme] = useState(settings?.theme || 'light');
  const [notifications, setNotifications] = useState(settings?.notifications ?? true);
  const [monthlyBudget, setMonthlyBudget] = useState(settings?.monthlyBudget || 0);

  useEffect(() => {
    if (settings) {
      setCurrency(settings.currency || 'INR');
      setTheme(settings.theme || 'light');
      setNotifications(settings.notifications ?? true);
      setMonthlyBudget(settings.monthlyBudget || 0);
    }
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      showMessage('Profile updated successfully!');
    } catch (error) {
      showMessage('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      showMessage('Failed to log out', 'error');
    }
  };

  const handlePreferencesSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await apiUpdateSettings({
        currency,
        theme,
        monthlyBudget: Number(monthlyBudget),
        notifications
      });
      setSettings(updated);
      showMessage('Preferences saved successfully!');
    } catch (error) {
      showMessage('Failed to save preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout hideHeaderControls={true}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your account and preferences.</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'profile' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              Account Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'preferences' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Palette className="w-5 h-5" />
              App Preferences
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'billing' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Billing & Plan
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
            </button>
            <div className="flex-grow"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-red-600 hover:bg-red-50 mt-4"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-6 max-w-md animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Account Profile</h3>
                  <p className="text-sm text-gray-500 mb-6">Update your personal information.</p>
                </div>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-sm">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      currentUser?.email?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button type="button" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Change Avatar
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-600/20 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <form onSubmit={handlePreferencesSave} className="space-y-8 max-w-md animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">App Preferences</h3>
                  <p className="text-sm text-gray-500 mb-6">Customize how SMARTSPEND AI looks and feels.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Display Currency</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setCurrency(c.code)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          currency === c.code 
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500' 
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl font-bold mb-1">{c.symbol}</span>
                        <span className="text-xs font-medium">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>



                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Overall Monthly Budget (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {CURRENCIES.find(c => c.code === currency)?.symbol || '₹'}
                    </span>
                    <input
                      type="number"
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Set a global limit for your total monthly expenses.</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-600/20 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-md animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Notifications</h3>
                  <p className="text-sm text-gray-500 mb-6">Manage how we contact you.</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Alerts</h4>
                    <p className="text-xs text-gray-500 mt-1">Receive weekly summaries and over-budget warnings.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications} 
                      onChange={() => setNotifications(!notifications)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handlePreferencesSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-600/20 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div className="space-y-6 max-w-md animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Billing & Plan</h3>
                  <p className="text-sm text-gray-500 mb-6">Manage your subscription.</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-2.5 py-1 bg-white/20 rounded-md text-xs font-bold tracking-wider uppercase backdrop-blur-sm">Free Plan</span>
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Basic Tier</h4>
                    <p className="text-blue-200 text-sm mb-6">You are currently using the free tier of SMARTSPEND AI. Upgrade to access premium AI insights and unlimited receipts.</p>
                    <button className="w-full py-2.5 bg-white text-gray-900 rounded-xl text-sm font-bold transition-all hover:shadow-lg">
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
