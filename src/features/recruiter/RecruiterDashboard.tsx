import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  PlusCircle,
  FileCheck,
  TrendingUp,
  Award,
  ArrowRight,
  ExternalLink,
  Building,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const RecruiterDashboard: React.FC = () => {
  const { recruiterProfile, jobDrives, applications } = useAuth();

  const recruiterDrives = jobDrives.filter(
    (d) => d.companyName.toLowerCase() === (recruiterProfile?.companyName?.toLowerCase() || 'google')
  );

  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Assessment' || a.status === 'Technical Round' || a.status === 'HR Round'
  ).length;
  const offersCount = applications.filter(
    (a) => a.status === 'Offer Extended' || a.status === 'Accepted'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-brand-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                Recruiter Portal
              </span>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Verified Campus Partner
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {recruiterProfile?.companyName || 'Google'} University Talent Hub
            </h1>
            <p className="mt-1 text-sm text-indigo-200 max-w-xl">
              Manage live drives, evaluate student candidates through AI-assisted screening, and run candidate interview pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/recruiter/post-drive">
              <Button
                variant="gradient"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Post New Campus Drive
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Drives</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {recruiterDrives.length || 2}
              </span>
              <span className="text-xs font-semibold text-blue-600">Approved</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Candidates Applied</span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalApplicants}
              </span>
              <span className="text-xs font-semibold text-brand-600">Total Pool</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">In Round Pipeline</span>
              <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {shortlistedCount}
              </span>
              <span className="text-xs font-semibold text-violet-600">Active</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Offers Extended</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {offersCount}
              </span>
              <span className="text-xs font-semibold text-emerald-600">Selected</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Campus Drives Table */}
      <Card glass>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Company Campus Drives</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Current postings and applicant intake status
            </p>
          </div>
          <Link to="/recruiter/post-drive">
            <Button variant="outline" size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
              Create Drive
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-navy-950/70 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 font-bold uppercase">Role Title</th>
                  <th className="p-3.5 font-bold uppercase">Package / CTC</th>
                  <th className="p-3.5 font-bold uppercase">Applicants</th>
                  <th className="p-3.5 font-bold uppercase">Eligibility</th>
                  <th className="p-3.5 font-bold uppercase">Status</th>
                  <th className="p-3.5 font-bold uppercase text-right">Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recruiterDrives.map((drv) => (
                  <tr key={drv.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/40 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{drv.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {drv.jobType} • {drv.location} ({drv.workMode})
                      </p>
                    </td>
                    <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      {drv.ctc}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {drv.applicantsCount}
                      </span>
                      <span className="text-slate-400"> / {drv.openings} openings</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-600 dark:text-slate-300">
                        Min CGPA {drv.eligibility.minCgpa}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={drv.status === 'Active' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {drv.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link to="/recruiter/pipeline">
                        <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Manage
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applicants Section */}
      <Card glass>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Recent Candidates in Pipeline</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Review candidate qualifications, AI scores, and move them across rounds
            </p>
          </div>
          <Link to="/recruiter/pipeline">
            <Button variant="primary" size="sm">
              Open Kanban Pipeline
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
          {applications.slice(0, 5).map((app) => (
            <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    app.studentAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={app.studentName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {app.studentName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {app.studentRollNo} • {app.department} • CGPA: {app.cgpa}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {app.resumeScore && (
                  <Badge variant="brand" size="sm" className="hidden sm:inline-flex">
                    AI Score: {app.resumeScore}%
                  </Badge>
                )}
                <StatusBadge status={app.status} size="sm" />
                <Link to="/recruiter/pipeline">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
