import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  GraduationCap,
  Sparkles,
  Video,
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface CandidateReviewModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateReviewModal: React.FC<CandidateReviewModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const { updateApplicationStatus, scheduleInterview, extendOffer } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'offer'>('profile');
  const [feedback, setFeedback] = useState(application?.recruiterFeedback || '');

  // Schedule Interview form state
  const [interviewDate, setInterviewDate] = useState('2025-06-25');
  const [interviewTime, setInterviewTime] = useState('14:00 IST');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-recruiter-campus');
  const [instructions, setInstructions] = useState('Focus on scalable systems and data structures.');

  // Offer form state
  const [offeredCtc, setOfferedCtc] = useState('28.5 LPA');
  const [joiningDate, setJoiningDate] = useState('2025-07-20');

  if (!application) return null;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    updateApplicationStatus(application.id, newStatus, feedback);
    onClose();
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview(application.id, {
      date: interviewDate,
      time: interviewTime,
      meetingLink,
      instructions,
    });
    onClose();
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    extendOffer(application.id, {
      offeredCtc,
      joiningDate,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <img
            src={
              application.studentAvatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
            }
            alt={application.studentName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {application.studentName}
              </h3>
              <StatusBadge status={application.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              {application.studentRollNo} • {application.department} • CGPA: {application.cgpa}
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Candidate Profile & AI Score
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'schedule'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Schedule Interview
          </button>
          <button
            onClick={() => setActiveTab('offer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'offer'
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Extend Campus Offer
          </button>
        </div>

        {/* TAB 1: Profile & Score */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            {/* AI Resume Match Metric */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50/40 dark:from-navy-950 dark:to-indigo-950/20 border border-brand-200 dark:border-brand-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-sm">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Gemini AI ATS Match Score
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {application.resumeScore || 92}% Match for {application.jobTitle}
                  </h4>
                </div>
              </div>
              <Badge variant="success">High Fit</Badge>
            </div>

            {/* Candidate Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Verified CGPA</span>
                <span className="font-extrabold text-emerald-600 text-sm">{application.cgpa}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Department</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {application.department}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Current Stage</span>
                <span className="font-bold text-brand-600">{application.status}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block">Email</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                  {application.studentEmail}
                </span>
              </div>
            </div>

            {/* Recruiter Evaluation Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recruiter Notes & Feedback
              </label>
              <Textarea
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add evaluation comments (e.g. Excellent problem solving in dynamic programming, cleared system design round)"
              />
            </div>

            {/* Fast Stage Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleStatusChange('Rejected')}
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
              >
                Reject Candidate
              </Button>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('Shortlisted')}
                >
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('Assessment')}
                >
                  Move to Assessment
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('schedule')}
                  leftIcon={<Video className="w-3.5 h-3.5" />}
                >
                  Schedule Interview
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setActiveTab('offer')}
                  leftIcon={<Award className="w-3.5 h-3.5" />}
                >
                  Extend Offer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Schedule Interview */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Interview Date"
                type="date"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
              <Input
                label="Interview Time & Zone"
                type="text"
                required
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </div>

            <Input
              label="Video Conference Link"
              type="url"
              required
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
            />

            <Textarea
              label="Instructions / Focus Areas for Candidate"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab('profile')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Confirm & Dispatch Meeting Invite
              </Button>
            </div>
          </form>
        )}

        {/* TAB 3: Extend Offer */}
        {activeTab === 'offer' && (
          <form onSubmit={handleOfferSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>
                Extending an official offer moves candidate status to Selected and notifies the Central Placement Office.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Offered CTC / Total Package"
                required
                value={offeredCtc}
                onChange={(e) => setOfferedCtc(e.target.value)}
                placeholder="e.g. 28.5 LPA"
              />
              <Input
                label="Tentative Joining Date"
                type="date"
                required
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab('profile')}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" rightIcon={<Award className="w-4 h-4" />}>
                Officially Extend Campus Offer
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
