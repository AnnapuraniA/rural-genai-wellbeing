
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LabDashboard from '@/components/dashboard/LabDashboard';

const LabDashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'lab') {
    return <Navigate to="/dashboard" />;
  }

  return <LabDashboard />;
};

export default LabDashboardPage;
