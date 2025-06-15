import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getCustomersByHealthSakhiId,
  getNearbyLabs,
  type HealthSakhi,
  type Customer,
  type Lab,
  type Coordinator
} from '@/lib/database';

interface HealthSakhiAnalyzerProps {
  healthSakhis: HealthSakhi[];
  coordinator: Coordinator;
}

const HealthSakhiAnalyzer: React.FC<HealthSakhiAnalyzerProps> = ({
  healthSakhis,
  coordinator
}) => {
  const { language } = useLanguage();
  const [selectedSakhi, setSelectedSakhi] = useState<HealthSakhi | null>(null);
  const [sakhiDetails, setSakhiDetails] = useState<{
    customers: Customer[];
    labs: Lab[];
  }>({ customers: [], labs: [] });

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    return healthSakhis.map(sakhi => {
      const customers = getCustomersByHealthSakhiId(sakhi.id);
      const labs = getNearbyLabs(sakhi.latitude, sakhi.longitude, 10);
      
      // Calculate coverage percentage (mock data)
      const coverage = Math.floor(Math.random() * 30) + 70; // Random between 70-100
      
      // Calculate customer satisfaction (mock data)
      const satisfaction = Math.floor(Math.random() * 20) + 80; // Random between 80-100
      
      // Calculate response time (mock data)
      const responseTime = Math.floor(Math.random() * 30) + 30; // Random between 30-60 minutes
      
      return {
        sakhi,
        metrics: {
          coverage,
          satisfaction,
          responseTime,
          customerCount: customers.length,
          labCount: labs.length
        }
      };
    });
  }, [healthSakhis]);

  useEffect(() => {
    if (selectedSakhi) {
      const customers = getCustomersByHealthSakhiId(selectedSakhi.id);
      const labs = getNearbyLabs(selectedSakhi.latitude, selectedSakhi.longitude, 10);
      setSakhiDetails({ customers, labs });
    }
  }, [selectedSakhi]);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Performance Overview' : 'செயல்திறன் கண்ணோட்டம்'}
          </CardTitle>
          <CardDescription>
            {language === 'english' 
              ? 'Key performance indicators for all Health Sakhis' 
              : 'அனைத்து ஆரோக்கிய சகிகளுக்கான முக்கிய செயல்திறன் குறிகாட்டிகள்'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'english' ? 'Average Coverage' : 'சராசரி ஆதரவு'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    performanceMetrics.reduce((sum, { metrics }) => sum + metrics.coverage, 0) / 
                    performanceMetrics.length
                  )}%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'english' ? 'Average Satisfaction' : 'சராசரி திருப்தி'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    performanceMetrics.reduce((sum, { metrics }) => sum + metrics.satisfaction, 0) / 
                    performanceMetrics.length
                  )}%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'english' ? 'Total Customers' : 'மொத்த வாடிக்கையாளர்கள்'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics.reduce((sum, { metrics }) => sum + metrics.customerCount, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'english' ? 'Name' : 'பெயர்'}</TableHead>
                <TableHead>{language === 'english' ? 'Village' : 'கிராமம்'}</TableHead>
                <TableHead>{language === 'english' ? 'Coverage' : 'ஆதரவு'}</TableHead>
                <TableHead>{language === 'english' ? 'Satisfaction' : 'திருப்தி'}</TableHead>
                <TableHead>{language === 'english' ? 'Response Time' : 'பதில் நேரம்'}</TableHead>
                <TableHead>{language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்'}</TableHead>
                <TableHead>{language === 'english' ? 'Linked Lab' : 'இணைக்கப்பட்ட ஆய்வகம்'}</TableHead>
                <TableHead>{language === 'english' ? 'Status' : 'நிலை'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceMetrics.map(({ sakhi, metrics }) => (
                <TableRow 
                  key={sakhi.id}
                  className={selectedSakhi?.id === sakhi.id ? 'bg-gray-100' : ''}
                  onClick={() => setSelectedSakhi(sakhi)}
                >
                  <TableCell>{sakhi.name}</TableCell>
                  <TableCell>{sakhi.village}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={metrics.coverage} className="h-2 w-20" />
                      <span>{metrics.coverage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={metrics.satisfaction} className="h-2 w-20" />
                      <span>{metrics.satisfaction}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{metrics.responseTime} min</TableCell>
                  <TableCell>{metrics.customerCount}</TableCell>
                  <TableCell>
                    {sakhi.linkedLab ? (
                      <Badge variant="outline">
                        {sakhi.linkedLab}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {language === 'english' ? 'Not Linked' : 'இணைக்கப்படவில்லை'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={metrics.coverage > 85 ? 'default' : 'destructive'}>
                      {metrics.coverage > 85 
                        ? (language === 'english' ? 'Good' : 'நல்லது')
                        : (language === 'english' ? 'Needs Attention' : 'கவனம் தேவை')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSakhi && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Customer Details' : 'வாடிக்கையாளர் விவரங்கள்'}
              </CardTitle>
              <CardDescription>
                {language === 'english' 
                  ? `Customers assigned to ${selectedSakhi.name}` 
                  : `${selectedSakhi.name}க்கு ஒதுக்கப்பட்ட வாடிக்கையாளர்கள்`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'english' ? 'Name' : 'பெயர்'}</TableHead>
                    <TableHead>{language === 'english' ? 'Village' : 'கிராமம்'}</TableHead>
                    <TableHead>{language === 'english' ? 'Age' : 'வயது'}</TableHead>
                    <TableHead>{language === 'english' ? 'Gender' : 'பாலினம்'}</TableHead>
                    <TableHead>{language === 'english' ? 'Contact' : 'தொடர்பு'}</TableHead>
                    <TableHead>{language === 'english' ? 'Last Visit' : 'கடைசி பார்வை'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sakhiDetails.customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.village}</TableCell>
                      <TableCell>{customer.age}</TableCell>
                      <TableCell>{customer.gender}</TableCell>
                      <TableCell>{customer.contactNumber}</TableCell>
                      <TableCell>
                        {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Nearby Labs' : 'அருகிலுள்ள ஆய்வகங்கள்'}
              </CardTitle>
              <CardDescription>
                {language === 'english' 
                  ? 'Labs within 10km radius' 
                  : '10 கி.மீ ஆரத்திற்குள் உள்ள ஆய்வகங்கள்'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'english' ? 'Name' : 'பெயர்'}</TableHead>
                    <TableHead>{language === 'english' ? 'Address' : 'முகவரி'}</TableHead>
                    <TableHead>{language === 'english' ? 'Services' : 'சேவைகள்'}</TableHead>
                    <TableHead>{language === 'english' ? 'Working Hours' : 'வேலை நேரம்'}</TableHead>
                    <TableHead>{language === 'english' ? 'Contact' : 'தொடர்பு'}</TableHead>
                    <TableHead>{language === 'english' ? 'Distance' : 'தூரம்'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sakhiDetails.labs.map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell>{lab.name}</TableCell>
                      <TableCell>{lab.address}</TableCell>
                      <TableCell>{lab.services.join(', ')}</TableCell>
                      <TableCell>{lab.workingHours}</TableCell>
                      <TableCell>{lab.contactNumber}</TableCell>
                      <TableCell>
                        {Math.round(Math.random() * 10)} km
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default HealthSakhiAnalyzer; 