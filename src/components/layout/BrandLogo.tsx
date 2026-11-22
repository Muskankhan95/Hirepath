import React from 'react';
import { cn } from '../../utils/cn';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  showTagline = false,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Dynamic Emblem */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 shadow-md shadow-brand-500/25 p-1.5 shrink-0',
          iconSizes[size]
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-white"
        >
          {/* Path Arrow upward */}
          <path d="M4 19 L12 11 L16 15 L21 5" />
          <path d="M15 5 L21 5 L21 11" />
          {/* Constellation Star node */}
          <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={cn(
              'font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent',
              textSizes[size]
            )}
          >
            Hire<span className="text-brand-600 dark:text-brand-400">Path</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            AI SaaS
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-tight mt-0.5">
            Your Career. Your Opportunities. Your Future.
          </span>
        )}
      </div>
    </div>
  );
};
