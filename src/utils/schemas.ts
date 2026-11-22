import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'recruiter', 'tpo']),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Multi-step Registration Schemas
export const studentStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  rollNumber: z.string().min(4, 'Roll number is required (e.g. 21CS042)'),
  collegeEmail: z.string().email('Valid institutional email required').refine(
    (email) => email.includes('@') && (email.endsWith('.edu') || email.endsWith('.ac.in') || email.includes('student') || email.includes('college') || email.includes('campus')),
    { message: 'Preferably use your institutional email (.ac.in / .edu)' }
  ).or(z.string().email()),
  personalEmail: z.string().email('Valid personal email required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters with letters & numbers'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const studentStep2Schema = z.object({
  department: z.string().min(1, 'Please select your department'),
  batch: z.string().min(1, 'Please select your graduating batch'),
  cgpa: z.coerce.number().min(0, 'CGPA cannot be negative').max(10, 'Maximum CGPA is 10.0'),
  activeBacklogs: z.coerce.number().min(0, 'Cannot be negative').default(0),
  historyOfBacklogs: z.coerce.number().min(0, 'Cannot be negative').default(0),
  gapYears: z.coerce.number().min(0, 'Cannot be negative').default(0),
});

export const studentStep3Schema = z.object({
  skills: z.array(z.string()).min(2, 'Please add at least 2 key technical skills'),
  secondarySkills: z.array(z.string()).optional(),
  linkedInUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  resumeFileName: z.string().optional(),
});

export const postDriveSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  roleCategory: z.string().min(1, 'Please select a role category'),
  jobType: z.enum(['Full-Time', 'Internship', 'Internship + PPO']),
  location: z.string().min(2, 'Job location is required (e.g. Bengaluru / Remote)'),
  workMode: z.enum(['Remote', 'On-Site', 'Hybrid']),
  ctc: z.string().min(2, 'CTC or Stipend is required (e.g. 14 - 18 LPA)'),
  baseSalary: z.coerce.number().optional(),
  openings: z.coerce.number().min(1, 'At least 1 opening is required'),
  minCgpa: z.coerce.number().min(0).max(10, 'CGPA must be between 0 and 10'),
  eligibleBranches: z.array(z.string()).min(1, 'Select at least one eligible branch'),
  allowedBacklogs: z.coerce.number().min(0).default(0),
  maxGapYears: z.coerce.number().min(0).default(0),
  graduatingBatch: z.string().min(1, 'Select target graduating batch'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  driveDate: z.string().min(1, 'Drive commencement date is required'),
  description: z.string().min(20, 'Job description must be at least 20 characters'),
  requirements: z.string().min(10, 'Provide skill/technical requirements'),
  responsibilities: z.string().min(10, 'Provide day-to-day responsibilities'),
  tags: z.string().optional(),
});

export type PostDriveFormData = z.infer<typeof postDriveSchema>;

export const scheduleInterviewSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  meetingLink: z.string().url('Valid meeting link required (Google Meet / Teams / Zoom)'),
  instructions: z.string().optional(),
});

export type ScheduleInterviewFormData = z.infer<typeof scheduleInterviewSchema>;

export const extendOfferSchema = z.object({
  offeredCtc: z.string().min(1, 'Offered CTC is required (e.g. 16.5 LPA)'),
  joiningDate: z.string().min(1, 'Expected joining date is required'),
  offerLetterUrl: z.string().optional(),
  notes: z.string().optional(),
});

export type ExtendOfferFormData = z.infer<typeof extendOfferSchema>;
