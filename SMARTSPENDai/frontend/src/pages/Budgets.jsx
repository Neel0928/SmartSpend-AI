import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Calendar, Settings, Plus, Wallet, CreditCard, TrendingUp, Bell } from 'lucide-react';
import BudgetOverviewChart from '../components/charts/BudgetOverviewChart';
import BudgetStatusChart from '../components/charts/BudgetStatusChart';
import BudgetList from '../components/BudgetList';
import CreateBudgetModal from '../components/modals/CreateBudgetModal';
import { getBudgets } from '../services/budgetService';
import { getTransactions } from '../services/transactionService';
import { Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Budgets() {
  const { currencySymbol } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsData, transactionsData] = await Promise.all([
        getBudgets(),
        getTransactions()
      ]);

      // Calculate spent amount for each budget based on transactions
      const currentDate = new Date();
      const currentMonthStr = currentDate.toISOString().slice(0, 7); // e.g. "2026-08"

      const computedBudgets = budgetsData.map(budget => {
        // Find all expenses in this budget's category for the current month
        const categoryExpenses = transactionsData.filter(t =>
          t.type === 'expense' &&
          t.category === budget.category &&
          t.date.startsWith(currentMonthStr)
        );

        const totalSpent = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);

        return {
          ...budget,
          spent: totalSpent
        };
      });

      setBudgets(computedBudgets);
      setTransactions(transactionsData);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate top card stats
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + (b.limit || b.limitAmount || 0), 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalBudgetRemaining = Math.max(0, totalBudgetLimit - totalBudgetSpent);
  const totalBudgetPercent = totalBudgetLimit > 0 ? ((totalBudgetSpent / totalBudgetLimit) * 100).toFixed(1) : 0;
  const overBudgetCategories = budgets.filter(b => (b.limit || b.limitAmount || 0) > 0 && b.spent >= (b.limit || b.limitAmount || 0)).length;

  return (
    <DashboardLayout hideHeaderControls={true}>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
        <CreateBudgetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBudgetCreated={fetchData}
          currentMonthYear={currentMonthYear}
        />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Budgets</h1>
            <p className="text-gray-400 text-sm mt-1">Plan, track and manage your monthly budgets.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button className="flex items-center gap-2 glass-card border border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors shadow-sm">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{currentMonthYear}</span>
              <span className="sm:hidden">Date</span>
            </button>
            <button className="hidden sm:flex items-center gap-2 glass-card border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors shadow-sm">
              <Settings className="w-4 h-4 text-gray-500" />
              Settings
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Create Budget
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Budget */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Budget</p>
              <h3 className="text-2xl font-bold text-white">{currencySymbol}{totalBudgetLimit.toLocaleString()}</h3>
              <p className="text-xs text-gray-500 mt-1">Monthly Budget</p>
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Spent</p>
              <h3 className="text-2xl font-bold text-white">{currencySymbol}{totalBudgetSpent.toLocaleString()}</h3>
              <p className={`text-xs font-medium mt-1 ${totalBudgetSpent > totalBudgetLimit ? 'text-red-400' : 'text-emerald-400'}`}>{totalBudgetPercent}% <span className="text-gray-500 font-normal">of total budget</span></p>
            </div>
          </div>

          {/* Card 3: Remaining Budget */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Remaining Budget</p>
              <h3 className="text-2xl font-bold text-white">{currencySymbol}{totalBudgetRemaining.toLocaleString()}</h3>
              <p className="text-xs font-medium text-orange-400 mt-1">{(100 - totalBudgetPercent).toFixed(1)}% <span className="text-gray-500 font-normal">left</span></p>
            </div>
          </div>

          {/* Card 4: Over Budget */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Over Budget</p>
              <h3 className="text-2xl font-bold text-white">{overBudgetCategories} {overBudgetCategories === 1 ? 'Category' : 'Categories'}</h3>
              <p className="text-xs text-gray-500 mt-1">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Middle Section (Charts) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl border border-white/10 p-6 min-h-[400px]">
            <BudgetOverviewChart />
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Budget by Category</h3>
              <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="text-sm text-gray-500">Loading budgets...</div>
              ) : (
                <BudgetList standalone={false} customBudgets={budgets} />
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6 min-h-[400px]">
            <h3 className="font-bold text-white mb-4">Budget Status</h3>
            <BudgetStatusChart budgets={budgets} />
          </div>
        </div>

        {/* Bottom Section (Table) */}
        <div className="grid grid-cols-1 gap-6">
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white">All Budgets</h3>
              <div className="flex items-center gap-3">
                <select className="text-sm border border-white/10 rounded-lg px-3 py-2 outline-none text-gray-300 bg-white/5 hover:bg-white/10 transition-colors">
                  <option className="bg-[#050505]">All Categories</option>
                </select>
                <button className="text-sm border border-white/10 rounded-lg px-4 py-2 text-gray-300 font-medium hover:bg-white/10 transition-colors shadow-sm">
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Category</th>
                    <th className="pb-3">Budget Amount</th>
                    <th className="pb-3">Spent</th>
                    <th className="pb-3">Remaining</th>
                    <th className="pb-3 w-32">Usage</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">Loading budgets...</td>
                    </tr>
                  ) : budgets.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">No budgets found for this month.</td>
                    </tr>
                  ) : budgets.map((budget) => {
                    const budgetLimit = budget.limit || budget.limitAmount || 0;
                    const remaining = Math.max(0, budgetLimit - (budget.spent || 0));
                    const percentage = budgetLimit > 0 ? Math.round(((budget.spent || 0) / budgetLimit) * 100) : 0;
                    let status = "On Track";
                    let statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                    let barColor = "bg-emerald-500";

                    if (percentage >= 100) {
                      status = "Over Budget";
                      statusColor = "bg-red-500/10 text-red-400 border-red-500/20";
                      barColor = "bg-red-500";
                    } else if (percentage >= 80) {
                      status = "Near Limit";
                      statusColor = "bg-orange-500/10 text-orange-400 border-orange-500/20";
                      barColor = "bg-orange-500";
                    }

                    return (
                      <tr key={budget._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/10 text-gray-300 flex items-center justify-center">
                              <span className="text-sm">🏷️</span>
                            </div>
                            <span className="font-medium text-white text-sm">{budget.category}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-400">{currencySymbol}{budgetLimit.toLocaleString()}</td>
                        <td className="py-4 text-sm text-gray-400">{currencySymbol}{(budget.spent || 0).toLocaleString()}</td>
                        <td className="py-4 text-sm text-gray-400">{currencySymbol}{remaining.toLocaleString()}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-white/10 rounded-full">
                              <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-400">{percentage}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColor}`}>{status}</span>
                        </td>
                        <td className="py-4 text-right pr-4">
                          <button className="text-gray-400 hover:text-white transition-colors">...</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
