import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { OfflineProvider } from './contexts/OfflineContext';
import './services/i18n'; // Initialize i18n

// Layouts would go here (e.g., MainLayout, DashboardLayout)

// Lazy loaded pages
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const SymptomChecker = lazy(() => import('./pages/SymptomCheckerPage'));

const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const MaternalHealthPage = lazy(() => import('./pages/MaternalHealthPage'));
const HealthEducationHub = lazy(() => import('./pages/HealthEducationHub'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <OfflineProvider>
          <BrowserRouter>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-[#1A6FA3] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#1A6FA3] font-bold">Sehatsetu</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/maternal" element={<MaternalHealthPage />} />
                <Route path="/education" element={<HealthEducationHub />} />
                <Route path="/symptom-checker" element={<SymptomChecker />} />
                
                {/* Functional placeholders for BottomNav items */}
                <Route path="/consultation" element={<ComingSoonPage title="Tele-Consultation" />} />
                <Route path="/records" element={<ComingSoonPage title="Medical Records" />} />
                <Route path="/family" element={<ComingSoonPage title="Family Profiles" />} />
                <Route path="/settings" element={<ComingSoonPage title="Settings & Profile" />} />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </OfflineProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
