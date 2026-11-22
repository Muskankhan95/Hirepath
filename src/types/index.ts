export type UserRole = 'student' | 'recruiter' | 'tpo';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  rollNumber: string;
  collegeEmail: string;
  personalEmail: string;
  phone: string;
  department: string;
  batch: string; // e.g. "2021 - 2025"
  cgpa: number;
  activeBacklogs: number;
  historyOfBacklogs: number;
  gapYears: number;
  skills: string[];
  secondarySkills: string[];
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeParsedText?: string;
  verifiedByTpo: boolean;
  placementPassId: string; // QR code ID
  status: 'Available' | 'Placed' | 'Blocked';
  placedCompany?: string;
  placedPackage?: number; // in LPA
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite: string;
  companyLogo?: string;
  industry: string;
  headquarters: string;
  description: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  isVerified: boolean; // TPO approved
  drivesCount: number;
  activeHires: number;
}

export interface TPOProfile {
  id: string;
  userId: string;
  officerName: string;
  designation: string;
  institutionName: string;
  officialEmail: string;
  phone: string;
  department: string;
}

export interface DriveEligibility {
  minCgpa: number;
  eligibleBranches: string[];
  allowedBacklogs: number;
  maxGapYears: number;
  graduatingBatch: string;
}

export interface DriveRound {
  id: string;
  roundNumber: number;
  name: string; // e.g., "Online Aptitude & Coding", "Technical Interview I", "Executive HR"
  description: string;
  date?: string;
  mode: 'Online' | 'On-Campus' | 'Hybrid';
}

export interface JobDrive {
  id: string;
  recruiterId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  roleCategory: string; // Software Engineering, Data Science, Product, Cloud/DevOps, Core
  jobType: 'Full-Time' | 'Internship' | 'Internship + PPO';
  location: string;
  workMode: 'Remote' | 'On-Site' | 'Hybrid';
  ctc: string; // e.g. "14 - 18 LPA" or "₹45,000 / month"
  stipend?: string;
  baseSalary?: number; // e.g. 16.5 (for sorting/filtering)
  openings: number;
  eligibility: DriveEligibility;
  rounds: DriveRound[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  tags: string[];
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Active' | 'Completed' | 'Closed';
  registrationDeadline: string;
  driveDate: string;
  createdAt: string;
  applicantsCount: number;
  shortlistedCount: number;
  offersCount: number;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Assessment'
  | 'Technical Round'
  | 'HR Round'
  | 'Offer Extended'
  | 'Accepted'
  | 'Rejected';

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  date: string;
  message: string;
  updatedBy: string;
}

export interface Application {
  id: string;
  driveId: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentEmail: string;
  studentAvatar?: string;
  department: string;
  cgpa: number;
  companyName: string;
  jobTitle: string;
  resumeScore?: number;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  recruiterFeedback?: string;
  interviewSchedule?: {
    date: string;
    time: string;
    meetingLink: string;
    instructions: string;
  };
  offerDetails?: {
    offeredCtc: string;
    joiningDate: string;
    offerLetterUrl?: string;
  };
  timeline: ApplicationTimelineEvent[];
}

export interface AIAnalysisResult {
  matchScore: number; // 0 - 100
  atsScore: number; // 0 - 100
  verdict: 'High Match' | 'Moderate Match' | 'Needs Improvement';
  summary: string;
  strengths: string[];
  skillGaps: string[];
  missingKeywords: string[];
  recommendations: string[];
  suggestedRoles: string[];
  extractedSkills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
}

export interface TPOApprovalItem {
  id: string;
  type: 'recruiter' | 'job_drive' | 'student_verification';
  title: string;
  entityName: string;
  submittedBy: string;
  submittedEmail: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  meta: Record<string, any>;
}

export interface PlacementStatSummary {
  totalStudents: number;
  registeredStudents: number;
  placedStudents: number;
  placementPercentage: number;
  totalCompanies: number;
  activeDrives: number;
  highestPackage: number; // LPA
  averagePackage: number; // LPA
  medianPackage: number; // LPA
  totalOffers: number;
  internshipOffers: number;
}
