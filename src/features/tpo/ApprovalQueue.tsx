import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TPOApprovalItem } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Briefcase,
  GraduationCap,
  Building,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const ApprovalQueue: React.FC = () => {
  const { approvals, handleApproval } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'job_drive' | 'recruiter' | 'student_verification'>('all');

  const filteredItems = useMemo(() => {
    return approvals.filter((item) => {
      if (activeTab === 'all') return true;
      return item.type === activeTab;
    });
  }, [approvals, activeTab]);

  const tabs = [
    {
      id: 'all',
      label: 'All Requests',
      badge: approvals.filter((a) => a.status === 'pending').length,
    },
    {
      id: 'job_drive',
      label: 'Company Drives',
      badge: approvals.filter((a) => a.type === 'job_drive' && a.status === 'pending').length,
    },
    {
      id: 'recruiter',
      label: 'Recruiter Accounts',
      badge: approvals.filter((a) => a.type === 'recruiter' && a.status === 'pending').length,
    },
    {
      id: 'student_verification',
      label: 'Student Verifications',
      badge: approvals.filter((a) => a.type === 'student_verification' && a.status === 'pending').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Central TPO Approval Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review company campus drives, verify student grade transcripts, and authorize corporate recruiting partners.
          </p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />
      </div>

      {/* Approvals List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
          title="Approval Queue Cleared"
          description="There are currently no pending verification requests in this category."
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isPending = item.status === 'pending';

            return (
              <Card
                key={item.id}
                glass
                className={`p-5 transition-all ${
                  isPending
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'opacity-70 bg-slate-50/50 dark:bg-navy-950/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
                      {item.type === 'job_drive' && <Briefcase className="w-5 h-5" />}
                      {item.type === 'recruiter' && <Building className="w-5 h-5" />}
                      {item.type === 'student_verification' && (
                        <GraduationCap className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <Badge
                          variant={
                            item.status === 'approved'
                              ? 'success'
                              : item.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500">
                        Submitted by: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.submittedBy}</span> ({item.submittedEmail}) • {formatDate(item.submittedAt)}
                      </p>

                      {/* Metadata Chips */}
                      <div className="flex flex-wrap gap-2 pt-2 text-xs">
                        {item.meta.ctc && (
                          <span className="p-1.5 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                            CTC: {item.meta.ctc}
                          </span>
                        )}
                        {item.meta.minCgpa && (
                          <span className="p-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                            Min CGPA: {item.meta.minCgpa}
                          </span>
                        )}
                        {item.meta.openings && (
                          <span className="p-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                            Openings: {item.meta.openings}
                          </span>
                        )}
                        {item.meta.department && (
                          <span className="p-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                            Dept: {item.meta.department}
                          </span>
                        )}
                        {item.meta.submittedCgpa && (
                          <span className="p-1.5 px-2.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 font-bold">
                            Submitted CGPA: {item.meta.submittedCgpa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isPending ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleApproval(item.id, 'rejected', 'Criteria not compliant with university norms')}
                        leftIcon={<XCircle className="w-4 h-4" />}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproval(item.id, 'approved')}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Approve Request
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Processed by TPO Desk
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
