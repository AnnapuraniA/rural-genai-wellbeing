import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getCustomersByHealthSakhiId,
  getNearbyLabs,
  type HealthSakhi,
  type Customer,
  type Lab
} from '@/lib/database';

interface HealthSakhiAnalyzerProps {
  healthSakhis: HealthSakhi[];
  onSakhiSelect: (sakhi: HealthSakhi) => void;
  selectedSakhi: HealthSakhi | null;
}

const HealthSakhiAnalyzer: React.FC<HealthSakhiAnalyzerProps> = ({
  healthSakhis,
  onSakhiSelect,
  selectedSakhi
}) => {
  const { language } = useLanguage();
  const [sakhiDetails, setSakhiDetails] = useState<{
    customers: Customer[];
    labs: Lab[];
  }>({ customers: [], labs: [] });

  useEffect(() => {
    if (selectedSakhi) {
      const customers = getCustomersByHealthSakhiId(selectedSakhi.id);
      const labs = getNearbyLabs(selectedSakhi.latitude, selectedSakhi.longitude, 10);
      setSakhiDetails({ customers, labs });
    }
  }, [selectedSakhi]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Health Sakhi Overview' : 'ஆரோக்கிய சகி கண்ணோட்டம்'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'english' ? 'Name' : 'பெயர்'}</TableHead>
                <TableHead>{language === 'english' ? 'Village' : 'கிராமம்'}</TableHead>
                <TableHead>{language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்'}</TableHead>
                <TableHead>{language === 'english' ? 'Specializations' : 'சிறப்பு திறன்கள்'}</TableHead>
                <TableHead>{language === 'english' ? 'Contact' : 'தொடர்பு'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthSakhis.map((sakhi) => (
                <TableRow 
                  key={sakhi.id}
                  className={selectedSakhi?.id === sakhi.id ? 'bg-gray-100' : ''}
                  onClick={() => onSakhiSelect(sakhi)}
                >
                  <TableCell>{sakhi.name}</TableCell>
                  <TableCell>{sakhi.village}</TableCell>
                  <TableCell>{sakhi.linkedCustomers.length}</TableCell>
                  <TableCell>{sakhi.specializations.join(', ')}</TableCell>
                  <TableCell>{sakhi.contactNumber}</TableCell>
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