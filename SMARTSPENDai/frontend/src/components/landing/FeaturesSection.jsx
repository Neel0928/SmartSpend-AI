import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lightbulb, PieChart, Target, BarChart3, FileText } from 'lucide-react';

const features = [
  {
    icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
    title: "Smart Expense Tracking",
    description: "Track every expense and understand exactly where your money goes with auto-categorization."
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-emerald-400" />,
    title: "AI Spending Analysis",
    description: "Let AI identify patterns, unusual spending, and hidden opportunities to save money."
  },
  {
    icon: <PieChart className="w-6 h-6 text-emerald-400" />,
    title: "Intelligent Budgeting",
    description: "Create smart budgets that adapt to your actual spending behavior and alert you in real-time."
  },
  {
    icon: <Target className="w-6 h-6 text-emerald-400" />,
    title: "Financial Goals",
    description: "Set savings goals and stay on track with intelligent progress tracking and reminders."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    title: "Visual Analytics",
    description: "Turn complicated financial data into simple, actionable visual insights and charts."
  },
  {
    icon: <FileText className="w-6 h-6 text-emerald-400" />,
    title: "Smart Reports",
    description: "Generate clear monthly reports and understand your overall financial progress effortlessly."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Everything your finances need. <br className="hidden md:block" />
            <span className="text-gray-500">Nothing they don't.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 group hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
