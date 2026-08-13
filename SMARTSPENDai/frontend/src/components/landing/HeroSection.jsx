import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Personal Finance
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Your money. <br />
              <span className="text-gradient">Smarter decisions.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
              SmartSpend AI helps you track spending, manage budgets, reach your financial goals, and understand your money with personalized AI insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-lg font-semibold transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Start Managing Your Money
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#features" 
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Explore SmartSpend AI
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block perspective-1000"
          >
            <motion.div
              animate={{ 
                y: [-8, 8, -8],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6, 
                ease: "easeInOut" 
              }}
              className="glass-card w-full max-w-[500px] ml-auto p-6 rounded-2xl relative z-10"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
                  <h3 className="text-3xl font-extrabold text-white">₹84,250</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-400 text-xs font-medium mb-1">Income</p>
                  <p className="text-emerald-400 font-bold">₹52,000</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-gray-400 text-xs font-medium mb-1">Expenses</p>
                  <p className="text-white font-bold">₹24,580</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm font-medium mb-3">Spending Overview</p>
                <div className="h-32 rounded-xl bg-gradient-to-t from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-end p-4">
                  <div className="w-full flex justify-between items-end gap-2 h-full">
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/50 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex justify-between text-xs mb-2 font-medium">
                  <span className="text-gray-400">Monthly Budget Usage</span>
                  <span className="text-emerald-400">72%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[72%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-emerald-400 text-xs font-bold mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Insight
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Food spending increased 12% this month. Consider reducing weekend dining.
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
