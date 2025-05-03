
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const LabDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">
          {language === 'english' ? 'Loading dashboard...' : 'டாஷ்போர்டு ஏற்றப்படுகிறது...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {language === 'english' ? 'Lab Dashboard' : 'ஆய்வக டாஷ்போர்டு'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'english' ? 'Test Requests' : 'சோதனை கோரிக்கைகள்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">
              {language === 'english' ? 'Pending requests' : 'நிலுவையிலுள்ள கோரிக்கைகள்'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'english' ? 'Today\'s Tests' : 'இன்றைய சோதனைகள்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">
              {language === 'english' ? 'Scheduled for today' : 'இன்று திட்டமிடப்பட்டுள்ளது'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'english' ? 'Pending Results' : 'நிலுவையிலுள்ள முடிவுகள்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">
              {language === 'english' ? 'Results to be delivered' : 'வழங்கப்பட வேண்டிய முடிவுகள்'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Recent Test Requests' : 'சமீபத்திய சோதனை கோரிக்கைகள்'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-muted-foreground">
            {language === 'english' 
              ? 'Lab dashboard functionalities coming soon!'
              : 'ஆய்வக டாஷ்போர்டு செயல்பாடுகள் விரைவில் வரும்!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabDashboard;
