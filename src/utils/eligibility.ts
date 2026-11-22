import { StudentProfile, JobDrive } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  checks: {
    cgpa: { pass: boolean; studentVal: number; minVal: number };
    branch: { pass: boolean; studentBranch: string; allowedBranches: string[] };
    backlogs: { pass: boolean; studentBacklogs: number; maxAllowed: number };
    gapYears: { pass: boolean; studentGapYears: number; maxAllowed: number };
    verification: { pass: boolean; isVerified: boolean };
  };
}

export function checkEligibility(
  student: StudentProfile | null | undefined,
  drive: JobDrive
): EligibilityResult {
  if (!student) {
    return {
      isEligible: false,
      reasons: ['Student profile not loaded'],
      checks: {
        cgpa: { pass: false, studentVal: 0, minVal: drive.eligibility.minCgpa },
        branch: { pass: false, studentBranch: 'Unknown', allowedBranches: drive.eligibility.eligibleBranches },
        backlogs: { pass: false, studentBacklogs: 0, maxAllowed: drive.eligibility.allowedBacklogs },
        gapYears: { pass: false, studentGapYears: 0, maxAllowed: drive.eligibility.maxGapYears },
        verification: { pass: false, isVerified: false },
      },
    };
  }

  const reasons: string[] = [];

  // 1. CGPA check
  const cgpaPass = student.cgpa >= drive.eligibility.minCgpa;
  if (!cgpaPass) {
    reasons.push(`CGPA is ${student.cgpa.toFixed(2)}, which is below required ${drive.eligibility.minCgpa.toFixed(2)}`);
  }

  // 2. Branch check
  const allowedBranches = drive.eligibility.eligibleBranches;
  const branchPass =
    allowedBranches.includes('All Branches') ||
    allowedBranches.some(
      (b) => b.toLowerCase().trim() === student.department.toLowerCase().trim()
    );
  if (!branchPass) {
    reasons.push(
      `Your department (${student.department}) is not in the eligible list (${allowedBranches.join(', ')})`
    );
  }

  // 3. Backlog check
  const backlogsPass = student.activeBacklogs <= drive.eligibility.allowedBacklogs;
  if (!backlogsPass) {
    reasons.push(
      `You have ${student.activeBacklogs} active backlog(s), maximum permitted is ${drive.eligibility.allowedBacklogs}`
    );
  }

  // 4. Gap year check
  const gapYearsPass = student.gapYears <= drive.eligibility.maxGapYears;
  if (!gapYearsPass) {
    reasons.push(
      `Educational gap is ${student.gapYears} year(s), maximum allowed is ${drive.eligibility.maxGapYears}`
    );
  }

  // 5. Verification check
  const verificationPass = student.verifiedByTpo;
  if (!verificationPass) {
    reasons.push('Student academic profile is pending verification by the TPO Office');
  }

  const isEligible = cgpaPass && branchPass && backlogsPass && gapYearsPass && verificationPass;

  return {
    isEligible,
    reasons,
    checks: {
      cgpa: { pass: cgpaPass, studentVal: student.cgpa, minVal: drive.eligibility.minCgpa },
      branch: { pass: branchPass, studentBranch: student.department, allowedBranches },
      backlogs: { pass: backlogsPass, studentBacklogs: student.activeBacklogs, maxAllowed: drive.eligibility.allowedBacklogs },
      gapYears: { pass: gapYearsPass, studentGapYears: student.gapYears, maxAllowed: drive.eligibility.maxGapYears },
      verification: { pass: verificationPass, isVerified: student.verifiedByTpo },
    },
  };
}
