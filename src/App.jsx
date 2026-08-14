// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Passenger Pages
import LandingPage from './pages/passenger/LandingPage';
import ReportPage from './pages/passenger/ReportPage';
import TrackPage from './pages/passenger/TrackPage';
import ComplaintDetailsPage from './pages/passenger/ComplaintDetailsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import IncidentsPage from './pages/admin/IncidentsPage';
import IncidentDetailsPage from './pages/admin/IncidentDetailsPage';
import ComplaintsPage from './pages/admin/ComplaintsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Passenger Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="track" element={<TrackPage />} />
          <Route path="complaint/:id" element={<ComplaintDetailsPage />} />
        </Route>

        {/* Railway Control Room / Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="incidents/:id" element={<IncidentDetailsPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
