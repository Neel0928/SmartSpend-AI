import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sentences = [
  "Analyzing your monthly subscriptions...",
  "Detected: $45 unused gym membership.",
  "Warning: Dining out exceeded budget by 15%.",
  "Optimizing savings plan for Q3...",
  "Recommendation: Move $200 to emergency fund."
];

const AiSection = () => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const targetText = sentences[currentSentence];
    
    const typingInterval = setInterval(() => {
      setDisplayedText(targetText.slice(0, i));
      i++;
      if (i > targetText.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentSentence((prev) => (prev + 1) % sentences.length);
        }, 2000);
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, [currentSentence]);

  return (
    <section id="ai-insights" className="py-24 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Your finances. <br />
              <span className="text-emerald-400">Now with intelligence.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md font-medium leading-relaxed">
              SmartSpend AI doesn't just record your expenses. It understands them.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Detect spending patterns automatically",
                "Identify unusual expenses and subscriptions",
                "Analyze monthly trends and cash flow",
                "Suggest better spending habits",
                "Help optimize budgets in real-time"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl border border-white/10 relative z-10 overflow-hidden font-mono">
              <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-gray-500">smartspend-ai-engine</span>
              </div>

              <div className="p-6 h-64 flex flex-col">
                <div className="flex-1 text-emerald-400">
                  <p className="mb-2 text-gray-400">&gt; Initializing neural network...</p>
                  <p className="mb-2 text-gray-400">&gt; Scanning recent transactions...</p>
                  <p className="mb-4 text-emerald-400 flex items-center">
                    &gt; {displayedText}
                    <span className="inline-block w-2 h-5 bg-emerald-400 ml-1 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AiSection;
