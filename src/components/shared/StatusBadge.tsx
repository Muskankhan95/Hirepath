import React from 'react';
import { ApplicationStatus } from '../../types';
import { getStatusTheme } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { CheckCircle2, Clock, FileText, Send, Sparkles, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className,
  showIcon = true,
}) => {
  const theme = getStatusTheme(status as ApplicationStatus);

  const getStatusIcon = (st: string) => {
    switch (st) {
      case 'Applied':
        return <Send className="w-3 h-3" />;
      case 'Under Review':
      case 'Assessment':
        return <Clock className="w-3 h-3" />;
      case 'Shortlisted':
      case 'Technical Round':
      case 'HR Round':
        return <FileText className="w-3 h-3" />;
      case 'Offer Extended':
      case 'Accepted':
        return <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />;
      case 'Rejected':
        return <XCircle className="w-3 h-3 text-rose-500" />;
      default:
        return <CheckCircle2 className="w-3 h-3" />;
    }
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border select-none transition-all',
        theme.bg,
        theme.text,
        theme.border,
        sizes[size],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', theme.dot)} />
      {showIcon && getStatusIcon(status)}
      <span>{status}</span>
    </span>
  );
};
