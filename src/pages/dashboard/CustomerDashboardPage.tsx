
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';

const CustomerDashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'customer') {
    return <Navigate to="/dashboard" />;
  }

  return <CustomerDashboard />;
};

export default CustomerDashboardPage;
