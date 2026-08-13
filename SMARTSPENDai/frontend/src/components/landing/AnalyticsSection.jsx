import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 4500, expenses: 2100 },
  { name: 'Mar', income: 4200, expenses: 2800 },
  { name: 'Apr', income: 5000, expenses: 2200 },
  { name: 'May', income: 4800, expenses: 2600 },
  { name: 'Jun', income: 5500, expenses: 2100 },
  { name: 'Jul', income: 5800, expenses: 2300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border-emerald-500/30">
        <p className="text-gray-300 mb-2">{label}</p>
        <p className="text-emerald-400 font-bold">
          Income: ${payload[0].value}
        </p>
        <p className="text-rose-400 font-bold">
          Expenses: ${payload[1].value}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsSection = () => {
  return (
    <section className="py-24 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 glass-card p-6 aspect-video"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#737373" tick={{fill: '#737373'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#737373" tick={{fill: '#737373'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Visual Analytics <br />
              <span className="text-gray-500">that make sense.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Stop guessing where your money goes. Beautiful, interactive charts automatically categorize your spending and track your cash flow in real-time.
            </p>
            <div className="flex gap-4">
              <div className="bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                Income Analysis
              </div>
              <div className="bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20 text-rose-400 text-sm font-medium">
                Expense Tracking
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
