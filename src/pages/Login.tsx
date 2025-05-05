import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { currentUser, isLoading } = useAuth();

  if (!isLoading && currentUser) {
    const dashboardRoute = (() => {
      switch (currentUser.role) {
        case 'coordinator':
          return '/dashboard/coordinator';
        case 'health_sakhi':
          return '/dashboard/sakhi';
        case 'customer':
          return '/dashboard/customer';
        case 'lab':
          return '/dashboard/lab';
        default:
          return '/dashboard';
      }
    })();
    
    return <Navigate to={dashboardRoute} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-wellnet-yellow flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold flex justify-center items-center gap-2">
              <span className="tamil-text">வெல்நெட்</span>
              <span>WellNet</span>
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to access your health dashboard</p>
          </div>
          
          <div className="bg-card border rounded-lg shadow-sm p-6">
            <LoginForm />
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Login Credentials</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><span className="font-medium">Coordinator:</span> coordinator / password123</p>
              <p><span className="font-medium">Health Sakhi:</span> sakhi / password123</p>
              <p><span className="font-medium">Customer:</span> customer / password123</p>
              <p><span className="font-medium">Lab:</span> lab / password123</p>
            </div>
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Login;
