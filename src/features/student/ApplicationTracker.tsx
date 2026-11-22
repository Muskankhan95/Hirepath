import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Application, ApplicationStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { EmptyState } from '../../components/shared/EmptyState';
import { Tabs } from '../../components/ui/Tabs';
import { formatDate } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  FileText,
  Video,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  PartyPopper,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const ApplicationTracker: React.FC = () => {
  const { applications, studentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const studentApps = applications.filter(
    (a) => a.studentId === (studentProfile?.id || 'stu_prof_01')
  );

  const STAGES: ApplicationStatus[] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Assessment',
    'Technical Round',
    'HR Round',
    'Offer Extended',
  ];

  const getStageIndex = (status: ApplicationStatus): number => {
    const idx = STAGES.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const filteredApps = studentApps.filter((app) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'interviews') {
      return (
        app.status === 'Technical Round' ||
        app.status === 'HR Round' ||
        !!app.interviewSchedule
      );
    }
    if (activeTab === 'offers') {
      return app.status === 'Offer Extended' || app.status === 'Accepted';
    }
    return true;
  });

  const triggerConfetti = (companyName: string) => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
    toast.success(`Congratulations on your campus offer from ${companyName}! 🎓🎉`);
  };

  const tabs = [
    { id: 'all', label: 'All Applications', badge: studentApps.length },
    {
      id: 'interviews',
      label: 'Interviews & Rounds',
      badge: studentApps.filter((a) => a.interviewSchedule).length,
    },
    {
      id: 'offers',
      label: 'Offer Letters',
      badge: studentApps.filter((a) => a.status === 'Offer Extended').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Pipeline Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-stage status from initial resume screening to final offer letters.
          </p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No Applications in this Category"
          description="Browse campus opportunities and apply to see your real-time stage progression."
        />
      ) : (
        <div className="space-y-5">
          {filteredApps.map((app) => {
            const currentIdx = getStageIndex(app.status);
            const isOffer = app.status === 'Offer Extended' || app.status === 'Accepted';
            const isExpanded = expandedAppId === app.id;

            return (
              <Card
                key={app.id}
                glass
                className={`transition-all duration-200 border-slate-200/90 dark:border-slate-800 ${
                  isOffer ? 'ring-1 ring-emerald-500/30' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-brand-500/20">
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {app.companyName}
                          </h3>
                          <StatusBadge status={app.status} size="sm" />
                        </div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {app.jobTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Applied: {formatDate(app.appliedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOffer && (
                        <Button
                          variant="gradient"
                          size="sm"
                          onClick={() => triggerConfetti(app.companyName)}
                          leftIcon={<PartyPopper className="w-4 h-4 text-amber-300" />}
                        >
                          Celebrate Offer!
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setExpandedAppId(isExpanded ? null : app.id)
                        }
                        rightIcon={
                          isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        }
                      >
                        {isExpanded ? 'Hide Details' : 'Timeline & Schedule'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Visual Step Progress Bar */}
                  <div className="pt-2 pb-2">
                    <div className="relative">
                      {/* Gray track line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2" />
                      {/* Active green/brand line */}
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 transition-all duration-500"
                        style={{
                          width: `${(currentIdx / (STAGES.length - 1)) * 100}%`,
                        }}
                      />

                      <div className="relative flex justify-between">
                        {STAGES.map((st, i) => {
                          const isPassed = i < currentIdx;
                          const isCurrent = i === currentIdx;

                          return (
                            <div
                              key={st}
                              className="flex flex-col items-center select-none"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isPassed
                                    ? 'bg-emerald-500 text-white'
                                    : isCurrent
                                    ? 'bg-brand-600 text-white ring-4 ring-brand-500/25 scale-110 shadow-sm'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                }`}
                              >
                                {isPassed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  i + 1
                                )}
                              </div>
                              <span
                                className={`mt-2 text-[10px] text-center font-medium max-w-[70px] leading-tight hidden sm:block ${
                                  isCurrent
                                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Offer Extended Highlight Box */}
                  {app.offerDetails && (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-brand-500/15 border border-emerald-500/30 text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-500 text-white shadow-md">
                          <PartyPopper className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Formal Campus Offer Extended
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Offered Package: {app.offerDetails.offeredCtc}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Tentative Joining: {formatDate(app.offerDetails.joiningDate)}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => toast.success('Offer Letter downloaded!')}
                        leftIcon={<FileText className="w-4 h-4" />}
                      >
                        Download Offer Letter
                      </Button>
                    </motion.div>
                  )}

                  {/* Scheduled Interview Banner */}
                  {app.interviewSchedule && (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-sm">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                            Live Video Interview Scheduled
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {app.interviewSchedule.date} at {app.interviewSchedule.time}
                          </h4>
                          {app.interviewSchedule.instructions && (
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              Note: {app.interviewSchedule.instructions}
                            </p>
                          )}
                        </div>
                      </div>

                      <a
                        href={app.interviewSchedule.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                        >
                          Join Meeting
                        </Button>
                      </a>
                    </div>
                  )}

                  {/* Expandable Application Timeline Accordion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3"
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Recruitment Audit Timeline
                        </h4>
                        <div className="space-y-2.5 pl-2 border-l-2 border-brand-300 dark:border-brand-800">
                          {app.timeline.map((event, idx) => (
                            <div key={idx} className="relative pl-3 text-xs">
                              <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-white dark:ring-navy-900" />
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {event.status}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatDate(event.date)}
                                </span>
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                                {event.message}
                              </p>
                            </div>
                          ))}
                        </div>

                        {app.recruiterFeedback && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                              Recruiter Feedback:
                            </span>
                            <p className="text-slate-500">{app.recruiterFeedback}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
