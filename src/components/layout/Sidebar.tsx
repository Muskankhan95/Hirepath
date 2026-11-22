import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  FileSpreadsheet,
  Sparkles,
  UserCheck,
  PlusCircle,
  Users2,
  CheckCheck,
  BarChart3,
  FileDown,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
  badge?: string | number;
  badgeColor?: string;
  highlight?: boolean;
}

interface SidebarProps {
  onOpenQR?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenQR, className }) => {
  const { role, applications, approvals, studentProfile } = useAuth();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeApplicationsCount = applications.filter(
    (a) => a.studentId === (studentProfile?.id || 'stu_prof_01')
  ).length;

  const studentLinks: NavItem[] = [
    {
      to: '/student',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      end: true,
    },
    {
      to: '/student/opportunities',
      label: 'Job Opportunities',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      to: '/student/applications',
      label: 'My Applications',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: activeApplicationsCount > 0 ? activeApplicationsCount : undefined,
    },
    {
      to: '/student/resume-ai',
      label: 'Gemini AI Resume',
      icon: <Sparkles className="w-4 h-4 text-violet-500" />,
      highlight: true,
    },
    {
      to: '/student/profile',
      label: 'Profile & Pass',
      icon: <UserCheck className="w-4 h-4" />,
    },
  ];

  const recruiterLinks: NavItem[] = [
    {
      to: '/recruiter',
      label: 'Recruiter Hub',
      icon: <LayoutDashboard className="w-4 h-4" />,
      end: true,
    },
    {
      to: '/recruiter/post-drive',
      label: 'Post New Drive',
      icon: <PlusCircle className="w-4 h-4 text-brand-500" />,
      highlight: true,
    },
    {
      to: '/recruiter/pipeline',
      label: 'Applicant Pipeline',
      icon: <Users2 className="w-4 h-4" />,
      badge: applications.length,
    },
  ];

  const tpoLinks: NavItem[] = [
    {
      to: '/tpo',
      label: 'Placement Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      end: true,
    },
    {
      to: '/tpo/approvals',
      label: 'Approval Queue',
      icon: <CheckCheck className="w-4 h-4" />,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      to: '/tpo/analytics',
      label: 'Drive Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      to: '/tpo/reports',
      label: 'Placement Reports',
      icon: <FileDown className="w-4 h-4" />,
    },
  ];

  const currentLinks: NavItem[] =
    role === 'student' ? studentLinks : role === 'recruiter' ? recruiterLinks : tpoLinks;

  return (
    <aside
      className={cn(
        'w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-navy-950/50 backdrop-blur-md flex flex-col justify-between p-4',
        className
      )}
    >
      <div className="space-y-6">
        {/* Section title */}
        <div className="px-3 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {role.toUpperCase()} PORTAL NAVIGATION
          </p>
        </div>

        {/* Links list */}
        <nav className="space-y-1.5">
          {currentLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group select-none',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'transition-transform duration-200 group-hover:scale-110',
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-violet-500'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold',
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor ||
                              'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Card */}
      {role === 'student' && (
        <div className="mt-auto pt-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900/90 via-navy-900 to-violet-950 p-4 border border-indigo-500/30 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Pass
              </span>
              <QrCode className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="text-xs font-bold text-white">Student Placement Pass</p>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
              Roll: {studentProfile?.rollNumber || '21CS084'}
            </p>
            <button
              onClick={onOpenQR}
              className="mt-3 w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-200" />
              <span>Reveal QR Pass</span>
            </button>
          </div>
        </div>
      )}

      {role === 'recruiter' && (
        <div className="mt-auto pt-4">
          <div className="rounded-2xl bg-slate-100 dark:bg-navy-900 p-3.5 border border-slate-200 dark:border-slate-800 text-xs">
            <p className="font-semibold text-slate-900 dark:text-white">Google Campus Hiring</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              TPO Verified Recruiting Partner
            </p>
          </div>
        </div>
      )}

      {role === 'tpo' && (
        <div className="mt-auto pt-4">
          <div className="rounded-2xl bg-violet-50/70 dark:bg-violet-950/40 p-3.5 border border-violet-200/60 dark:border-violet-900/50 text-xs">
            <p className="font-semibold text-violet-900 dark:text-violet-200">Central TPO Cell</p>
            <p className="text-[11px] text-violet-700/80 dark:text-violet-400 mt-0.5">
              Apex Institute of Technology
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
