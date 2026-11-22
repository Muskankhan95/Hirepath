import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentStep1Schema, studentStep2Schema, studentStep3Schema } from '../../utils/schemas';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/layout/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileText,
  ShieldCheck,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const StudentRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([
    'React',
    'TypeScript',
    'Data Structures & Algorithms',
  ]);
  const [resumeFileName, setResumeFileName] = useState<string>('My_SDE_Resume.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  // Step 1 Form
  const form1 = useForm({
    resolver: zodResolver(studentStep1Schema),
    defaultValues: {
      fullName: 'Vikram Malhotra',
      rollNumber: '21CS150',
      collegeEmail: 'vikram.m@campus.edu',
      personalEmail: 'vikram.tech@gmail.com',
      phone: '9876543219',
      password: 'password123',
      confirmPassword: 'password123',
    },
  });

  // Step 2 Form
  const form2 = useForm({
    resolver: zodResolver(studentStep2Schema),
    defaultValues: {
      department: 'Computer Science & Engineering',
      batch: '2021 - 2025',
      cgpa: 8.75,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      gapYears: 0,
    },
  });

  // Step 3 Form
  const form3 = useForm({
    resolver: zodResolver(studentStep3Schema),
    defaultValues: {
      skills: skillsList,
      secondarySkills: ['Docker', 'AWS', 'PostgreSQL'],
      linkedInUrl: 'https://linkedin.com/in/vikram-dev',
      githubUrl: 'https://github.com/vikram-dev',
      portfolioUrl: 'https://vikram.me',
      resumeFileName: resumeFileName,
    },
  });

  const onStep1Submit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skillsList.includes(skillInput.trim())) {
        const updated = [...skillsList, skillInput.trim()];
        setSkillsList(updated);
        form3.setValue('skills', updated);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skillsList.filter((s) => s !== skillToRemove);
    setSkillsList(updated);
    form3.setValue('skills', updated);
  };

  const onStep3Submit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data, skills: skillsList, resumeFileName }));
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await registerStudent({
        fullName: formData.fullName,
        rollNumber: formData.rollNumber,
        collegeEmail: formData.collegeEmail,
        personalEmail: formData.personalEmail,
        phone: formData.phone,
        department: formData.department,
        batch: formData.batch,
        cgpa: formData.cgpa,
        activeBacklogs: formData.activeBacklogs,
        historyOfBacklogs: formData.historyOfBacklogs,
        gapYears: formData.gapYears,
        skills: skillsList,
        linkedInUrl: formData.linkedInUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        resumeFileName: resumeFileName,
      });
      navigate('/student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Personal Info' },
    { num: 2, title: 'Academics' },
    { num: 3, title: 'Skills & Resume' },
    { num: 4, title: 'Review & Submit' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-100 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <BrandLogo size="md" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Student Placement Registration
          </span>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-brand-500 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.num
                      ? 'bg-emerald-500 text-white'
                      : step === s.num
                      ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[11px] font-semibold mt-1.5 text-slate-600 dark:text-slate-400 hidden sm:block">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Personal & Credentials */}
          {step === 1 && (
            <motion.form
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={form1.handleSubmit(onStep1Submit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Vikram Malhotra"
                  error={form1.formState.errors.fullName?.message}
                  {...form1.register('fullName')}
                />
                <Input
                  label="Roll / Student ID"
                  placeholder="e.g. 21CS150"
                  error={form1.formState.errors.rollNumber?.message}
                  {...form1.register('rollNumber')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Institutional College Email"
                  type="email"
                  placeholder="name@campus.edu"
                  error={form1.formState.errors.collegeEmail?.message}
                  {...form1.register('collegeEmail')}
                />
                <Input
                  label="Personal Email"
                  type="email"
                  placeholder="name@gmail.com"
                  error={form1.formState.errors.personalEmail?.message}
                  {...form1.register('personalEmail')}
                />
              </div>

              <Input
                label="Primary Mobile Phone"
                placeholder="10-digit mobile number"
                error={form1.formState.errors.phone?.message}
                {...form1.register('phone')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={form1.formState.errors.password?.message}
                  {...form1.register('password')}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  error={form1.formState.errors.confirmPassword?.message}
                  {...form1.register('confirmPassword')}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Academics
                </Button>
              </div>
            </motion.form>
          )}

          {/* STEP 2: Academics & Eligibility */}
          {step === 2 && (
            <motion.form
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={form2.handleSubmit(onStep2Submit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Engineering Department"
                  error={form2.formState.errors.department?.message}
                  {...form2.register('department')}
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </Select>

                <Select
                  label="Graduating Batch"
                  error={form2.formState.errors.batch?.message}
                  {...form2.register('batch')}
                >
                  <option value="2021 - 2025">2021 - 2025 (Final Year)</option>
                  <option value="2022 - 2026">2022 - 2026 (Pre-final Year)</option>
                  <option value="2020 - 2024">2020 - 2024 (Passout)</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Cumulative CGPA (10.0 scale)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 8.75"
                  error={form2.formState.errors.cgpa?.message}
                  {...form2.register('cgpa')}
                />
                <Input
                  label="Active Backlogs"
                  type="number"
                  placeholder="0"
                  error={form2.formState.errors.activeBacklogs?.message}
                  {...form2.register('activeBacklogs')}
                />
                <Input
                  label="Education Gap (Years)"
                  type="number"
                  placeholder="0"
                  error={form2.formState.errors.gapYears?.message}
                  {...form2.register('gapYears')}
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                ⚠️ Academic metrics are officially validated by the TPO cell against semester grade sheets before issuing the Digital Placement Pass.
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Skills & Resume
                </Button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: Skills & Resume */}
          {step === 3 && (
            <motion.form
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={form3.handleSubmit(onStep3Submit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Key Technical Skills (Press Enter to add)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Type skill and press Enter (e.g. Docker, Python, Next.js)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (skillInput.trim() && !skillsList.includes(skillInput.trim())) {
                        const updated = [...skillsList, skillInput.trim()];
                        setSkillsList(updated);
                        form3.setValue('skills', updated);
                        setSkillInput('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                  {skillsList.map((skill) => (
                    <Badge key={skill} variant="brand" className="gap-1.5">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="LinkedIn Profile"
                  placeholder="https://linkedin.com/in/username"
                  {...form3.register('linkedInUrl')}
                />
                <Input
                  label="GitHub Profile"
                  placeholder="https://github.com/username"
                  {...form3.register('githubUrl')}
                />
              </div>

              {/* Resume File Upload Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Resume Document (PDF)
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-brand-300 dark:border-brand-900 bg-brand-50/30 dark:bg-navy-950 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {resumeFileName}
                      </p>
                      <p className="text-[11px] text-slate-400">PDF • Ready for Gemini AI ATS Parsing</p>
                    </div>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm">
                    Change PDF
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setResumeFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Review Registration
                </Button>
              </div>
            </motion.form>
          )}

          {/* STEP 4: Review & Final Submit */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-slate-50 dark:bg-navy-950 p-4 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                <div className="pb-3 flex justify-between">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formData.fullName}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Roll No & Dept</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formData.rollNumber} • {formData.department}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Cumulative CGPA</span>
                  <span className="font-bold text-emerald-500">{formData.cgpa} / 10.0</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">College Email</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formData.collegeEmail}
                  </span>
                </div>
                <div className="pt-3">
                  <span className="text-slate-500 block mb-1">Key Skills Declared</span>
                  <div className="flex flex-wrap gap-1">
                    {skillsList.map((s) => (
                      <Badge key={s} variant="brand" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0" />
                <span>
                  By submitting, you certify that academic records provided match university transcripts. The TPO Office will review your verification queue item and issue your authenticated Digital Placement Pass.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(3)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back to Skills
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  variant="gradient"
                  isLoading={isSubmitting}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Submit & Access Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
