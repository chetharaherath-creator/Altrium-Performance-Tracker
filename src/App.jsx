import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';

// Pages
import Home from './pages/Home';
import HRReports from './pages/HRReports';
import ReviewRecords from './pages/ReviewRecords';
import EvidenceSubmissions from './pages/EvidenceSubmissions';
import MyDevelopment from './pages/MyDevelopment';
import AssignReview from './pages/AssignReview';
import MyTasks from './pages/MyTasks';
import ReviewForm from './pages/ReviewForm';
import PastRecords from './pages/PastRecords';
import Profile from './pages/Profile';
import CompanyArchive from './pages/CompanyArchive';

export default function App() {
  const { currentUser } = useAuth();

  // If no user is logged in, show login page
  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* All roles land on Home */}
        <Route index element={<Home />} />
        
        {/* HR Manager Routes */}
        {currentUser.role === 'hr_manager' && (
          <>
            <Route path="hr-reports" element={<HRReports />} />
            <Route path="company-archive" element={<CompanyArchive />} />
            <Route path="profile" element={<Profile />} />
          </>
        )}
        
        {/* Manager Routes (Team & Department) */}
        {(currentUser.role === 'team_manager' || currentUser.role === 'department_manager') && (
          <>
            <Route path="assign-tasks" element={<AssignReview />} />
            <Route path="review-table" element={<ReviewRecords />} />
            <Route path="pip-pdp-table" element={<EvidenceSubmissions />} />
            <Route path="past-records" element={<PastRecords />} />
            <Route path="profile" element={<Profile />} />
          </>
        )}

        {/* Team Manager Specific Routes (acting as reviewer) */}
        {currentUser.role === 'team_manager' && (
          <>
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="my-development" element={<MyDevelopment />} />
            <Route path="review-form/:id" element={<ReviewForm />} />
          </>
        )}
        
        {/* Employee Routes */}
        {currentUser.role === 'employee' && (
          <>
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="my-development" element={<MyDevelopment />} />
            <Route path="review-form/:id" element={<ReviewForm />} />
            <Route path="past-records" element={<PastRecords />} />
            <Route path="profile" element={<Profile />} />
          </>
        )}
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

