import React from 'react';
import { WalletCards } from 'lucide-react';

export default function AppMark({ size = 'md', showName = true }) {
  const dimensions = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dimensions} rounded-xl bg-emerald-400 flex items-center justify-center shadow-[0_6px_18px_rgba(16,185,129,0.2)]`}>
        <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] rounded-[10px] bg-[#0b1511] flex items-center justify-center">
          <WalletCards className={`${iconSize} text-emerald-300`} strokeWidth={1.8} />
        </div>
      </div>
      {showName && (
        <span className="font-bold text-xl tracking-tight text-white">
          SmartSpend <span className="text-emerald-400">AI</span>
        </span>
      )}
    </div>
  );
}
