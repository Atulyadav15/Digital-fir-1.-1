import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FileFIR from './pages/FileFIR';
import TrackFIR from './pages/TrackFIR';
import Dashboard from './pages/Dashboard';
import MyFIRs from './pages/MyFIRs';
import FIRDetails from './pages/FIRDetails';
import AdminDashboard from './pages/AdminDashboard';
import FIRManagement from './pages/FIRManagement';
import FIRReview from './pages/FIRReview';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track-fir" element={<TrackFIR />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/file-fir" element={<ProtectedRoute><FileFIR /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-firs" element={<ProtectedRoute><MyFIRs /></ProtectedRoute>} />
          <Route path="/fir/:id" element={<ProtectedRoute><FIRDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/firs" element={<AdminRoute><FIRManagement /></AdminRoute>} />
          <Route path="/admin/fir/:id/review" element={<AdminRoute><FIRReview /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
