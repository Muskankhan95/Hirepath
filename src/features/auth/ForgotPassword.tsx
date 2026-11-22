import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BrandLogo } from '../../components/layout/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const { register, handleSubmit } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => {
    setEmailValue(data.email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-navy-950">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <BrandLogo size="md" className="justify-center mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your registered institutional or corporate email to receive recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Recovery Link Dispatched
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We have sent an authentication reset token to <span className="font-semibold">{emailValue}</span>.
              </p>
            </div>
            <Link to="/reset-password">
              <Button variant="primary" size="sm" className="w-full mt-4">
                Enter Reset Token
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              required
              placeholder="alex.chen@campus.edu"
              leftIcon={<Mail className="w-4 h-4" />}
              {...register('email')}
            />

            <Button type="submit" variant="gradient" size="md" className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
