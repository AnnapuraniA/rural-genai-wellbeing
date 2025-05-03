
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CoordinatorDashboard from '@/components/dashboard/CoordinatorDashboard';
import SakhiDashboard from '@/components/dashboard/SakhiDashboard';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
import LabDashboard from '@/components/dashboard/LabDashboard';

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Render dashboard based on user role
  switch (currentUser.role) {
    case 'coordinator':
      return <CoordinatorDashboard />;
    case 'health_sakhi':
      return <SakhiDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    case 'lab':
      return <LabDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Unknown user role or dashboard not found.</p>
        </div>
      );
  }
};

export default Dashboard;
