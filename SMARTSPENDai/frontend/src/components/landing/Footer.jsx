import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8 relative z-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 inline-flex group">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">SmartSpend <span className="text-emerald-400">AI</span></span>
            </Link>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
              Smarter money management, powered by AI.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm font-medium text-gray-500 hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="#ai-insights" className="text-sm font-medium text-gray-500 hover:text-emerald-400 transition-colors">AI Insights</a></li>
              <li><Link to="/login" className="text-sm font-medium text-gray-500 hover:text-emerald-400 transition-colors">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-emerald-400 transition-colors">About</a></li>
              <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Account</h4>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-sm font-medium text-gray-500 hover:text-emerald-400 transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Get Started &rarr;</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 font-medium">
            © 2026 SmartSpend AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
