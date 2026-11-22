import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { QRVerifyModal } from '../../components/shared/QRVerifyModal';
import {
  User,
  ShieldCheck,
  QrCode,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Plus,
  X,
  FileText,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

export const StudentProfile: React.FC = () => {
  const { studentProfile, updateStudentProfile } = useAuth();
  const [showQR, setShowQR] = useState(false);

  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(studentProfile?.skills || []);
  const [phone, setPhone] = useState(studentProfile?.phone || '');
  const [linkedIn, setLinkedIn] = useState(studentProfile?.linkedInUrl || '');
  const [github, setGithub] = useState(studentProfile?.githubUrl || '');
  const [portfolio, setPortfolio] = useState(studentProfile?.portfolioUrl || '');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    updateStudentProfile({
      skills,
      phone,
      linkedInUrl: linkedIn,
      githubUrl: github,
      portfolioUrl: portfolio,
    });
  };

  if (!studentProfile) return null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
              alt={studentProfile.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {studentProfile.fullName}
                </h1>
                {studentProfile.verifiedByTpo && (
                  <Badge variant="success" size="sm" className="gap-1">
                    <ShieldCheck className="w-3 h-3" /> TPO Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {studentProfile.rollNumber} • {studentProfile.department}
              </p>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                Graduating Batch {studentProfile.batch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setShowQR(true)}
              leftIcon={<QrCode className="w-4 h-4" />}
            >
              Reveal Placement Pass
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Academics & Documents) */}
        <div className="space-y-6">
          {/* Verified Academic Standing */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                Verified Academic Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Cumulative CGPA</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {studentProfile.cgpa.toFixed(2)} / 10.0
                  </span>
                </div>
                <Badge variant="success">Tier-1 Qualified</Badge>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Active Backlogs:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {studentProfile.activeBacklogs}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">History of Backlogs:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {studentProfile.historyOfBacklogs}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Education Gaps:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {studentProfile.gapYears} Year(s)
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Placement Pass Hash:</span>
                  <span className="font-mono text-[10px] text-indigo-400">
                    {studentProfile.placementPassId}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Document Box */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-500" />
                Active Placement Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {studentProfile.resumeFileName}
                    </p>
                    <p className="text-[10px] text-slate-400">Verified by TPO Cell</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success('Downloaded verified resume')}
                >
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 2 Columns: Contact, Links, and Skills Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Personal & Contact Coordinates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Campus College Email (Read-only)"
                  value={studentProfile.collegeEmail}
                  disabled
                  leftIcon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="Personal Email (Read-only)"
                  value={studentProfile.personalEmail}
                  disabled
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Personal Portfolio URL"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="LinkedIn URL"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  leftIcon={<Linkedin className="w-4 h-4" />}
                />
                <Input
                  label="GitHub URL"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  leftIcon={<Github className="w-4 h-4" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Interactive Skills Tagger */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Technical Skills & Competencies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a skill (e.g. Next.js, Kubernetes, Golang) and click Add"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  variant="primary"
                  onClick={handleAddSkill}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="brand" className="gap-2 py-1 px-3">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <QRVerifyModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        student={studentProfile}
      />
    </div>
  );
};
