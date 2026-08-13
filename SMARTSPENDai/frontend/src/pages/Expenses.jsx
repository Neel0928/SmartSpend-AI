import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateExpenseModal from '../components/modals/CreateExpenseModal';
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
  Image as ImageIcon,
  ScanLine,
  Clock,
  ChevronDown,
  CreditCard,
  Smartphone,
  Landmark
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSettings } from '../context/SettingsContext';

export default function Expenses() {
  const { currencySymbol } = useSettings();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All Payment Methods');

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      // Filter only expenses
      const expenses = data.filter(t => t.type === 'expense');
      setTransactions(expenses);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'All Categories' || t.category === selectedCategory;
      const matchAccount = selectedAccount === 'All Accounts' || (t.account || 'Main Account') === selectedAccount;
      const matchPayment = selectedPaymentMethod === 'All Payment Methods' || (t.paymentMethod || 'Debit Card') === selectedPaymentMethod;
      return matchSearch && matchCategory && matchAccount && matchPayment;
    });
  }, [transactions, searchQuery, selectedCategory, selectedAccount, selectedPaymentMethod]);

  // Compute stats
  const totalExpenses = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const transactionCount = transactions.length;
  
  // Real daily average and this week based on dates
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate this month's expenses
  const thisMonthExpenses = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Daily Average (This Month)
  const daysPassedThisMonth = Math.max(1, now.getDate());
  const dailyAverage = thisMonthExpenses / daysPassedThisMonth;
  
  // This Week (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thisWeek = transactions.filter(t => new Date(t.date) >= sevenDaysAgo).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Group by category for charts
  const categoryTotals = useMemo(() => {
    const totals = {};
    transactions.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
    });
    return totals;
  }, [transactions]);

  // Chart data
  const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#9ca3af'];
  const chartData = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.value - a.value);

  // Helper for category badge colors
  const getCategoryColor = (category) => {
    const map = {
      'Food & Dining': 'bg-red-50 text-red-600',
      'Shopping': 'bg-green-50 text-green-600',
      'Transportation': 'bg-blue-50 text-blue-600',
      'Bills & Utilities': 'bg-orange-50 text-orange-600',
      'Entertainment': 'bg-purple-50 text-purple-600',
      'Health': 'bg-cyan-50 text-cyan-600',
      'default': 'bg-gray-50 text-gray-600'
    };
    return map[category] || map['default'];
  };

  // Helper for mock payment methods
  const getPaymentMethod = (index) => {
    const methods = [
      { name: 'UPI', icon: Smartphone, color: 'text-green-600' },
      { name: 'Debit Card', icon: CreditCard, color: 'text-blue-600' },
      { name: 'Net Banking', icon: Landmark, color: 'text-purple-600' },
      { name: 'Credit Card', icon: CreditCard, color: 'text-indigo-600' },
    ];
    return methods[index % methods.length];
  };

  const currentDate = new Date();
  const firstDay = 1;
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const currentMonthStr = currentDate.toLocaleDateString('en-US', { month: 'short' });
  const dateRangeStr = `${firstDay} ${currentMonthStr} – ${lastDay} ${currentMonthStr} ${currentDate.getFullYear()}`;

  return (
    <DashboardLayout hideHeaderControls={true}>
      <CreateExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onExpenseCreated={fetchExpenses}
      />
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Expenses</h1>
            <p className="text-gray-400 text-sm mt-1">Track, manage and analyze your spending</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-14 py-2.5 rounded-xl border border-white/10 text-sm w-80 md:w-96 lg:w-[400px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all bg-white/5 text-white placeholder-gray-500 relative z-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-0">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white/10 rounded border border-white/10">⌘</kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white/10 rounded border border-white/10">K</kbd>
              </div>
            </div>
            <button className="flex items-center gap-2 glass-card border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors shadow-sm whitespace-nowrap">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {dateRangeStr}
              <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
            </button>
            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Expense
              <ChevronDown className="w-4 h-4 text-emerald-200 ml-1" />
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Expenses</p>
              <h3 className="text-2xl font-bold text-white">{currencySymbol}{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              <p className="text-xs font-medium text-red-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 8.3% <span className="text-gray-500 font-normal">from Apr 2025</span>
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Daily Average (This Month)</p>
              <h3 className="text-2xl font-bold text-white">{currencySymbol}{dailyAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
              <p className="text-xs font-medium text-red-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 5.2% <span className="text-gray-500 font-normal">from Apr 2025</span>
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Last 7 Days</p>
              <h3 className="text-2xl font-bold text-white">{currencySymbol}{thisWeek.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              <p className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 rotate-180" /> 12.6% <span className="text-gray-500 font-normal">from last week</span>
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <List className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Transactions</p>
              <h3 className="text-2xl font-bold text-white">{transactionCount}</h3>
              <p className="text-xs font-medium text-red-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 3 <span className="text-gray-500 font-normal">from Apr 2025</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area (Table + Sidebar) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Main Table */}
          <div className="xl:col-span-3 glass-card rounded-2xl border border-white/10 p-6 flex flex-col min-h-[600px]">
            {/* Table Filters */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <List className="w-3 h-3 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-8 pr-8 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors focus:outline-none appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
                  >
                    <option value="All Categories" className="bg-[#050505] text-white">All Categories</option>
                    <option value="Food & Dining" className="bg-[#050505] text-white">Food & Dining</option>
                    <option value="Shopping" className="bg-[#050505] text-white">Shopping</option>
                    <option value="Transportation" className="bg-[#050505] text-white">Transportation</option>
                    <option value="Bills & Utilities" className="bg-[#050505] text-white">Bills & Utilities</option>
                    <option value="Entertainment" className="bg-[#050505] text-white">Entertainment</option>
                    <option value="Health" className="bg-[#050505] text-white">Health</option>
                    <option value="Travel" className="bg-[#050505] text-white">Travel</option>
                    <option value="Other" className="bg-[#050505] text-white">Other</option>
                  </select>
                </div>

                <div className="relative">
                  <Landmark className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="pl-8 pr-8 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors focus:outline-none appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
                  >
                    <option value="All Accounts" className="bg-[#050505] text-white">All Accounts</option>
                    <option value="Main Account" className="bg-[#050505] text-white">Main Account</option>
                    <option value="Savings Account" className="bg-[#050505] text-white">Savings Account</option>
                    <option value="Joint Account" className="bg-[#050505] text-white">Joint Account</option>
                    <option value="Business Account" className="bg-[#050505] text-white">Business Account</option>
                  </select>
                </div>

                <div className="relative">
                  <CreditCard className="w-3 h-3 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="pl-8 pr-8 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors focus:outline-none appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
                  >
                    <option value="All Payment Methods" className="bg-[#050505] text-white">All Payment Methods</option>
                    <option value="UPI" className="bg-[#050505] text-white">UPI</option>
                    <option value="Debit Card" className="bg-[#050505] text-white">Debit Card</option>
                    <option value="Credit Card" className="bg-[#050505] text-white">Credit Card</option>
                    <option value="Net Banking" className="bg-[#050505] text-white">Net Banking</option>
                    <option value="Cash" className="bg-[#050505] text-white">Cash</option>
                  </select>
                </div>

                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors">
                  <Filter className="w-3 h-3 text-gray-400" />
                  More Filters
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors shadow-sm">
                  <Download className="w-3 h-3 text-gray-400" />
                  Export
                </button>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                  <button className="p-1.5 bg-emerald-500/20 rounded text-emerald-400">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2 w-10">
                      <input type="checkbox" className="rounded bg-[#050505] border-white/20 text-emerald-500 focus:ring-emerald-500" />
                    </th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Date &darr;</th>
                    <th className="pb-3">Payment Method</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">Loading expenses...</td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">No expenses found matching filters.</td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx, idx) => {
                      const paymentMethodName = tx.paymentMethod || 'Debit Card';
                      let MethodIcon = CreditCard;
                      let methodColor = 'text-gray-600';

                      if (paymentMethodName === 'UPI') { MethodIcon = Smartphone; methodColor = 'text-green-600'; }
                      if (paymentMethodName === 'Debit Card') { MethodIcon = CreditCard; methodColor = 'text-blue-600'; }
                      if (paymentMethodName === 'Credit Card') { MethodIcon = CreditCard; methodColor = 'text-indigo-600'; }
                      if (paymentMethodName === 'Net Banking') { MethodIcon = Landmark; methodColor = 'text-purple-600'; }
                      if (paymentMethodName === 'Cash') { MethodIcon = Landmark; methodColor = 'text-orange-600'; }

                      return (
                        <tr key={tx._id || idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 pl-2">
                            <input type="checkbox" className="rounded bg-[#050505] border-white/20 text-emerald-500 focus:ring-emerald-500" />
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-400 text-sm">🏪</span>
                              </div>
                              <div>
                                <p className="font-medium text-white text-sm">{tx.name}</p>
                                <p className="text-xs text-gray-400">{tx.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium ${getCategoryColor(tx.category)}`}>
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-gray-400">
                            {tx.date ? new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown Date'}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded text-xs text-gray-400 w-max border border-white/10">
                              <MethodIcon className={`w-3 h-3 ${methodColor}`} />
                              {paymentMethodName}
                            </div>
                          </td>
                          <td className="py-4 text-sm font-medium text-red-400">
                            -{currencySymbol}{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 text-right pr-2">
                            <button className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
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

            {/* Pagination Mock */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <span className="text-xs text-gray-500">Showing 1 to {Math.min(10, transactionCount)} of {transactionCount} expenses</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-white/10 text-gray-400 hover:bg-white/5">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-emerald-500 text-white font-medium shadow-[0_0_10px_rgba(16,185,129,0.3)]">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-white/10 text-gray-400 hover:bg-white/5 font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-white/10 text-gray-400 hover:bg-white/5 font-medium">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-white/10 text-gray-400 hover:bg-white/5">&gt;</button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">

            {/* Spending Overview Chart */}
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white">Spending Overview</h3>
                <select className="text-xs font-medium text-gray-400 bg-transparent outline-none">
                  <option className="bg-[#050505]">This Month</option>
                </select>
              </div>

              <div className="h-[200px] w-full relative mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.length > 0 ? chartData : [{ name: 'Empty', value: 1, color: '#e5e7eb' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {(chartData.length > 0 ? chartData : [{ color: '#e5e7eb' }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-lg font-bold text-white">{currencySymbol}{totalExpenses >= 1000 ? (totalExpenses / 1000).toFixed(1) + 'k' : totalExpenses}</p>
                  <p className="text-[10px] text-gray-400 font-medium">Total</p>
                </div>
              </div>

              <div className="space-y-3">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-400 truncate max-w-[90px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">{currencySymbol}{item.value >= 1000 ? (item.value / 1000).toFixed(1) + 'k' : item.value}</span>
                      <span className="text-gray-500 w-7 text-right">{Math.round((item.value / totalExpenses) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold text-white mb-6">Top Categories</h3>
              <div className="space-y-5">
                {chartData.slice(0, 5).map((item, idx) => {
                  const percentage = Math.round((item.value / totalExpenses) * 100);
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${getCategoryColor(item.name).split(' ')[0]} bg-opacity-50`}>
                            <span className="text-[10px]">📍</span>
                          </div>
                          <span className="font-medium text-gray-300">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">{currencySymbol}{item.value.toLocaleString()}</span>
                          <span className="text-gray-500 w-6 text-right">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 mt-6 flex items-center gap-1">
                View All Categories &rarr;
              </button>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Plus className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 group-hover:text-emerald-400 text-center leading-tight">Add<br />Expense</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 group-hover:text-purple-400 text-center leading-tight">Upload<br />Receipt</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border-2 border-dashed border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <ScanLine className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 group-hover:text-blue-400 text-center leading-tight">Scan<br />Receipt</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Clock className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 group-hover:text-orange-400 text-center leading-tight">Recurring<br /></span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
