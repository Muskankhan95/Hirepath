import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AIAnalysisResult } from '../../types';
import { Sparkles, CheckCircle, AlertCircle, ArrowUpRight, Cpu } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AIInsightCardProps {
  analysis: AIAnalysisResult;
  targetRole?: string;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  analysis,
  targetRole,
  className,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 70) return 'text-brand-500 stroke-brand-500';
    return 'text-amber-500 stroke-amber-500';
  };

  return (
    <Card
      glass
      className={cn(
        'border-brand-500/20 dark:border-brand-500/30 overflow-hidden shadow-lg relative',
        className
      )}
    >
      {/* Ambient gradient */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-brand-500/10 via-violet-500/5 to-transparent pointer-events-none" />

      <CardHeader className="pb-3 flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              Gemini AI Resume Intelligence
            </CardTitle>
            {targetRole && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target Role: <span className="font-semibold text-slate-700 dark:text-slate-200">{targetRole}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={analysis.matchScore >= 85 ? 'success' : 'brand'}>
            {analysis.verdict}
          </Badge>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-violet-400" />
            Gemini 2.0
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Metric Gauges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={cn(getScoreColor(analysis.matchScore), 'transition-all duration-1000 ease-out')}
                  strokeDasharray={`${analysis.matchScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-sm text-slate-800 dark:text-white">
                {analysis.matchScore}%
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block uppercase">
                Job Fit Match
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {analysis.matchScore >= 80 ? 'Highly Recommended' : 'Moderate Alignment'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-brand-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${analysis.atsScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-bold text-sm text-slate-800 dark:text-white">
                {analysis.atsScore}%
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block uppercase">
                ATS Scannability
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Parser Optimized
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-3.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/50">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Strengths & Missing Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Key Strengths Found
            </span>
            <ul className="space-y-1.5">
              {analysis.strengths.slice(0, 3).map((s, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Missing High-Impact Keywords
            </span>
            <div className="flex flex-wrap gap-1.5">
              {analysis.missingKeywords.length > 0 ? (
                analysis.missingKeywords.map((kw, idx) => (
                  <Badge key={idx} variant="warning" size="sm">
                    + {kw}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-500">None! Complete keyword coverage.</span>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 mb-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-brand-500" />
              AI Recommendations to Win Interview
            </span>
            <div className="space-y-1.5">
              {analysis.recommendations.slice(0, 2).map((rec, idx) => (
                <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 pl-2 border-l-2 border-brand-400">
                  {rec}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
