import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  RecruiterProfile,
  TPOProfile,
  JobDrive,
  Application,
  TPOApprovalItem,
  ApplicationStatus,
} from '../types';
import {
  MOCK_USERS,
  MOCK_STUDENT_PROFILE,
  MOCK_RECRUITER_PROFILE,
  MOCK_TPO_PROFILE,
  MOCK_JOB_DRIVES,
  MOCK_APPLICATIONS,
  MOCK_TPO_APPROVALS,
} from '../data/mockData';
import { LocalDataStore } from '../config/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  studentProfile: StudentProfile | null;
  recruiterProfile: RecruiterProfile | null;
  tpoProfile: TPOProfile | null;
  jobDrives: JobDrive[];
  applications: Application[];
  approvals: TPOApprovalItem[];
  
  // Auth methods
  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  registerStudent: (profile: Partial<StudentProfile>) => Promise<boolean>;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  
  // Drive & Application actions
  applyToDrive: (driveId: string) => Promise<{ success: boolean; message: string }>;
  addJobDrive: (drive: Omit<JobDrive, 'id' | 'createdAt' | 'applicantsCount' | 'shortlistedCount' | 'offersCount'>) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string) => void;
  scheduleInterview: (appId: string, schedule: { date: string; time: string; meetingLink: string; instructions: string }) => void;
  extendOffer: (appId: string, offerDetails: { offeredCtc: string; joiningDate: string; offerLetterUrl?: string }) => void;
  
  // TPO actions
  handleApproval: (approvalId: string, decision: 'approved' | 'rejected', reason?: string) => void;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent role or default to 'student'
  const [role, setRole] = useState<UserRole>(() => {
    return LocalDataStore.get<UserRole>('active_role', 'student');
  });

  const [user, setUser] = useState<User | null>(() => {
    const activeRole = LocalDataStore.get<UserRole>('active_role', 'student');
    return MOCK_USERS[activeRole] || MOCK_USERS.student;
  });

  // Profiles
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    return LocalDataStore.get<StudentProfile>('student_profile', MOCK_STUDENT_PROFILE);
  });

  const [recruiterProfile, setRecruiterProfile] = useState<RecruiterProfile | null>(() => {
    return LocalDataStore.get<RecruiterProfile>('recruiter_profile', MOCK_RECRUITER_PROFILE);
  });

  const [tpoProfile, setTpoProfile] = useState<TPOProfile | null>(() => {
    return LocalDataStore.get<TPOProfile>('tpo_profile', MOCK_TPO_PROFILE);
  });

  // Global Interactive Collections
  const [jobDrives, setJobDrives] = useState<JobDrive[]>(() => {
    return LocalDataStore.get<JobDrive[]>('job_drives', MOCK_JOB_DRIVES);
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    return LocalDataStore.get<Application[]>('applications', MOCK_APPLICATIONS);
  });

  const [approvals, setApprovals] = useState<TPOApprovalItem[]>(() => {
    return LocalDataStore.get<TPOApprovalItem[]>('tpo_approvals', MOCK_TPO_APPROVALS);
  });

  // Keep LocalStorage synced whenever state changes
  useEffect(() => {
    LocalDataStore.set('active_role', role);
  }, [role]);

  useEffect(() => {
    if (studentProfile) LocalDataStore.set('student_profile', studentProfile);
  }, [studentProfile]);

  useEffect(() => {
    LocalDataStore.set('job_drives', jobDrives);
  }, [jobDrives]);

  useEffect(() => {
    LocalDataStore.set('applications', applications);
  }, [applications]);

  useEffect(() => {
    LocalDataStore.set('tpo_approvals', approvals);
  }, [approvals]);

  // Actions
  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setUser(MOCK_USERS[newRole]);
    LocalDataStore.set('active_role', newRole);
    toast.success(`Switched active view to ${newRole.toUpperCase()} Persona`);
  };

  const login = async (email: string, selectedRole: UserRole): Promise<boolean> => {
    const matchedUser = Object.values(MOCK_USERS).find(u => u.role === selectedRole) || {
      id: `usr_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };

    setUser(matchedUser);
    setRole(selectedRole);
    toast.success(`Welcome back, ${matchedUser.name}! Logged in as ${selectedRole.toUpperCase()}`);
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out of session');
  };

  const registerStudent = async (profileData: Partial<StudentProfile>): Promise<boolean> => {
    const newStudent: StudentProfile = {
      ...MOCK_STUDENT_PROFILE,
      ...profileData,
      id: `stu_${Date.now()}`,
      userId: `usr_${Date.now()}`,
      verifiedByTpo: false, // New students require TPO verification
      placementPassId: `HP-2025-${(profileData.department || 'GEN').substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Available',
    };

    setStudentProfile(newStudent);
    setUser({
      id: newStudent.userId,
      email: newStudent.collegeEmail,
      name: newStudent.fullName,
      role: 'student',
      createdAt: new Date().toISOString(),
    });
    setRole('student');

    // Create an approval item in TPO queue
    const approvalItem: TPOApprovalItem = {
      id: `appr_stu_${Date.now()}`,
      type: 'student_verification',
      title: `Student Registration Verification: ${newStudent.fullName}`,
      entityName: `${newStudent.fullName} (${newStudent.rollNumber})`,
      submittedBy: newStudent.fullName,
      submittedEmail: newStudent.collegeEmail,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      meta: {
        department: newStudent.department,
        cgpa: newStudent.cgpa,
        skills: newStudent.skills,
      },
    };

    setApprovals(prev => [approvalItem, ...prev]);
    toast.success('Registration successful! Profile submitted to TPO for verification.');
    return true;
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile(prev => (prev ? { ...prev, ...updates } : null));
    toast.success('Profile updated successfully');
  };

  const applyToDrive = async (driveId: string): Promise<{ success: boolean; message: string }> => {
    const drive = jobDrives.find(d => d.id === driveId);
    if (!drive) return { success: false, message: 'Drive not found' };

    // Check if already applied
    const alreadyApplied = applications.some(
      a => a.driveId === driveId && a.studentId === (studentProfile?.id || 'stu_prof_01')
    );
    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this drive.' };
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      driveId,
      studentId: studentProfile?.id || 'stu_prof_01',
      studentName: studentProfile?.fullName || 'Alex Chen',
      studentRollNo: studentProfile?.rollNumber || '21CS084',
      studentEmail: studentProfile?.collegeEmail || 'alex.chen@campus.edu',
      studentAvatar: user?.avatarUrl,
      department: studentProfile?.department || 'Computer Science & Engineering',
      cgpa: studentProfile?.cgpa || 8.85,
      companyName: drive.companyName,
      jobTitle: drive.title,
      resumeScore: Math.floor(82 + Math.random() * 15),
      resumeUrl: studentProfile?.resumeUrl || '#',
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Applied',
          date: new Date().toISOString(),
          message: 'Application registered. Awaiting initial recruiter screening.',
          updatedBy: 'System',
        },
      ],
    };

    setApplications(prev => [newApp, ...prev]);

    // Update drive applicant count
    setJobDrives(prev =>
      prev.map(d => (d.id === driveId ? { ...d, applicantsCount: d.applicantsCount + 1 } : d))
    );

    return { success: true, message: `Application submitted for ${drive.title} at ${drive.companyName}!` };
  };

  const addJobDrive = (
    driveData: Omit<JobDrive, 'id' | 'createdAt' | 'applicantsCount' | 'shortlistedCount' | 'offersCount'>
  ) => {
    const newDrive: JobDrive = {
      ...driveData,
      id: `drv_${Date.now()}`,
      createdAt: new Date().toISOString(),
      applicantsCount: 0,
      shortlistedCount: 0,
      offersCount: 0,
      status: 'Pending Approval', // Requires TPO approval
    };

    setJobDrives(prev => [newDrive, ...prev]);

    // Add to TPO Approvals
    const approvalItem: TPOApprovalItem = {
      id: `appr_drv_${Date.now()}`,
      type: 'job_drive',
      title: `Campus Drive Request: ${newDrive.companyName} (${newDrive.title})`,
      entityName: newDrive.companyName,
      submittedBy: recruiterProfile?.contactPerson || 'Campus Recruiter',
      submittedEmail: recruiterProfile?.contactEmail || 'recruiter@company.com',
      submittedAt: new Date().toISOString(),
      status: 'pending',
      meta: {
        ctc: newDrive.ctc,
        openings: newDrive.openings,
        minCgpa: newDrive.eligibility.minCgpa,
        driveId: newDrive.id,
      },
    };

    setApprovals(prev => [approvalItem, ...prev]);
    toast.success('Drive created! Submitted to TPO cell for compliance review.');
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus, notes?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;

        const timelineEvent = {
          status,
          date: new Date().toISOString(),
          message: notes || `Application moved to stage: ${status}`,
          updatedBy: user?.name || 'Recruiting Team',
        };

        return {
          ...app,
          status,
          updatedAt: new Date().toISOString(),
          notes: notes || app.notes,
          timeline: [timelineEvent, ...app.timeline],
        };
      })
    );
    toast.success(`Application updated to stage: ${status}`);
  };

  const scheduleInterview = (
    appId: string,
    schedule: { date: string; time: string; meetingLink: string; instructions: string }
  ) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;
        const nextStatus: ApplicationStatus = 'Technical Round';
        return {
          ...app,
          status: nextStatus,
          interviewSchedule: schedule,
          updatedAt: new Date().toISOString(),
          timeline: [
            {
              status: nextStatus,
              date: new Date().toISOString(),
              message: `Interview scheduled on ${schedule.date} at ${schedule.time}. Meet link dispatched.`,
              updatedBy: user?.name || 'Recruiter',
            },
            ...app.timeline,
          ],
        };
      })
    );
    toast.success('Interview successfully scheduled and student notified!');
  };

  const extendOffer = (
    appId: string,
    offerDetails: { offeredCtc: string; joiningDate: string; offerLetterUrl?: string }
  ) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status: 'Offer Extended',
          offerDetails,
          updatedAt: new Date().toISOString(),
          timeline: [
            {
              status: 'Offer Extended',
              date: new Date().toISOString(),
              message: `Official Offer Extended! Package: ${offerDetails.offeredCtc}, Joining: ${offerDetails.joiningDate}`,
              updatedBy: user?.name || 'Recruiting Lead',
            },
            ...app.timeline,
          ],
        };
      })
    );
    toast.success(`Offer extended of ${offerDetails.offeredCtc}!`);
  };

  const handleApproval = (approvalId: string, decision: 'approved' | 'rejected', reason?: string) => {
    const item = approvals.find(a => a.id === approvalId);
    if (!item) return;

    // Update approval status
    setApprovals(prev =>
      prev.map(a =>
        a.id === approvalId ? { ...a, status: decision, rejectionReason: reason } : a
      )
    );

    // If it was a job drive, update the drive status
    if (item.type === 'job_drive' && item.meta?.driveId) {
      setJobDrives(prev =>
        prev.map(d =>
          d.id === item.meta.driveId
            ? { ...d, status: decision === 'approved' ? 'Active' : 'Closed' }
            : d
        )
      );
    }

    // If student verification
    if (item.type === 'student_verification' && studentProfile) {
      if (decision === 'approved') {
        setStudentProfile(prev => (prev ? { ...prev, verifiedByTpo: true } : null));
      }
    }

    toast.success(`Request ${decision.toUpperCase()} by TPO office`);
  };

  const resetDemoData = () => {
    LocalDataStore.resetAll();
    setRole('student');
    setUser(MOCK_USERS.student);
    setStudentProfile(MOCK_STUDENT_PROFILE);
    setRecruiterProfile(MOCK_RECRUITER_PROFILE);
    setTpoProfile(MOCK_TPO_PROFILE);
    setJobDrives(MOCK_JOB_DRIVES);
    setApplications(MOCK_APPLICATIONS);
    setApprovals(MOCK_TPO_APPROVALS);
    toast.info('Reset demo dataset to initial high-fidelity state');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        studentProfile,
        recruiterProfile,
        tpoProfile,
        jobDrives,
        applications,
        approvals,
        login,
        logout,
        switchRole,
        registerStudent,
        updateStudentProfile,
        applyToDrive,
        addJobDrive,
        updateApplicationStatus,
        scheduleInterview,
        extendOffer,
        handleApproval,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
