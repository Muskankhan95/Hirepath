import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Application, ApplicationStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { CandidateReviewModal } from './CandidateReviewModal';
import {
  Kanban,
  Table as TableIcon,
  Search,
  Filter,
  Users,
  Sparkles,
  ArrowRight,
  Video,
  Award,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ApplicantPipeline: React.FC = () => {
  const { applications, updateApplicationStatus, jobDrives } = useAuth();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriveFilter, setSelectedDriveFilter] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);

  const KANBAN_STAGES: { status: ApplicationStatus; title: string; color: string }[] = [
    { status: 'Applied', title: 'Applied', color: 'border-blue-500' },
    { status: 'Shortlisted', title: 'Shortlisted', color: 'border-indigo-500' },
    { status: 'Assessment', title: 'Assessment', color: 'border-purple-500' },
    { status: 'Technical Round', title: 'Tech Round', color: 'border-cyan-500' },
    { status: 'HR Round', title: 'HR Round', color: 'border-amber-500' },
    { status: 'Offer Extended', title: 'Offer Extended', color: 'border-emerald-500' },
  ];

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (selectedDriveFilter !== 'All' && app.driveId !== selectedDriveFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.studentName.toLowerCase().includes(q) ||
          app.studentRollNo.toLowerCase().includes(q) ||
          app.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, selectedDriveFilter, searchQuery]);

  const advanceStage = (app: Application) => {
    const stageOrder: ApplicationStatus[] = [
      'Applied',
      'Shortlisted',
      'Assessment',
      'Technical Round',
      'HR Round',
      'Offer Extended',
    ];
    const currIdx = stageOrder.indexOf(app.status);
    if (currIdx < stageOrder.length - 1) {
      const nextStatus = stageOrder[currIdx + 1];
      updateApplicationStatus(app.id, nextStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Applicant Recruitment Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track student candidates across interview rounds, manage schedules, and extend placement offers.
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search candidates by name, roll number, or department..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <select
            value={selectedDriveFilter}
            onChange={(e) => setSelectedDriveFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">Drive: All Active Postings</option>
            {jobDrives.map((d) => (
              <option key={d.id} value={d.id}>
                {d.companyName} — {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((col) => {
            const stageApps = filteredApps.filter((a) => a.status === col.status);

            return (
              <div
                key={col.status}
                className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800 p-2.5 min-w-[220px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 px-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {col.title}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                    {stageApps.length}
                  </span>
                </div>

                {/* Candidate Cards in Column */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[680px]">
                  {stageApps.map((app) => (
                    <motion.div
                      key={app.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelectedCandidate(app)}
                      className="cursor-pointer p-3 rounded-xl bg-white dark:bg-navy-950 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md transition-all space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            app.studentAvatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                          }
                          alt={app.studentName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {app.studentName}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {app.studentRollNo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">CGPA: {app.cgpa}</span>
                        {app.resumeScore && (
                          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            {app.resumeScore}%
                          </span>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {app.companyName}
                        </span>
                        {col.status !== 'Offer Extended' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceStage(app);
                            }}
                            title="Move to next stage"
                            className="p-1 rounded-md text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <Card glass>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-navy-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 font-bold uppercase">Candidate</th>
                    <th className="p-3.5 font-bold uppercase">Role & Company</th>
                    <th className="p-3.5 font-bold uppercase">Department</th>
                    <th className="p-3.5 font-bold uppercase">CGPA</th>
                    <th className="p-3.5 font-bold uppercase">AI ATS Score</th>
                    <th className="p-3.5 font-bold uppercase">Stage</th>
                    <th className="p-3.5 font-bold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-navy-800/40 transition-colors"
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              app.studentAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                            }
                            alt={app.studentName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {app.studentName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {app.studentRollNo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {app.jobTitle}
                        </p>
                        <p className="text-[11px] text-slate-400">{app.companyName}</p>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {app.department}
                      </td>
                      <td className="p-3.5 font-extrabold text-emerald-600">
                        {app.cgpa}
                      </td>
                      <td className="p-3.5">
                        {app.resumeScore ? (
                          <Badge variant="brand" size="sm">
                            {app.resumeScore}% Match
                          </Badge>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedCandidate(app)}
                        >
                          Review Candidate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidate Review Modal */}
      <CandidateReviewModal
        application={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
};
