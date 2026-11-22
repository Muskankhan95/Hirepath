import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-navy-950/40 backdrop-blur-sm py-5 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">HirePath Platform</span>
          <span>•</span>
          <span>Your Career. Your Opportunities. Your Future.</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Campus Network Operational</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
