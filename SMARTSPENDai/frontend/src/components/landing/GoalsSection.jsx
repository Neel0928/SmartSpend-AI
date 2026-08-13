import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const GoalsSection = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card max-w-4xl mx-auto p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Reach your goals <span className="text-gradient">faster.</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-12 max-w-2xl">
              Set intelligent savings goals. SmartSpend AI will automatically track your progress and tell you exactly how much you can safely spend today.
            </p>

            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 text-left">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
                    💻
                  </div>
                  <div>
                    <h4 className="font-bold text-white">New MacBook Pro</h4>
                    <p className="text-sm text-gray-500">Savings Goal</p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-emerald-400">$1,850</h4>
                  <p className="text-sm text-gray-500">of $2,400</p>
                </div>
              </div>
              
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mt-4">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '77%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 relative"
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                </motion.div>
              </div>
              
              <p className="text-sm text-gray-400 mt-4 text-center">
                On track to reach your goal by <span className="text-white font-semibold">November 15</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
