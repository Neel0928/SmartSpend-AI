import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Wallet, PieChart, Activity, CheckCircle, Home, List, Plus, BarChart2, Target, MoveUpRight, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen pt-32 pb-16 md:pb-20 overflow-hidden flex flex-col items-center justify-center bg-[#050505]">
      {/* Deep ambient glows */}
      <div className="absolute top-1/4 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/15 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-500/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-emerald-900/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBNMzkuNSAwdiM0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

      {/* Glowing curved lines */}
      <svg className="absolute bottom-0 left-0 w-full h-[600px] pointer-events-none opacity-60" viewBox="0 0 1440 600" preserveAspectRatio="none">
        <path d="M-200 600 C 200 400, 600 200, 1600 500" fill="none" stroke="url(#emerald-gradient)" strokeWidth="1.5" className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        <path d="M-100 600 C 300 450, 700 300, 1600 600" fill="none" stroke="url(#emerald-gradient-2)" strokeWidth="1" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
        <path d="M300 600 C 600 500, 900 400, 1600 550" fill="none" stroke="url(#emerald-gradient)" strokeWidth="0.5" />
        
        <defs>
          <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="emerald-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Floating particles/stars */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_10px_2px_rgba(16,185,129,0.8)] animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-300 rounded-full shadow-[0_0_12px_2px_rgba(52,211,153,0.8)] animate-pulse delay-75" />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.8)] animate-pulse delay-150" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left z-20"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Finance Companion
            </motion.div>
            
            <h1 className="text-3xl sm:text-5xl md:text-[5.5rem] font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.05]">
              Smart Insights.<br />
              Better Habits.<br />
              <span className="text-emerald-500">Stronger Future.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-10 max-w-xl leading-relaxed">
              SmartSpend AI helps you track expenses, analyze spending patterns, and achieve your financial goals with the power of AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-lg font-semibold transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                See what you can do
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-8 sm:mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-[#050505]" src="https://i.pravatar.cc/100?img=11" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-[#050505]" src="https://i.pravatar.cc/100?img=12" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-[#050505]" src="https://i.pravatar.cc/100?img=13" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-[#050505]" src="https://i.pravatar.cc/100?img=14" alt="User" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-400">Trusted by 1000+ users</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Abstract UI Mockup */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative w-full h-[600px] hidden lg:block"
          >
            
            {/* Desktop Dashboard Mockup (Back) */}
            <motion.div 
              initial={{ y: 20, rotateY: -10, rotateX: 5, x: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute right-0 top-0 w-[550px] bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
            >
              <div className="h-8 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="p-6 flex gap-6">
                {/* Sidebar mini */}
                <div className="w-12 flex flex-col gap-6 items-center pt-2">
                  <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg"><Wallet className="w-5 h-5" /></div>
                  <div className="text-gray-600"><PieChart className="w-5 h-5" /></div>
                  <div className="text-gray-600"><Activity className="w-5 h-5" /></div>
                  <div className="text-gray-600"><CheckCircle className="w-5 h-5" /></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-gray-400">Dashboard</span>
                    <div className="w-24 h-6 bg-gray-800 rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-400 mb-1">Monthly Summary</p>
                      <h3 className="text-2xl font-bold text-white mb-2">₹ 24,580.00</h3>
                      <p className="text-xs text-emerald-500 flex items-center gap-1"><MoveUpRight className="w-3 h-3"/> 12.5% from last month</p>
                      <div className="mt-4 h-16 w-full flex items-end">
                         {/* Fake Chart Line */}
                         <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                            <path d="M0 25 L15 20 L30 22 L45 15 L60 18 L75 10 L90 12 L100 5" fill="none" stroke="#10b981" strokeWidth="2" />
                            <circle cx="100" cy="5" r="2" fill="#10b981" />
                         </svg>
                      </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex flex-col justify-between relative overflow-hidden">
                      <div>
                        <p className="text-xs text-emerald-400 mb-2 font-medium">AI Insight</p>
                        <p className="text-sm text-gray-300 leading-snug">You spent 18% <span className="text-emerald-400">more</span> on dining out this month.<br/><br/>Try cooking at home to save more!</p>
                      </div>
                      <div className="absolute -bottom-2 -right-2 text-6xl opacity-20">🤖</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                           <p className="text-xs text-gray-400">Recent Transactions</p>
                           <p className="text-[10px] text-gray-500">View All</p>
                        </div>
                        <div className="space-y-3">
                           {[
                             { name: 'Starbucks', cat: 'Food & Dining', amt: '-₹350', icon: <span className="bg-green-900/50 p-1.5 rounded-lg text-green-500"><Zap className="w-3 h-3"/></span> },
                             { name: 'Uber', cat: 'Transport', amt: '-₹420', icon: <span className="bg-gray-800 p-1.5 rounded-lg text-white"><Zap className="w-3 h-3"/></span> },
                             { name: 'Amazon', cat: 'Shopping', amt: '-₹1,250', icon: <span className="bg-yellow-900/30 p-1.5 rounded-lg text-yellow-500"><Zap className="w-3 h-3"/></span> },
                           ].map((t, i) => (
                             <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                   {t.icon}
                                   <div>
                                      <p className="text-xs text-white">{t.name}</p>
                                      <p className="text-[10px] text-gray-500">{t.cat}</p>
                                   </div>
                                </div>
                                <span className="text-xs text-gray-300">{t.amt}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-gray-400 mb-4">Top Categories</p>
                        <div className="space-y-3">
                           {[
                             { name: 'Food & Dining', pct: '33%', color: 'bg-green-500' },
                             { name: 'Transport', pct: '18%', color: 'bg-blue-500' },
                             { name: 'Shopping', pct: '15%', color: 'bg-purple-500' },
                           ].map((c, i) => (
                             <div key={i} className="flex justify-between items-center">
                               <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${c.color}`}></div>
                                  <span className="text-xs text-gray-300">{c.name}</span>
                               </div>
                               <span className="text-xs text-gray-400">{c.pct}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile App Mockup (Front) */}
            <motion.div 
              initial={{ y: 40, x: -20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-10 top-10 w-[280px] bg-[#09090b] border-[6px] border-gray-900 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 overflow-hidden z-20"
            >
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 w-32 mx-auto rounded-b-2xl z-30"></div>
              
              <div className="p-5 pt-8 h-full bg-gradient-to-b from-[#111111] to-[#050505]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-white">Hello, Neel 👋</h4>
                    <p className="text-[10px] text-gray-400">Good to see you again!</p>
                  </div>
                  <img className="w-8 h-8 rounded-full" src="https://i.pravatar.cc/100?img=11" alt="Profile" />
                </div>

                <div className="bg-gradient-to-br from-emerald-900/80 to-emerald-950/40 border border-emerald-800/50 p-4 rounded-2xl mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-emerald-100/70">Total Balance</p>
                    <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">₹ 24,580.00</h2>
                  <div className="inline-block bg-emerald-900/50 px-2 py-1 rounded-md text-[10px] text-emerald-400">
                    + 12.5% this month
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-medium text-gray-300">Expense Overview</p>
                    <span className="text-[10px] text-gray-500">This Month</span>
                  </div>
                  
                  {/* Fake Donut Chart */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                     <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        {/* Food */}
                        <path className="text-green-500" strokeDasharray="33, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        {/* Transport */}
                        <path className="text-blue-500" strokeDasharray="18, 100" strokeDashoffset="-33" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        {/* Shopping */}
                        <path className="text-purple-500" strokeDasharray="15, 100" strokeDashoffset="-51" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        {/* Utilities */}
                        <path className="text-yellow-500" strokeDasharray="34, 100" strokeDashoffset="-66" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[8px] text-gray-400">Total Expense</span>
                        <span className="text-sm font-bold text-white">₹ 18,650</span>
                     </div>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 mb-16">
                     {[
                       { name: 'Food & Dining', val: '₹ 6,240', color: 'bg-green-500' },
                       { name: 'Transport', val: '₹ 3,420', color: 'bg-blue-500' },
                       { name: 'Shopping', val: '₹ 2,850', color: 'bg-purple-500' },
                     ].map((l, i) => (
                       <div key={i} className="flex justify-between items-center text-[10px]">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${l.color}`}></div>
                             <span className="text-gray-400">{l.name}</span>
                          </div>
                          <span className="text-white">{l.val}</span>
                       </div>
                     ))}
                  </div>

                </div>
              </div>

              {/* Bottom Nav */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-[#09090b] border-t border-gray-800 flex justify-around items-center px-4 pb-2 z-30">
                <div className="flex flex-col items-center gap-1 text-emerald-500"><Home className="w-5 h-5" /></div>
                <div className="flex flex-col items-center gap-1 text-gray-500"><List className="w-5 h-5" /></div>
                <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-emerald-500/30 text-white">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500"><BarChart2 className="w-5 h-5" /></div>
                <div className="flex flex-col items-center gap-1 text-gray-500"><Target className="w-5 h-5" /></div>
              </div>
            </motion.div>

            {/* Floating Monthly Goal Widget */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [-10, 5, -10], opacity: 1 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute right-10 bottom-20 w-[260px] bg-[#111111]/80 backdrop-blur-md border border-gray-700/50 rounded-2xl p-4 shadow-xl shadow-black/50 z-30"
            >
               <div className="flex items-center gap-2 mb-3">
                 <Target className="w-4 h-4 text-emerald-400" />
                 <span className="text-xs text-gray-300 font-medium">Monthly Goal</span>
               </div>
               <div className="flex justify-between items-end mb-2">
                 <div>
                   <span className="text-lg font-bold text-white">₹ 20,000</span>
                   <span className="text-xs text-gray-500 ml-1">/ ₹ 30,000</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 </div>
               </div>
               <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-3 relative">
                 <div className="bg-emerald-500 h-full w-[66%] rounded-full relative">
                   <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 skew-x-[-20deg]"></div>
                 </div>
               </div>
               <div className="text-right mt-1">
                 <span className="text-[10px] text-emerald-500 font-medium">66%</span>
               </div>
            </motion.div>

            {/* Small Floating decorative icons */}
            <motion.div 
               animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute top-10 right-[40%] w-12 h-12 bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/50 z-20"
            >
               <Activity className="w-6 h-6" />
            </motion.div>

            <motion.div 
               animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
               className="absolute bottom-32 left-0 w-16 h-16 bg-[#2d1b69]/80 backdrop-blur-md border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 shadow-xl shadow-purple-900/50 z-30 transform -rotate-12"
            >
               <span className="text-3xl font-bold font-serif">₹</span>
            </motion.div>
            
            <motion.div 
               animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
               transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
               className="absolute top-0 right-0 w-14 h-14 bg-[#1e1b4b]/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-900/50 z-30 transform rotate-12"
            >
               <PieChart className="w-6 h-6" />
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
