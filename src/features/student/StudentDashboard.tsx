import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { QRVerifyModal } from '../../components/shared/QRVerifyModal';
import { checkEligibility } from '../../utils/eligibility';
import { Link } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Calendar,
  CheckCircle,
  Briefcase,
  Video,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Building,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentDashboard: React.FC = () => {
  const { studentProfile, applications, jobDrives } = useAuth();
  const [showQR, setShowQR] = useState(false);

  const studentApps = applications.filter(
    (a) => a.studentId === (studentProfile?.id || 'stu_prof_01')
  );

  const shortlistedCount = studentApps.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Assessment' || a.status === 'Technical Round' || a.status === 'HR Round'
  ).length;

  const offersCount = studentApps.filter(
    (a) => a.status === 'Offer Extended' || a.status === 'Accepted'
  ).length;

  // Next scheduled interview
  const upcomingInterview = studentApps.find((a) => a.interviewSchedule)?.interviewSchedule;
  const interviewApp = studentApps.find((a) => a.interviewSchedule);

  // Eligible drives calculation
  const eligibleDrives = jobDrives.filter(
    (d) => checkEligibility(studentProfile, d).isEligible
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-violet-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                Batch 2025 • Placement Season Active
              </span>
              {studentProfile?.verifiedByTpo && (
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> TPO Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {studentProfile?.fullName || 'Alex Chen'}!
            </h1>
            <p className="mt-1 text-sm text-indigo-200 max-w-xl">
              You are currently eligible for <span className="font-bold text-white">{eligibleDrives.length}</span> active campus placement drives. Your verified CGPA is{' '}
              <span className="font-bold text-emerald-300">{studentProfile?.cgpa.toFixed(2)}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowQR(true)}
              leftIcon={<QrCode className="w-4 h-4 text-brand-600" />}
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-md"
            >
              Digital Pass
            </Button>
            <Link to="/student/opportunities">
              <Button
                variant="gradient"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse Drives
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Applied Drives</span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {studentApps.length}
              </span>
              <span className="text-xs font-semibold text-blue-600">Active</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Shortlisted</span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {shortlistedCount}
              </span>
              <span className="text-xs font-semibold text-brand-600">In Interview Pipeline</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Job Offers</span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {offersCount}
              </span>
              <span className="text-xs font-semibold text-emerald-600">Extended</span>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
          <Card glass className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Eligible Drives</span>
              <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {eligibleDrives.length}
              </span>
              <span className="text-xs text-slate-500">of {jobDrives.length} total</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Grid: Application Pipeline + Next Interview Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Applications & Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Active Application Pipeline</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live recruitment stage tracking for on-campus selections
                </p>
              </div>
              <Link to="/student/applications">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentApps.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  You haven't submitted any applications yet. Explore active opportunities to get started.
                </p>
              ) : (
                studentApps.slice(0, 4).map((app) => (
                  <div key={app.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-navy-800 p-2 flex items-center justify-center font-bold text-brand-600 text-sm border border-slate-200 dark:border-slate-700">
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {app.companyName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {app.jobTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} size="sm" />
                      <Link to="/student/applications">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* AI Resume Match Quick Action Card */}
          <Card className="bg-gradient-to-r from-brand-50 via-indigo-50/50 to-violet-50 dark:from-navy-900 dark:via-brand-950/30 dark:to-navy-900 border-brand-200 dark:border-brand-900/60 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Optimize Your Resume with Gemini AI
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-lg">
                    Check your resume's ATS score, uncover missing keywords, and get tailored technical recommendations before you apply.
                  </p>
                </div>
              </div>
              <Link to="/student/resume-ai">
                <Button variant="gradient" size="sm" className="shrink-0">
                  Run AI Scan
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Col: Next Interview / Upcoming Drives */}
        <div className="space-y-6">
          {/* Next Interview Widget */}
          {upcomingInterview && interviewApp ? (
            <Card className="border-indigo-500/40 bg-gradient-to-b from-white to-indigo-50/30 dark:from-navy-900 dark:to-indigo-950/20 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-950/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Next Interview
                  </span>
                  <Badge variant="brand">{interviewApp.companyName}</Badge>
                </div>
                <CardTitle className="text-base mt-2">
                  {interviewApp.jobTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {upcomingInterview.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {upcomingInterview.time}
                    </span>
                  </div>
                </div>

                <a
                  href={upcomingInterview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full gap-2"
                    leftIcon={<Video className="w-4 h-4" />}
                  >
                    Join Video Conference
                  </Button>
                </a>
              </CardContent>
            </Card>
          ) : (
            <Card glass className="p-5 text-center">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                No Interviews Scheduled Yet
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Once a company shortlists your profile, your interview calendar and Google Meet link will appear here.
              </p>
            </Card>
          )}

          {/* Featured Top Drive */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">High-Package Campus Spotlight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobDrives.slice(0, 2).map((drv) => (
                <div
                  key={drv.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white dark:bg-navy-800 shadow-sm border border-slate-200 dark:border-slate-700">
                      <Building className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {drv.companyName}
                      </p>
                      <p className="text-[11px] font-semibold text-emerald-600">
                        {drv.ctc}
                      </p>
                    </div>
                  </div>
                  <Link to="/student/opportunities">
                    <Button variant="ghost" size="sm">
                      Apply
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Verify Modal */}
      <QRVerifyModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        student={studentProfile}
      />
    </div>
  );
};
