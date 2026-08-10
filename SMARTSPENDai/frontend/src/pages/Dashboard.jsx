import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getBudgets } from '../services/budgetService';
import { getGoals } from '../services/goalService';
import DashboardLayout from '../layouts/DashboardLayout';
import SummaryCard from '../components/SummaryCard';
import SpendingChart from '../components/charts/SpendingChart';
import TrendChart from '../components/charts/TrendChart';
import BudgetList from '../components/BudgetList';
import TransactionList from '../components/TransactionList';
import AIInsightCard from '../components/AIInsightCard';
import GoalList from '../components/GoalList';
import ReceiptScannerCard from '../components/ReceiptScannerCard';
import AddTransactionModal from '../components/AddTransactionModal';
import { ArrowDownToLine, ArrowUpToLine, WalletCards, TrendingUp, Plus } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Dashboard() {
  const { currencySymbol, settings } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState(null);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);

  // Summary State
  const [totals, setTotals] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0
  });

  // Chart Data State
  const [spendingData, setSpendingData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const [txRes, budgetsData, goalsData] = await Promise.all([
          api.get('/transactions'),
          getBudgets(),
          getGoals()
        ]);
        
        const txData = txRes.data;
        setTransactions(txData);
        setGoals(goalsData);
        
        // Calculate spent for budgets using transactions for the current month
        const currentDate = new Date();
        const currentMonthStr = currentDate.toISOString().slice(0, 7);
        const computedBudgets = budgetsData.map(budget => {
          const categoryExpenses = txData.filter(t =>
            t.type === 'expense' &&
            t.category === budget.category &&
            t.date.startsWith(currentMonthStr)
          );
          const totalSpent = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
          return { ...budget, spent: totalSpent };
        });
        setBudgets(computedBudgets);
        
        calculateMetrics(txData);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [refreshTrigger]);

  const calculateMetrics = (txData) => {
    let inc = 0;
    let exp = 0;

    // For spending chart (group expenses by category)
    const categoryTotals = {};

    // For trend chart (group by month)
    const monthlyTotals = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    txData.forEach(tx => {
      // 1. Calculate Totals
      if (tx.amount > 0) {
        inc += tx.amount;
      } else {
        exp += Math.abs(tx.amount);

        // 2. Spending Chart Grouping
        if (categoryTotals[tx.category]) {
          categoryTotals[tx.category] += Math.abs(tx.amount);
        } else {
          categoryTotals[tx.category] = Math.abs(tx.amount);
        }
      }

      // 3. Trend Chart Grouping
      const date = new Date(tx.date);
      const monthKey = monthNames[date.getMonth()];

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { name: monthKey, income: 0, expense: 0 };
      }

      if (tx.amount > 0) {
        monthlyTotals[monthKey].income += tx.amount;
      } else {
        monthlyTotals[monthKey].expense += Math.abs(tx.amount);
      }
    });

    const bal = inc - exp;
    const rate = inc > 0 ? ((inc - exp) / inc) * 100 : 0;

    setTotals({
      income: inc,
      expenses: exp,
      balance: bal,
      savingsRate: rate
    });

    // Format Spending Data
    const colors = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#6366F1', '#9CA3AF'];
    const formattedSpending = Object.keys(categoryTotals).map((cat, index) => ({
      name: cat,
      value: categoryTotals[cat],
      color: colors[index % colors.length]
    })).sort((a, b) => b.value - a.value); // Sort highest expense first
    setSpendingData(formattedSpending);

    // Format Trend Data (ensure it's sorted by month properly, or just use what we have)
    // For simplicity, we just use the object values. Realistically you'd want to ensure chronological order.
    const formattedTrend = monthNames.map(m => monthlyTotals[m] || { name: m, income: 0, expense: 0 });
    // Filter out future months with 0 data to keep chart clean (optional, keeping all for now)
    setTrendData(formattedTrend);
  };

  const formatCurrency = (val) => `${currencySymbol}${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const monthlyBudget = settings?.monthlyBudget || 0;
  const budgetProgress = monthlyBudget > 0 ? Math.min(100, (totals.expenses / monthlyBudget) * 100) : 0;
  const isOverBudget = totals.expenses > monthlyBudget;

  return (
    <DashboardLayout onAddClick={() => setIsModalOpen(true)}>
      <div className="space-y-6 relative">
        <div className="flex justify-end mb-4 sm:hidden">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
        </div>

        {/* Row 1: Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Income"
            amount={formatCurrency(totals.income)}
            icon={ArrowDownToLine}
            iconBg="bg-green-100 text-green-600"
          />
          <SummaryCard
            title="Total Expenses"
            amount={formatCurrency(totals.expenses)}
            icon={ArrowUpToLine}
            iconBg="bg-red-100 text-red-600"
          />
          <SummaryCard
            title="Current Balance"
            amount={formatCurrency(totals.balance)}
            icon={WalletCards}
            iconBg="bg-blue-100 text-blue-600"
          />
          <SummaryCard
            title="Savings Rate"
            amount={`${totals.savingsRate.toFixed(1)}%`}
            icon={TrendingUp}
            iconBg="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Global Monthly Budget Progress */}
        {monthlyBudget > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Overall Monthly Budget</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totals.expenses)} <span className="text-sm font-medium text-gray-400">/ {formatCurrency(monthlyBudget)}</span></p>
              </div>
              <span className={`text-sm font-bold ${isOverBudget ? 'text-red-500' : 'text-blue-600'}`}>
                {budgetProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'} transition-all duration-500`} 
                style={{ width: `${budgetProgress}%` }}
              ></div>
            </div>
            {isOverBudget && <p className="text-xs text-red-500 font-medium">You have exceeded your monthly budget limit.</p>}
          </div>
        )}

        {/* Row 2: Charts and Budgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto min-h-[350px]">
          <div className="lg:col-span-1">
            <SpendingChart data={spendingData} />
          </div>
          <div className="lg:col-span-1">
            <TrendChart data={trendData} />
          </div>
          <div className="lg:col-span-1">
            <BudgetList standalone={false} customBudgets={budgets} />
          </div>
        </div>

        {/* Row 3: Bottom Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionList transactions={transactions} loading={loading} />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex-1">
              <AIInsightCard refreshTrigger={refreshTrigger} />
            </div>
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex-1">
              <GoalList customGoals={goals} />
            </div>
            <div className="min-h-[10rem]">
              <ReceiptScannerCard
                onScanComplete={(data) => {
                  setScannedData(data);
                  setIsModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setScannedData(null);
        }}
        onTransactionAdded={handleTransactionAdded}
        initialData={scannedData}
      />
    </DashboardLayout>
  );
}
