import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AiSection from '../components/landing/AiSection';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import GoalsSection from '../components/landing/GoalsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ShowcaseSection from '../components/landing/ShowcaseSection';
import SecuritySection from '../components/landing/SecuritySection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-emerald-500/30">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <AiSection />
        <AnalyticsSection />
        <GoalsSection />
        <HowItWorksSection />
        <ShowcaseSection />
        <SecuritySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
