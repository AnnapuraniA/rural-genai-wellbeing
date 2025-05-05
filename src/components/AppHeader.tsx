import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { LanguageSelector } from './LanguageSelector';

const AppHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  // Role-specific dashboard routes
  const getDashboardRoute = () => {
    if (!currentUser) return '/';
    
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
  };

  return (
    <header className="bg-wellnet-green text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-wellnet-yellow flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-wellnet-green">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <div className="font-bold text-xl">
            <span className="tamil-text">வெல்நெட்</span>
            <span className="ml-1">WellNet</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {currentUser && (
            <Link to={getDashboardRoute()}>
              <Button 
                variant="secondary" 
                className="bg-white text-wellnet-green hover:bg-white/90"
              >
                Dashboard
              </Button>
            </Link>
          )}
          
          <LanguageSelector />
          
          {currentUser && (
            <Button 
              variant="secondary" 
              onClick={handleLogout}
              className="bg-white text-wellnet-green hover:bg-white/90"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
