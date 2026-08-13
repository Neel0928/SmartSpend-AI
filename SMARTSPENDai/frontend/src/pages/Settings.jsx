import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  User, Bell, Palette, Shield, CreditCard, Database, 
  Sparkles, Link2, LogOut, Save, Loader2, Info, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { updateSettings as apiUpdateSettings } from '../services/settingsService';
import { getUserProfile, updateUserProfile } from '../services/userService';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

const TIMEZONES = ['UTC', 'Asia/Kolkata', 'America/New_York', 'Europe/London', 'Australia/Sydney'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'];

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { settings, setSettings } = useSettings();
  
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Local state for Account form (DB profile)
  const [profile, setProfile] = useState({
    fullName: '',
    username: '',
    phone: '',
    country: '',
    timezone: 'UTC',
    avatarUrl: ''
  });

  // Local state for Settings form
  const [localSettings, setLocalSettings] = useState({
    currency: 'INR',
    language: 'en-US',
    dateFormat: 'DD/MM/YYYY',
    startOfWeek: 'Monday',
    theme: 'light',
    compactMode: false,
    animations: true,
    monthlyBudget: 0,
    budgetStartDate: 1,
    notifications: true,
    emailAlerts: true,
    budgetAlerts: true,
    goalReminders: true,
    aiInsightsNotifications: true,
    aiInsightsEnabled: true,
    smartAnalysis: true
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchingProfile(true);
        const data = await getUserProfile();
        setProfile({
          fullName: data.fullName || currentUser?.displayName || '',
          username: data.username || '',
          phone: data.phone || '',
          country: data.country || '',
          timezone: data.timezone || 'UTC',
          avatarUrl: data.avatarUrl || currentUser?.photoURL || ''
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setFetchingProfile(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(profile);
      showMessage('Profile updated successfully!');
    } catch (error) {
      showMessage('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await apiUpdateSettings(localSettings);
      setSettings(updated);
      showMessage('Settings saved successfully!');
    } catch (error) {
      showMessage('Failed to save settings', 'error');
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

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'privacy', label: 'Data & Privacy', icon: Database },
    { id: 'ai', label: 'AI Settings', icon: Sparkles },
  ];

  return (
    <DashboardLayout hideHeaderControls={true}>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your SmartSpend AI experience</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {message.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 glass-card rounded-2xl border border-white/10 p-8">
            
            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <form onSubmit={handleProfileSave} className="space-y-6 animate-fade-in max-w-xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Account</h3>
                  <p className="text-sm text-gray-400 mb-6">Manage your profile information.</p>
                </div>
                
                {fetchingProfile ? (
                  <div className="flex items-center gap-2 text-emerald-400"><Loader2 className="w-5 h-5 animate-spin"/> Loading Profile...</div>
                ) : (
                  <>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold border border-emerald-500/30 overflow-hidden">
                        {profile.avatarUrl ? (
                          <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          profile.fullName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <button type="button" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors">
                        Change Profile Image
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                        <input type="text" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Username</label>
                        <input type="text" value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Email Address (Managed by Firebase)</label>
                      <input type="email" value={currentUser?.email || ''} disabled className="w-full px-4 py-2 rounded-lg border border-white/5 bg-black/20 text-gray-500 cursor-not-allowed text-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Phone Number</label>
                        <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Country</label>
                        <select value={profile.country} onChange={(e) => setProfile({...profile, country: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors">
                          <option value="">Select Country</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <form onSubmit={handleSettingsSave} className="space-y-6 animate-fade-in max-w-xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Preferences</h3>
                  <p className="text-sm text-gray-400 mb-6">Regional and localization settings.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 className="text-sm font-medium text-white">Language</h4>
                      <p className="text-xs text-gray-500">Application display language</p>
                    </div>
                    <select value={localSettings.language} onChange={(e) => updateSetting('language', e.target.value)} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="hi-IN">Hindi</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 className="text-sm font-medium text-white">Currency</h4>
                      <p className="text-xs text-gray-500">Default currency for all amounts</p>
                    </div>
                    <select value={localSettings.currency} onChange={(e) => updateSetting('currency', e.target.value)} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                    </select>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 className="text-sm font-medium text-white">Date Format</h4>
                      <p className="text-xs text-gray-500">How dates are displayed</p>
                    </div>
                    <select value={localSettings.dateFormat} onChange={(e) => updateSetting('dateFormat', e.target.value)} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <h4 className="text-sm font-medium text-white">Timezone</h4>
                      <p className="text-xs text-gray-500">For accurate day boundaries</p>
                    </div>
                    <select value={localSettings.timezone} onChange={(e) => updateSetting('timezone', e.target.value)} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                      {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Preferences
                  </button>
                </div>
              </form>
            )}

            {/* FINANCE TAB */}
            {activeTab === 'finance' && (
              <form onSubmit={handleSettingsSave} className="space-y-6 animate-fade-in max-w-xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Finance</h3>
                  <p className="text-sm text-gray-400 mb-6">Manage budgets and tracking defaults.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Overall Monthly Budget</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{CURRENCIES.find(c => c.code === localSettings.currency)?.symbol}</span>
                      <input type="number" value={localSettings.monthlyBudget} onChange={(e) => updateSetting('monthlyBudget', e.target.value)} className="w-full pl-8 pr-4 py-2 rounded-lg border border-white/10 bg-black/40 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Finance Settings
                  </button>
                </div>
              </form>
            )}

            {/* OTHER TABS (Simplified for demonstration) */}
            {(['notifications', 'security', 'privacy', 'ai'].includes(activeTab)) && (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
                 <Info className="w-12 h-12 text-gray-600" />
                 <div>
                   <h3 className="text-lg font-medium text-white capitalize">{activeTab} Settings</h3>
                   <p className="text-sm text-gray-400 mt-1">These settings are being expanded in the next update.</p>
                 </div>
               </div>
            )}
            
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
