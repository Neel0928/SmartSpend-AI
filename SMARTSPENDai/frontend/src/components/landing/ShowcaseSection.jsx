import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ShowcaseSection = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section className="py-32 relative z-10 overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Your financial command center.
        </h2>
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="glass-card p-2 md:p-4 rounded-xl md:rounded-3xl border border-white/10 relative z-10 mx-auto">
          
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#111] rounded-t-xl md:rounded-t-2xl">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <div className="mx-auto bg-white/5 border border-white/10 rounded-md px-4 py-1.5 text-xs text-gray-400 font-medium">
              app.smartspend.ai
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-b-xl md:rounded-b-2xl p-4 md:p-8 flex flex-col md:flex-row gap-6">
            
            <div className="hidden md:flex flex-col gap-4 w-56 border-r border-white/10 pr-6">
              <div className="h-8 w-32 bg-white/10 rounded-md mb-8"></div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-10 rounded-md ${i === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-transparent'} flex items-center px-4`}>
                  <div className={`h-4 w-4 rounded-sm ${i === 1 ? 'bg-emerald-500' : 'bg-white/20'} mr-3`}></div>
                  <div className={`h-2.5 w-16 rounded-full ${i === 1 ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col gap-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-7 w-40 bg-white/10 rounded-md mb-2"></div>
                  <div className="h-4 w-56 bg-white/5 rounded-md"></div>
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-full border border-white/20"></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                    <div className="h-3 w-20 bg-white/20 rounded-full mb-4"></div>
                    <div className="h-8 w-32 bg-white/10 rounded-md"></div>
                  </div>
                ))}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col min-h-[250px]">
                  <div className="h-4 w-32 bg-white/20 rounded-full mb-8"></div>
                  <div className="flex-1 flex items-end gap-3 px-2">
                     {[30, 50, 40, 70, 55, 80, 45, 90, 60].map((h, i) => (
                        <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative overflow-hidden" style={{ height: `${h}%` }}>
                          <div className="absolute bottom-0 w-full bg-emerald-500" style={{ height: '40%' }}></div>
                        </div>
                     ))}
                  </div>
                </div>
                <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20 flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-4 w-4 rounded-sm bg-emerald-500"></div>
                    <div className="h-4 w-24 bg-emerald-400/50 rounded-full"></div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="h-2.5 w-full bg-white/10 rounded-full"></div>
                    <div className="h-2.5 w-5/6 bg-white/10 rounded-full"></div>
                    <div className="h-2.5 w-4/6 bg-white/10 rounded-full"></div>
                    <div className="h-2.5 w-full bg-white/10 rounded-full"></div>
                  </div>
                  <div className="mt-6 h-10 w-full bg-white/5 rounded-md border border-emerald-500/20"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ShowcaseSection;
