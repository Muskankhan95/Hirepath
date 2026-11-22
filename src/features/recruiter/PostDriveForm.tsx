import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postDriveSchema, PostDriveFormData } from '../../utils/schemas';
import { useAuth } from '../../context/AuthContext';
import { DriveRound } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

export const PostDriveForm: React.FC = () => {
  const { addJobDrive, recruiterProfile } = useAuth();
  const navigate = useNavigate();

  const [rounds, setRounds] = useState<DriveRound[]>([
    {
      id: 'rnd_1',
      roundNumber: 1,
      name: 'Online Coding Assessment',
      description: 'Algorithm and DSA challenge on online platform',
      mode: 'Online',
    },
    {
      id: 'rnd_2',
      roundNumber: 2,
      name: 'Technical Interview (Architecture & DSA)',
      description: '45-minute live problem solving and system concepts',
      mode: 'Online',
    },
    {
      id: 'rnd_3',
      roundNumber: 3,
      name: 'Managerial & Cultural Fit HR Round',
      description: 'Behavioral discussion and team alignment',
      mode: 'Online',
    },
  ]);

  const allBranches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Data Science & AI',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const [selectedBranches, setSelectedBranches] = useState<string[]>([
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostDriveFormData>({
    resolver: zodResolver(postDriveSchema),
    defaultValues: {
      title: 'Full-Stack Software Engineer (Campus 2025)',
      roleCategory: 'Software Engineering',
      jobType: 'Full-Time',
      location: 'Bengaluru / Hyderabad',
      workMode: 'Hybrid',
      ctc: '20 - 26 LPA',
      openings: 8,
      minCgpa: 8.0,
      eligibleBranches: selectedBranches,
      allowedBacklogs: 0,
      maxGapYears: 0,
      graduatingBatch: '2025',
      registrationDeadline: '2025-07-10',
      driveDate: '2025-07-15',
      description:
        'We are hiring energetic software engineers to join our high-growth platform engineering teams. You will design, build, and deploy high-volume scalable backend microservices and sleek reactive web applications.',
      requirements:
        'Strong computer science fundamentals (DSA, Operating Systems, Networks). Experience with modern web technologies such as React, TypeScript, Node.js, and relational databases (PostgreSQL/MySQL).',
      responsibilities:
        'Design and deploy production-grade code. Collaborate with cross-functional engineering and design groups. Participate in sprint planning, code reviews, and live deployments.',
      tags: 'TypeScript, React, Node.js, PostgreSQL, Cloud',
    },
  });

  const toggleBranch = (b: string) => {
    let updated: string[];
    if (selectedBranches.includes(b)) {
      updated = selectedBranches.filter((item) => item !== b);
    } else {
      updated = [...selectedBranches, b];
    }
    setSelectedBranches(updated);
    setValue('eligibleBranches', updated);
  };

  const addRound = () => {
    const nextNum = rounds.length + 1;
    const newRound: DriveRound = {
      id: `rnd_${Date.now()}`,
      roundNumber: nextNum,
      name: `Technical Round ${nextNum}`,
      description: 'Coding / Domain Technical Evaluation',
      mode: 'Online',
    };
    setRounds([...rounds, newRound]);
  };

  const removeRound = (id: string) => {
    if (rounds.length <= 1) {
      toast.error('At least 1 round is required');
      return;
    }
    const updated = rounds
      .filter((r) => r.id !== id)
      .map((r, i) => ({ ...r, roundNumber: i + 1 }));
    setRounds(updated);
  };

  const onSubmit = async (data: PostDriveFormData) => {
    try {
      addJobDrive({
        recruiterId: recruiterProfile?.id || 'rec_prof_01',
        companyName: recruiterProfile?.companyName || 'Google',
        companyLogo:
          recruiterProfile?.companyLogo ||
          'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        title: data.title,
        roleCategory: data.roleCategory,
        jobType: data.jobType,
        location: data.location,
        workMode: data.workMode,
        ctc: data.ctc,
        baseSalary: data.baseSalary || 22,
        openings: data.openings,
        eligibility: {
          minCgpa: data.minCgpa,
          eligibleBranches: selectedBranches,
          allowedBacklogs: data.allowedBacklogs,
          maxGapYears: data.maxGapYears,
          graduatingBatch: data.graduatingBatch,
        },
        rounds,
        description: data.description,
        responsibilities: data.responsibilities.split('\n').filter(Boolean),
        requirements: data.requirements.split('\n').filter(Boolean),
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : ['Engineering'],
        status: 'Pending Approval',
        registrationDeadline: `${data.registrationDeadline}T23:59:59Z`,
        driveDate: `${data.driveDate}T09:00:00Z`,
      });

      navigate('/recruiter');
    } catch (e: any) {
      toast.error(e.message || 'Error creating job drive');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create New Campus Placement Drive
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Post roles, define rigorous eligibility criteria, and structure interview rounds. Submitted drives undergo compliance review by the TPO Office.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Role Information */}
        <Card glass>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-500" />
              Job & Role Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Job Role Title"
              placeholder="e.g. Associate Software Engineer - 2025"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Role Category"
                error={errors.roleCategory?.message}
                {...register('roleCategory')}
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Cloud/DevOps">Cloud/DevOps</option>
                <option value="Data Science">Data Science</option>
                <option value="Core Engineering">Core Engineering</option>
                <option value="Product & Design">Product & Design</option>
              </Select>

              <Select
                label="Job Type"
                error={errors.jobType?.message}
                {...register('jobType')}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Internship + PPO">Internship + PPO</option>
              </Select>

              <Select
                label="Work Mode"
                error={errors.workMode?.message}
                {...register('workMode')}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-Site">On-Site</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Location"
                placeholder="e.g. Bengaluru / Hyderabad"
                error={errors.location?.message}
                {...register('location')}
              />
              <Input
                label="Compensation / CTC"
                placeholder="e.g. 18 - 24 LPA"
                error={errors.ctc?.message}
                {...register('ctc')}
              />
              <Input
                label="Total Vacancies / Openings"
                type="number"
                placeholder="5"
                error={errors.openings?.message}
                {...register('openings')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Eligibility Criteria */}
        <Card glass>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Eligibility Filters & Student Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="Minimum CGPA (0.0 - 10.0)"
                type="number"
                step="0.05"
                placeholder="7.50"
                error={errors.minCgpa?.message}
                {...register('minCgpa')}
              />
              <Input
                label="Max Allowed Backlogs"
                type="number"
                placeholder="0"
                error={errors.allowedBacklogs?.message}
                {...register('allowedBacklogs')}
              />
              <Input
                label="Max Gap Years"
                type="number"
                placeholder="0"
                error={errors.maxGapYears?.message}
                {...register('maxGapYears')}
              />
              <Select
                label="Target Batch"
                error={errors.graduatingBatch?.message}
                {...register('graduatingBatch')}
              >
                <option value="2025">2025 (Final Year)</option>
                <option value="2026">2026 (Pre-final)</option>
              </Select>
            </div>

            {/* Branch Checkboxes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Eligible Engineering Branches
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allBranches.map((b) => {
                  const isChecked = selectedBranches.includes(b);
                  return (
                    <label
                      key={b}
                      onClick={() => toggleBranch(b)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-brand-50/70 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300'
                          : 'bg-white dark:bg-navy-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{b}</span>
                    </label>
                  );
                })}
              </div>
              {selectedBranches.length === 0 && (
                <p className="text-xs text-rose-500 mt-1">Please select at least one branch.</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registration Deadline Date"
                type="date"
                error={errors.registrationDeadline?.message}
                {...register('registrationDeadline')}
              />
              <Input
                label="Drive Start Date"
                type="date"
                error={errors.driveDate?.message}
                {...register('driveDate')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Multi-Round Selection Process Builder */}
        <Card glass>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-500" />
              Selection Process Rounds ({rounds.length})
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRound}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Next Round
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rounds.map((round, idx) => (
              <div
                key={round.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={round.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRounds(
                          rounds.map((r) => (r.id === round.id ? { ...r, name: val } : r))
                        );
                      }}
                      className="font-bold text-xs bg-transparent border-b border-slate-300 dark:border-slate-700 focus:outline-none focus:border-brand-500 w-full"
                    />
                  </div>
                  <input
                    type="text"
                    value={round.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRounds(
                        rounds.map((r) => (r.id === round.id ? { ...r, description: val } : r))
                      );
                    }}
                    placeholder="Short description of topics/mode"
                    className="text-xs text-slate-500 bg-transparent w-full focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={round.mode}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setRounds(
                        rounds.map((r) => (r.id === round.id ? { ...r, mode: val } : r))
                      );
                    }}
                    className="rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 py-1 px-2"
                  >
                    <option value="Online">Online</option>
                    <option value="On-Campus">On-Campus</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeRound(round.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section 4: Descriptions & Tags */}
        <Card glass>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Job Description & Expectations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              label="Job Description"
              rows={3}
              error={errors.description?.message}
              {...register('description')}
            />
            <Textarea
              label="Key Responsibilities (One per line)"
              rows={3}
              error={errors.responsibilities?.message}
              {...register('responsibilities')}
            />
            <Textarea
              label="Technical Requirements (One per line)"
              rows={3}
              error={errors.requirements?.message}
              {...register('requirements')}
            />
            <Input
              label="Keywords & Technology Tags (Comma separated)"
              placeholder="e.g. React, TypeScript, Node.js, Distributed Systems"
              error={errors.tags?.message}
              {...register('tags')}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="outline" onClick={() => navigate('/recruiter')}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Submit Drive to TPO Cell
          </Button>
        </div>
      </form>
    </div>
  );
};
