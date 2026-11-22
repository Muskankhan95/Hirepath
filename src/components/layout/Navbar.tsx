import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';
import {
  Bell,
  ChevronDown,
  LogOut,
  RotateCcw,
  Sparkles,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, role, switchRole, logout, resetDemoData, approvals } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const roleConfigs: Record<
    UserRole,
    { label: string; icon: React.ReactNode; color: string; badgeClass: string }
  > = {
    student: {
      label: 'Student View',
      icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
      color: 'text-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    recruiter: {
      label: 'Recruiter View',
      icon: <Briefcase className="w-4 h-4 text-brand-500" />,
      color: 'text-brand-500',
      badgeClass: 'bg-indigo-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border-brand-200 dark:border-brand-800',
    },
    tpo: {
      label: 'TPO Officer View',
      icon: <Building2 className="w-4 h-4 text-violet-500" />,
      color: 'text-violet-500',
      badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    },
  };

  const handleRoleSelect = (targetRole: UserRole) => {
    switchRole(targetRole);
    setShowRoleMenu(false);
    navigate(`/${targetRole}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to={`/${role}`}>
            <BrandLogo size="md" />
          </Link>
        </div>

        {/* Center: Live Role Switcher (Persona Selector) */}
        <div className="relative">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-inner">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1 hidden lg:inline">
              Active Persona:
            </span>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-navy-800 text-xs sm:text-sm font-semibold shadow-sm border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-navy-750"
            >
              {roleConfigs[role].icon}
              <span>{roleConfigs[role].label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Role Dropdown */}
          {showRoleMenu && (
            <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Switch Interactive View
              </div>
              {(['student', 'recruiter', 'tpo'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left transition-colors ${
                    role === r
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {roleConfigs[r].icon}
                    <span>{roleConfigs[r].label}</span>
                  </div>
                  {role === r && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reset Demo Data Pill */}
          <button
            onClick={resetDemoData}
            title="Reset platform to initial mock dataset"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovalsCount > 0 && role === 'tpo' && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                  <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2 py-0.5 rounded-full">
                    Live Updates
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto mt-2">
                  <div className="py-2.5 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Google Campus Drive Active
                      </p>
                      <p className="text-[11px] text-slate-400">Applications open for SDE-2025.</p>
                    </div>
                  </div>
                  {role === 'tpo' && pendingApprovalsCount > 0 && (
                    <div className="py-2.5 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-600 dark:text-amber-400">
                          {pendingApprovalsCount} Items Pending TPO Review
                        </p>
                        <p className="text-[11px] text-slate-400">Company drives & student approvals waiting.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                }
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/30"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                {user?.name || 'Alex Chen'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline mr-1" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to={role === 'student' ? '/student/profile' : `/${role}`}
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
