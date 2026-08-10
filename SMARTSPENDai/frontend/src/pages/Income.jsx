import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateIncomeModal from '../components/modals/CreateIncomeModal';
import { getTransactions } from '../services/transactionService';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Calendar, 
  List, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Plus, 
  Briefcase,
  Trophy,
  Wallet,
  ChevronDown,
  CreditCard,
  Landmark,
  UploadCloud,
  Settings
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useSettings } from '../context/SettingsContext';

export default function Income() {
  const { currencySymbol } = useSettings();
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All Payment Methods');

  const fetchIncome = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setAllTransactions(data);
      // Filter only income
      const incomeTx = data.filter(t => t.type === 'income');
      setTransactions(incomeTx);
    } catch (error) {
      console.error('Failed to fetch income', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'All Categories' || t.category === selectedCategory;
      const matchAccount = selectedAccount === 'All Accounts' || (t.account || 'Main Account') === selectedAccount;
      const matchPayment = selectedPaymentMethod === 'All Payment Methods' || (t.paymentMethod || 'Bank Transfer') === selectedPaymentMethod;
      return matchSearch && matchCategory && matchAccount && matchPayment;
    });
  }, [transactions, searchQuery, selectedCategory, selectedAccount, selectedPaymentMethod]);

  // Compute stats for current month
  const totalIncome = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const highestIncome = transactions.length > 0 ? Math.max(...transactions.map(t => Math.abs(t.amount))) : 0;
  
  // Real average monthly
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate average monthly by looking at past 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  const recentIncome = transactions.filter(t => new Date(t.date) >= threeMonthsAgo).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  // Average across 3 months or the number of months they've used it
  const averageMonthly = recentIncome / 3; 
  
  const totalExpenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const netSavings = totalIncome - totalExpenses;

  // Group by category for pie chart
  const categoryTotals = useMemo(() => {
    const totals = {};
    transactions.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
    });
    return totals;
  }, [transactions]);

  // Chart data
  const COLORS = ['#22c55e', '#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444', '#06b6d4', '#9ca3af'];
  const pieData = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.value - a.value);

  // Mock line chart data for "Income Overview"
  const lineData = [
    { name: 'Jan', income: 20000 },
    { name: 'Feb', income: 35000 },
    { name: 'Mar', income: 55000 },
    { name: 'Apr', income: 42000 },
    { name: 'May', income: 68750 }
  ];

  // Helper for category badge colors
  const getCategoryColor = (category) => {
    const map = {
      'Salary': 'bg-green-50 text-green-600',
      'Freelance': 'bg-purple-50 text-purple-600',
      'Business': 'bg-blue-50 text-blue-600',
      'Gifts': 'bg-orange-50 text-orange-600',
      'default': 'bg-gray-50 text-gray-600'
    };
    return map[category] || map['default'];
  };

  const currentDate = new Date();
  const firstDay = 1;
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const currentMonthStr = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const dateRangeStr = `${firstDay} ${currentMonthStr} – ${lastDay} ${currentMonthStr} ${currentDate.getFullYear()}`;

  return (
    <DashboardLayout hideHeaderControls={true}>
      <CreateIncomeModal 
        isOpen={isAddIncomeModalOpen} 
        onClose={() => setIsAddIncomeModalOpen(false)} 
        onIncomeCreated={fetchIncome} 
      />
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Income</h1>
            <p className="text-gray-500 text-sm mt-1">Track all your income sources and growth over time.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap">
              <Calendar className="w-4 h-4 text-gray-500" />
              {dateRangeStr}
              <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
            </button>
            <button 
              onClick={() => setIsAddIncomeModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-600/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Income
              <ChevronDown className="w-4 h-4 text-blue-200 ml-1" />
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
              <h3 className="text-2xl font-bold text-gray-900">{currencySymbol}{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
              <p className="text-xs font-medium text-green-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 22.0% <span className="text-gray-400 font-normal">from last month</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Average Monthly</p>
              <h3 className="text-2xl font-bold text-gray-900">{currencySymbol}{averageMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</h3>
              <p className="text-xs font-medium text-green-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 18.6% <span className="text-gray-400 font-normal">from last 3 months</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Highest Income</p>
              <h3 className="text-2xl font-bold text-gray-900">{currencySymbol}{highestIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
              <p className="text-xs font-medium text-gray-400 mt-1">
                Single transaction
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-500 font-bold">%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Income vs Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900">{Math.round((totalIncome / (totalExpenses || 1)) * 100)}%</h3>
              <p className="text-xs font-medium text-gray-400 mt-1">
                You are saving more this month!
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Income Overview</h3>
                <select className="text-xs font-medium text-gray-500 bg-transparent outline-none">
                  <option>This Year</option>
                </select>
             </div>
             <div className="h-48 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(val) => `${currencySymbol}${val/1000}k`} />
                    <Tooltip 
                      formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, 'Income']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
             <h3 className="font-bold text-gray-900 mb-6">Income by Source</h3>
             <div className="flex-1 flex items-center justify-between">
                <div className="h-40 w-40 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData.length > 0 ? pieData : [{name: 'Empty', value: 1, color: '#e5e7eb'}]}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {(pieData.length > 0 ? pieData : [{color: '#e5e7eb'}]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="font-bold text-gray-900 text-sm">{currencySymbol}{(totalIncome/1000).toFixed(1)}k</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1 ml-4">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600 truncate max-w-[60px]">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{(item.value / totalIncome * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Monthly Summary</h3>
                <span className="text-xs text-blue-600 font-medium">Current Month</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                   <p className="text-xs text-gray-500 mb-1">Total Income</p>
                   <p className="text-lg font-bold text-gray-900">{currencySymbol}{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
                   <p className="text-lg font-bold text-red-500">{currencySymbol}{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 mb-1">Net Savings</p>
                   <p className="text-lg font-bold text-green-600">{currencySymbol}{netSavings.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 mb-1">Savings Rate</p>
                   <p className="text-lg font-bold text-green-600">{savingsRate.toFixed(1)}%</p>
                </div>
             </div>

             <div className="bg-green-50 rounded-xl p-3 flex items-start gap-3 border border-green-100">
                <Trophy className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 leading-relaxed">
                   Great! You are saving more than 50% this month. Keep up the excellent work!
                </p>
             </div>
          </div>
        </div>

        {/* Main Content Area (Table + Sidebar) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Table */}
          <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[500px]">
            {/* Table Filters */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <List className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
                  >
                    <option value="All Categories">All Sources</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Business">Business</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="relative">
                  <Landmark className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <select 
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
                  >
                    <option value="All Accounts">All Accounts</option>
                    <option value="Main Account">Main Account</option>
                    <option value="Savings Account">Savings Account</option>
                    <option value="Business Account">Business Account</option>
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search income" 
                    className="pl-8 pr-4 py-1.5 rounded-lg border border-gray-200 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <Download className="w-3 h-3 text-gray-500" />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 pl-2 w-10">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th className="pb-3">Source</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Date &darr;</th>
                    <th className="pb-3">Account</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Notes</th>
                    <th className="pb-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                     <tr>
                       <td colSpan="8" className="py-8 text-center text-gray-500">Loading income...</td>
                     </tr>
                  ) : filteredTransactions.length === 0 ? (
                     <tr>
                       <td colSpan="8" className="py-8 text-center text-gray-500">No income found matching filters.</td>
                     </tr>
                  ) : (
                    filteredTransactions.map((tx, idx) => {
                      const accountName = tx.account || 'Main Account';
                      
                      return (
                        <tr key={tx._id || idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 pl-2">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 ${getCategoryColor(tx.category).split(' ')[0]} bg-opacity-30`}>
                                <Briefcase className={`w-4 h-4 ${getCategoryColor(tx.category).split(' ')[1]}`} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{tx.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium ${getCategoryColor(tx.category)}`}>
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-gray-600">
                            {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Landmark className="w-3 h-3 text-gray-400" />
                              {accountName}
                            </div>
                          </td>
                          <td className="py-4 text-sm font-medium text-green-600">
                            +{currencySymbol}{Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </td>
                          <td className="py-4 text-xs text-gray-500 truncate max-w-[120px]">
                            {tx.description || '-'}
                          </td>
                          <td className="py-4 text-right pr-2">
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              Showing {filteredTransactions.length} income entries
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Top Income Sources */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-900">Top Sources</h3>
              </div>
              <div className="space-y-5">
                {pieData.slice(0, 4).map((item, idx) => {
                  const percentage = totalIncome > 0 ? Math.round((item.value / totalIncome) * 100) : 0;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${getCategoryColor(item.name).split(' ')[0]} bg-opacity-50`}>
                            <Briefcase className={`w-3 h-3 ${getCategoryColor(item.name).split(' ')[1]}`} />
                          </div>
                          <span className="font-medium text-gray-700">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 font-medium">{currencySymbol}{item.value.toLocaleString()}</span>
                          <span className="text-gray-400 w-6 text-right">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => setIsAddIncomeModalOpen(true)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <Plus className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">Add<br/>Income</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">Upload<br/>Statement</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">View<br/>Analytics</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">Set<br/>Recurring</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
