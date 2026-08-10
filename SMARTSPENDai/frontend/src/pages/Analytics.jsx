import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getCategoryBreakdown, getMonthlyTrend } from '../services/analyticsService';
import { useSettings } from '../context/SettingsContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, Filter, Calendar } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#6366F1'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Analytics() {
  const { currencySymbol } = useSettings();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year'); // 'month', '3months', 'year'
  
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [catData, trnData] = await Promise.all([
          getCategoryBreakdown(timeRange),
          getMonthlyTrend()
        ]);
        
        // Format category data
        setCategoryData(catData.map(d => ({ name: d.category, value: d.total })));
        
        // Format trend data (map { year, month, income, expense } to readable chart data)
        let formattedTrend = trnData.map(d => ({
          name: `${MONTHS[d.month - 1]} ${d.year}`,
          income: d.income,
          expense: d.expense
        }));

        if (timeRange === 'month' && formattedTrend.length > 0) {
          formattedTrend = [formattedTrend[formattedTrend.length - 1]];
        } else if (timeRange === '3months' && formattedTrend.length > 0) {
          formattedTrend = formattedTrend.slice(-3);
        }

        setTrendData(formattedTrend);

        // Calculate totals for the selected period
        const totalInc = formattedTrend.reduce((sum, item) => sum + item.income, 0);
        const totalExp = formattedTrend.reduce((sum, item) => sum + item.expense, 0);
        setTotals({ income: totalInc, expense: totalExp });

      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600 text-sm">{entry.name}:</span>
              <span className="font-bold text-gray-900 text-sm">{currencySymbol}{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout hideHeaderControls={true}>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-500 text-sm mt-1">Deep dive into your financial habits.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-700 py-1.5 pl-2 pr-8 focus:ring-0 outline-none cursor-pointer"
            >
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="font-medium">Crunching numbers...</p>
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-500 font-medium">Total Income</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">{currencySymbol}{totals.income.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-500 font-medium">Total Expenses</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">{currencySymbol}{totals.expense.toLocaleString()}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-3xl shadow-md text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-blue-100 font-medium mb-4">Net Savings</h3>
                <p className="text-4xl font-bold mt-2">
                  {currencySymbol}{(totals.income - totals.expense).toLocaleString()}
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-blue-100">
                    Savings Rate: {totals.income > 0 ? Math.round(((totals.income - totals.expense) / totals.income) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income vs Expense Area Chart */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Income vs Expenses Trend
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(val) => `${currencySymbol}${val/1000}k`} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Area type="monotone" dataKey="income" name="Income" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expense" name="Expenses" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Donut Chart */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-2">Top Spending Categories</h3>
                <p className="text-sm text-gray-500 mb-6">Where your money went in the selected period.</p>
                
                {categoryData.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    No expense data found.
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {categoryData.slice(0, 6).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-600 truncate max-w-[100px]" title={entry.name}>{entry.name}</span>
                          </div>
                          <span className="font-bold text-gray-900">{currencySymbol}{entry.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Cash Flow Analysis */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">Cash Flow Analysis</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Income Utilization</span>
                      <span className="font-bold text-gray-900">
                        {totals.income > 0 ? Math.min(Math.round((totals.expense / totals.income) * 100), 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          (totals.expense / totals.income) > 0.9 ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${totals.income > 0 ? Math.min((totals.expense / totals.income) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm mb-2">AI Insight</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {totals.expense > totals.income 
                        ? `You have spent ${currencySymbol}${(totals.expense - totals.income).toLocaleString()} more than you earned in this period. Consider reviewing your top categories to cut back.`
                        : `Great job! You saved ${currencySymbol}${(totals.income - totals.expense).toLocaleString()} this period. Consider moving this to your savings goals.`}
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
