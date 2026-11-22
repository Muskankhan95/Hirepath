import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../utils/schemas';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/layout/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex.chen@campus.edu',
      password: 'password123',
      role: 'student',
      rememberMe: true,
    },
  });

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);

    // Auto-fill demo credentials for seamless testing
    if (role === 'student') {
      setValue('email', 'alex.chen@campus.edu');
      setValue('password', 'password123');
    } else if (role === 'recruiter') {
      setValue('email', 'sarah.jenkins@google.com');
      setValue('password', 'password123');
    } else if (role === 'tpo') {
      setValue('email', 'tpo.director@university.edu');
      setValue('password', 'password123');
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.role);
      navigate(`/${data.role}`);
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoRoles: { role: UserRole; name: string; email: string; label: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      label: 'Student (CSE)',
      icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
    },
    {
      role: 'recruiter',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@google.com',
      label: 'Google Recruiter',
      icon: <Briefcase className="w-4 h-4 text-brand-500" />,
    },
    {
      role: 'tpo',
      name: 'Dr. Arthur Vance',
      email: 'tpo.director@university.edu',
      label: 'TPO Officer',
      icon: <Building2 className="w-4 h-4 text-violet-500" />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-indigo-50/30 to-slate-100 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-2">
            <BrandLogo size="lg" showTagline />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Sign in to access your AI-powered campus placement hub
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-500" /> 1-Click Instant Demo Login
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {quickDemoRoles.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => handleRoleChange(item.role)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all border ${
                  selectedRole === item.role
                    ? 'bg-white dark:bg-navy-800 border-brand-500 shadow-sm text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/30'
                    : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-navy-850'
                }`}
              >
                {item.icon}
                <span className="mt-1 text-[11px] leading-tight text-center truncate w-full">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('role')} value={selectedRole} />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@campus.edu"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-700 dark:bg-navy-950"
                {...register('rememberMe')}
              />
              <span>Remember me</span>
            </label>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Role-Based Access
            </span>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-2"
          >
            Enter {selectedRole.toUpperCase()} Portal
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>New student joining placement season? </span>
          <Link
            to="/register"
            className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Register Student Profile
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
