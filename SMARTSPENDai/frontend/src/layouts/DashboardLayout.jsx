import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children, onAddClick, hideHeaderControls }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#050505] bg-grid-pattern text-white font-sans overflow-hidden relative z-10">
      {/* Sidebar - Fixed Left on Desktop, Drawer on Mobile */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area - Scrollable Right */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <Header 
          onAddClick={onAddClick} 
          hideControls={hideHeaderControls} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
