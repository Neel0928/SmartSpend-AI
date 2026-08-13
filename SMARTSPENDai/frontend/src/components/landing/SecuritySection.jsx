import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Server } from 'lucide-react';

const securityFeatures = [
  {
    icon: <Lock className="w-6 h-6 text-emerald-400" />,
    title: "Secure Authentication",
    description: "Built with modern authentication and secure session management."
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "Protected Data",
    description: "Strictly authenticated backend access ensures your data is only visible to you."
  },
  {
    icon: <Server className="w-6 h-6 text-emerald-400" />,
    title: "Privacy-focused Architecture",
    description: "Built with secure application practices and robust data storage."
  }
];

const SecuritySection = () => {
  return (
    <section id="security" className="py-24 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Your financial data <br className="hidden md:block" />
            deserves protection.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 flex flex-col items-center text-center group hover:border-emerald-500/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
