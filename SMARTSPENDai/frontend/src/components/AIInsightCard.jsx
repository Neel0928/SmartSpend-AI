import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Sparkles } from 'lucide-react';

export default function AIInsightCard({ refreshTrigger }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/insights');
        if (response.data && response.data.success) {
          setInsight(response.data.insight);
        } else {
          setError(response.data.message || 'AI insights are temporarily unavailable.');
        }
      } catch (error) {
        console.error('Failed to fetch AI insight', error);
        setError('AI insights are temporarily unavailable.\nPlease try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [refreshTrigger]);

  return (
    <div className="glass-card rounded-xl p-6 border border-white/10 h-full relative overflow-hidden flex flex-col group min-h-[160px]">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-white">AI Insight</h3>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-start">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <p className="text-gray-400 text-sm italic">Analyzing your spending...</p>
            <div className="h-4 bg-white/10 rounded w-full mt-2"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm leading-relaxed whitespace-pre-line">
            {error}
          </p>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed">
            {insight}
          </p>
        )}
      </div>

      {/* Decorative Robot Emoji placeholder as per design */}
      <div className="absolute right-0 bottom-0 text-[100px] leading-none opacity-80 translate-x-4 translate-y-4 pointer-events-none select-none">
        🤖
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
    </div>
  );
}
