import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-32 relative z-10 overflow-hidden border-t border-white/5">
      
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Start making smarter <br className="hidden md:block" />
            financial decisions.
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-2xl mx-auto">
            Track less. Understand more. Let SmartSpend AI help you build better financial habits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 w-full sm:w-auto text-lg"
            >
              Get Started — It's Free
            </Link>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:-translate-y-0.5 w-full sm:w-auto text-lg"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
