import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BrandLogo } from '../../components/layout/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const ResetPassword: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = () => {
    toast.success('Password updated successfully! Please sign in with your new credentials.');
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <BrandLogo size="md" className="justify-center mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Set New Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose a strong, secure passphrase for your campus account.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Password Updated!</p>
            <p className="text-xs text-slate-500">Redirecting to sign in portal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Reset Code / Token"
              type="text"
              required
              placeholder="e.g. 849201"
              {...register('token')}
            />
            <Input
              label="New Password"
              type="password"
              required
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              {...register('newPassword')}
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              {...register('confirmPassword')}
            />

            <Button type="submit" variant="gradient" size="md" className="w-full mt-2">
              Save New Password
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
