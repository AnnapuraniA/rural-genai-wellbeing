
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CoordinatorDashboard from '@/components/dashboard/CoordinatorDashboard';

const CoordinatorDashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'coordinator') {
    return <Navigate to="/dashboard" />;
  }

  return <CoordinatorDashboard />;
};

export default CoordinatorDashboardPage;
