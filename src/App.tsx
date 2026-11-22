import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardShell } from './components/layout/DashboardShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { Toaster } from 'sonner';

// Auth Features
import { Login } from './features/auth/Login';
import { StudentRegister } from './features/auth/StudentRegister';
import { ForgotPassword } from './features/auth/ForgotPassword';
import { ResetPassword } from './features/auth/ResetPassword';

// Student Features
import { StudentDashboard } from './features/student/StudentDashboard';
import { OpportunityFeed } from './features/student/OpportunityFeed';
import { ApplicationTracker } from './features/student/ApplicationTracker';
import { AIResumeAnalyzer } from './features/student/AIResumeAnalyzer';
import { StudentProfile } from './features/student/StudentProfile';

// Recruiter Features
import { RecruiterDashboard } from './features/recruiter/RecruiterDashboard';
import { PostDriveForm } from './features/recruiter/PostDriveForm';
import { ApplicantPipeline } from './features/recruiter/ApplicantPipeline';

// TPO Features
import { TPODashboard } from './features/tpo/TPODashboard';
import { ApprovalQueue } from './features/tpo/ApprovalQueue';
import { DriveAnalytics } from './features/tpo/DriveAnalytics';
import { PlacementReports } from './features/tpo/PlacementReports';

// Root redirect based on role
const RootRedirect: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={`/${role}`} replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
            <Routes>
              {/* Public & Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<StudentRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Student Portal */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route
                  path="/student"
                  element={
                    <DashboardShell>
                      <StudentDashboard />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/student/opportunities"
                  element={
                    <DashboardShell>
                      <OpportunityFeed />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/student/applications"
                  element={
                    <DashboardShell>
                      <ApplicationTracker />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/student/resume-ai"
                  element={
                    <DashboardShell>
                      <AIResumeAnalyzer />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <DashboardShell>
                      <StudentProfile />
                    </DashboardShell>
                  }
                />
              </Route>

              {/* Protected Recruiter Portal */}
              <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                <Route
                  path="/recruiter"
                  element={
                    <DashboardShell>
                      <RecruiterDashboard />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/recruiter/post-drive"
                  element={
                    <DashboardShell>
                      <PostDriveForm />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/recruiter/pipeline"
                  element={
                    <DashboardShell>
                      <ApplicantPipeline />
                    </DashboardShell>
                  }
                />
              </Route>

              {/* Protected TPO Portal */}
              <Route element={<ProtectedRoute allowedRoles={['tpo']} />}>
                <Route
                  path="/tpo"
                  element={
                    <DashboardShell>
                      <TPODashboard />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/tpo/approvals"
                  element={
                    <DashboardShell>
                      <ApprovalQueue />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/tpo/analytics"
                  element={
                    <DashboardShell>
                      <DriveAnalytics />
                    </DashboardShell>
                  }
                />
                <Route
                  path="/tpo/reports"
                  element={
                    <DashboardShell>
                      <PlacementReports />
                    </DashboardShell>
                  }
                />
              </Route>

              {/* Default fallback */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
