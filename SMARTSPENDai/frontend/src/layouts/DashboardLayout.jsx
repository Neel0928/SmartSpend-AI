import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children, onAddClick, hideHeaderControls }) {
  return (
    <div className="flex h-screen bg-[#050505] bg-grid-pattern text-white font-sans overflow-hidden relative z-10">
      {/* Sidebar - Fixed Left */}
      <Sidebar />

      {/* Main Content Area - Scrollable Right */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onAddClick={onAddClick} hideControls={hideHeaderControls} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
