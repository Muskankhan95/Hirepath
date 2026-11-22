import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StudentProfile } from '../../types';
import { ShieldCheck, Download, Award, School } from 'lucide-react';
import { toast } from 'sonner';

interface QRVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
}

export const QRVerifyModal: React.FC<QRVerifyModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  const verificationPayload = JSON.stringify({
    passId: student.placementPassId,
    name: student.fullName,
    roll: student.rollNumber,
    dept: student.department,
    cgpa: student.cgpa,
    verified: student.verifiedByTpo,
    issued: '2024-2025',
  });

  const handleDownloadPass = () => {
    toast.success('Digital Placement Pass downloaded for on-campus verification');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Official Digital Placement Pass</span>
        </div>
      }
      description="Scan QR at on-campus recruiting halls and written assessment counters"
      size="md"
    >
      <div className="flex flex-col items-center">
        {/* Placement Pass Card Visual */}
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-navy-900 via-navy-850 to-slate-900 text-white p-6 shadow-2xl border border-indigo-500/30 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Institution Header */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight text-white uppercase">
                  Apex Institute of Technology
                </h4>
                <p className="text-[11px] text-slate-400">
                  Career Services & Placement Cell • Batch 2025
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>

          {/* Student Info and QR Code side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Left 2 Cols: Details */}
            <div className="sm:col-span-2 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Candidate Name
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {student.fullName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Roll No</span>
                  <p className="font-mono font-semibold text-slate-200">{student.rollNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Current CGPA</span>
                  <p className="font-bold text-emerald-400">{student.cgpa.toFixed(2)} / 10.0</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase">Department</span>
                  <p className="font-medium text-slate-200">{student.department}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="text-[11px] text-slate-300">
                  Eligible for Tier-1 Dream & Super-Dream Drives
                </span>
              </div>
            </div>

            {/* Right Col: High-Res QR Code */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-inner">
              <QRCodeSVG
                value={verificationPayload}
                size={120}
                level="H"
                includeMargin={false}
              />
              <span className="mt-1.5 font-mono text-[9px] text-slate-800 font-bold uppercase tracking-wider">
                {student.placementPassId.substring(0, 16)}
              </span>
            </div>
          </div>

          {/* Pass Footer */}
          <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span>Pass ID: <code className="font-mono text-indigo-300">{student.placementPassId}</code></span>
            <span>Signed by TPO Cell</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={handleDownloadPass}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Digital Badge
          </Button>
        </div>
      </div>
    </Modal>
  );
};
