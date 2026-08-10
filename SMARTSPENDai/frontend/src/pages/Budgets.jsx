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
            <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
            <p className="text-gray-500 text-sm mt-1">Plan, track and manage your monthly budgets.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              {currentMonthYear}
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Settings className="w-4 h-4 text-gray-500" />
              Budget Settings
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Create Budget
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Budget</p>
              <h3 className="text-2xl font-bold text-gray-900">{currencySymbol}{totalBudgetLimit.toLocaleString()}</h3>
              <p className="text-xs text-gray-400 mt-1">Monthly Budget</p>
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
              <h3 className="text-2xl font-bold text-gray-900">{currencySymbol}{totalBudgetSpent.toLocaleString()}</h3>
              <p className={`text-xs font-medium mt-1 ${totalBudgetSpent > totalBudgetLimit ? 'text-red-600' : 'text-green-600'}`}>{totalBudgetPercent}% <span className="text-gray-400 font-normal">of total budget</span></p>
            </div>
          </div>

          {/* Card 3: Remaining Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Remaining Budget</p>
              <h3 className="text-2xl font-bold text-gray-900">{currencySymbol}{totalBudgetRemaining.toLocaleString()}</h3>
              <p className="text-xs font-medium text-orange-500 mt-1">{(100 - totalBudgetPercent).toFixed(1)}% <span className="text-gray-400 font-normal">left</span></p>
            </div>
          </div>

          {/* Card 4: Over Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Over Budget</p>
              <h3 className="text-2xl font-bold text-gray-900">{overBudgetCategories} {overBudgetCategories === 1 ? 'Category' : 'Categories'}</h3>
              <p className="text-xs text-gray-400 mt-1">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Middle Section (Charts) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
            <BudgetOverviewChart />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Budget by Category</h3>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="text-sm text-gray-500">Loading budgets...</div>
              ) : (
                <BudgetList standalone={false} customBudgets={budgets} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
            <h3 className="font-bold text-gray-900 mb-4">Budget Status</h3>
            <BudgetStatusChart budgets={budgets} />
          </div>
        </div>

        {/* Bottom Section (Table) */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">All Budgets</h3>
              <div className="flex items-center gap-3">
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <option>All Categories</option>
                </select>
                <button className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Category</th>
                    <th className="pb-3">Budget Amount</th>
                    <th className="pb-3">Spent</th>
                    <th className="pb-3">Remaining</th>
                    <th className="pb-3 w-32">Usage</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
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
                    let statusColor = "bg-green-50 text-green-600 border-green-100";
                    let barColor = "bg-green-500";

                    if (percentage >= 100) {
                      status = "Over Budget";
                      statusColor = "bg-red-50 text-red-600 border-red-100";
                      barColor = "bg-red-500";
                    } else if (percentage >= 80) {
                      status = "Near Limit";
                      statusColor = "bg-orange-50 text-orange-600 border-orange-100";
                      barColor = "bg-orange-500";
                    }

                    return (
                      <tr key={budget._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-100 text-blue-500 flex items-center justify-center">
                              <span className="text-sm">🏷️</span>
                            </div>
                            <span className="font-medium text-gray-900 text-sm">{budget.category}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{currencySymbol}{budgetLimit.toLocaleString()}</td>
                        <td className="py-4 text-sm text-gray-600">{currencySymbol}{(budget.spent || 0).toLocaleString()}</td>
                        <td className="py-4 text-sm text-gray-600">{currencySymbol}{remaining.toLocaleString()}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full">
                              <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{percentage}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColor}`}>{status}</span>
                        </td>
                        <td className="py-4 text-right pr-4">
                          <button className="text-gray-400 hover:text-gray-600">...</button>
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
