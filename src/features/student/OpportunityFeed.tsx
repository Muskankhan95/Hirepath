import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { JobDrive } from '../../types';
import { checkEligibility } from '../../utils/eligibility';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/shared/EmptyState';
import {
  Search,
  Building,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const OpportunityFeed: React.FC = () => {
  const { jobDrives, studentProfile, applications, applyToDrive } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [activeDrive, setActiveDrive] = useState<JobDrive | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Check if student has applied to a drive
  const appliedDriveIds = useMemo(() => {
    return new Set(
      applications
        .filter((a) => a.studentId === (studentProfile?.id || 'stu_prof_01'))
        .map((a) => a.driveId)
    );
  }, [applications, studentProfile]);

  // Categories list
  const categories = ['All', 'Software Engineering', 'Cloud/DevOps', 'Data Science'];

  // Filtered drives
  const filteredDrives = useMemo(() => {
    return jobDrives.filter((drive) => {
      // Must be approved or active
      if (drive.status === 'Draft' || drive.status === 'Pending Approval') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          drive.title.toLowerCase().includes(q) ||
          drive.companyName.toLowerCase().includes(q) ||
          drive.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Category
      if (selectedCategory !== 'All' && drive.roleCategory !== selectedCategory) {
        return false;
      }

      // Work Mode
      if (selectedWorkMode !== 'All' && drive.workMode !== selectedWorkMode) {
        return false;
      }

      // Eligibility toggle
      if (onlyEligible) {
        const { isEligible } = checkEligibility(studentProfile, drive);
        if (!isEligible) return false;
      }

      return true;
    });
  }, [jobDrives, searchQuery, selectedCategory, selectedWorkMode, onlyEligible, studentProfile]);

  const handleApply = async (drive: JobDrive) => {
    const { isEligible, reasons } = checkEligibility(studentProfile, drive);
    if (!isEligible) {
      toast.error(`Ineligible to apply: ${reasons[0] || 'Criteria not met'}`);
      return;
    }

    setIsApplying(true);
    try {
      const res = await applyToDrive(drive.id);
      if (res.success) {
        toast.success(res.message);
        setActiveDrive(null);
      } else {
        toast.error(res.message);
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Campus Placement Opportunities
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse verified job drives approved by the Training & Placement Cell.
          </p>
        </div>

        {/* Eligibility Switch */}
        <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyEligible}
            onChange={(e) => setOnlyEligible(e.target.checked)}
            className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
          />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Show Only Eligible Drives
          </span>
          <span className="text-[10px] bg-brand-100 dark:bg-brand-950 text-brand-600 px-1.5 py-0.5 rounded-full font-bold">
            Smart Filter
          </span>
        </label>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by company, role title, or technology tag..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500/20"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">Mode: All</option>
            <option value="Remote">Mode: Remote</option>
            <option value="Hybrid">Mode: Hybrid</option>
            <option value="On-Site">Mode: On-Site</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredDrives.length === 0 ? (
        <EmptyState
          icon={<Building className="w-6 h-6" />}
          title="No Matching Placement Drives"
          description="Try adjusting your search criteria or resetting filters to see all available company opportunities."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedWorkMode('All');
            setOnlyEligible(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrives.map((drive) => {
            const { isEligible, reasons } = checkEligibility(studentProfile, drive);
            const isApplied = appliedDriveIds.has(drive.id);

            return (
              <motion.div
                key={drive.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                <Card
                  glass
                  className="flex flex-col justify-between w-full hover:shadow-lg transition-all border-slate-200/90 dark:border-slate-800"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-navy-800 p-2 flex items-center justify-center font-bold text-brand-600 text-sm border border-slate-200 dark:border-slate-700 shrink-0">
                          {drive.companyName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {drive.companyName}
                          </h4>
                          <CardTitle className="text-sm font-bold line-clamp-1">
                            {drive.title}
                          </CardTitle>
                        </div>
                      </div>

                      <Badge
                        variant={isEligible ? 'success' : 'warning'}
                        size="sm"
                        className="shrink-0"
                      >
                        {isEligible ? 'Eligible' : 'Check Criteria'}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                        {drive.ctc}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {drive.location}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {drive.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {drive.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {drive.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400">
                          +{drive.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {drive.openings} Openings
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Ends{' '}
                        {new Date(drive.registrationDeadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <div className="w-full flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => setActiveDrive(drive)}
                      >
                        View Details
                      </Button>

                      {isApplied ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="shrink-0 text-emerald-600 border-emerald-500/30"
                        >
                          Applied
                        </Button>
                      ) : (
                        <Button
                          variant={isEligible ? 'primary' : 'outline'}
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleApply(drive)}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Drive Details Modal */}
      {activeDrive && (
        <Modal
          isOpen={!!activeDrive}
          onClose={() => setActiveDrive(null)}
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-base">
                {activeDrive.companyName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold">{activeDrive.title}</h3>
                <p className="text-xs text-slate-500">
                  {activeDrive.companyName} • {activeDrive.location} ({activeDrive.workMode})
                </p>
              </div>
            </div>
          }
          size="lg"
        >
          <div className="space-y-6">
            {/* Quick stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Package / CTC</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  {activeDrive.ctc}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Job Type</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {activeDrive.jobType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Vacancies</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {activeDrive.openings} Positions
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Min CGPA Required</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {activeDrive.eligibility.minCgpa.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Eligibility Evaluation Box */}
            {(() => {
              const { isEligible, reasons, checks } = checkEligibility(studentProfile, activeDrive);
              return (
                <div
                  className={`p-4 rounded-2xl border ${
                    isEligible
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isEligible ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {isEligible ? 'You Are Fully Eligible for this Drive' : 'Eligibility Notice'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[10px] opacity-75">Your CGPA</span>
                      <p className="font-bold">
                        {checks.cgpa.studentVal} / {checks.cgpa.minVal}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75">Backlogs</span>
                      <p className="font-bold">
                        {checks.backlogs.studentBacklogs} (Max: {checks.backlogs.maxAllowed})
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75">TPO Verification</span>
                      <p className="font-bold">
                        {checks.verification.isVerified ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] opacity-75">Department</span>
                      <p className="font-bold truncate">{checks.branch.studentBranch}</p>
                    </div>
                  </div>

                  {!isEligible && (
                    <p className="mt-2 text-xs text-amber-700 dark:text-amber-300 font-medium border-t border-amber-200 dark:border-amber-800/60 pt-2">
                      Reason: {reasons.join('; ')}
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Description & Responsibilities */}
            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1.5">
                  About the Role
                </h4>
                <p className="leading-relaxed">{activeDrive.description}</p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1.5">
                  Key Responsibilities
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  {activeDrive.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1.5">
                  Candidate Requirements
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  {activeDrive.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Selection Rounds */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                  Selection Process Rounds ({activeDrive.rounds.length})
                </h4>
                <div className="space-y-2">
                  {activeDrive.rounds.map((round) => (
                    <div
                      key={round.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Round {round.roundNumber}: {round.name}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{round.description}</p>
                      </div>
                      <Badge variant="outline" size="sm">
                        {round.mode}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setActiveDrive(null)}>
                Close
              </Button>

              {appliedDriveIds.has(activeDrive.id) ? (
                <Button variant="outline" disabled size="sm" className="text-emerald-600">
                  Application Already Submitted
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  size="md"
                  isLoading={isApplying}
                  onClick={() => handleApply(activeDrive)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Submit Application with Verified Pass
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
