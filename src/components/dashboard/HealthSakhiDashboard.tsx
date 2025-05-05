import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getHealthSakhiById,
  getCustomersByHealthSakhiId,
  getNearbyLabs,
  type HealthSakhi,
  type Customer,
  type Lab
} from '@/lib/database';
import { 
  convertCustomersToMarkers,
  convertLabsToMarkers,
  MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import AppointmentChat from '@/components/AppointmentChat';
import PatientNotes from '@/components/PatientNotes';
import Inbox from '@/components/Inbox';
import ConcentricCircles from '@/components/map/ConcentricCircles';
import { ErrorBoundary } from 'react-error-boundary';

const HealthSakhiDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [healthSakhi, setHealthSakhi] = useState<HealthSakhi | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Custom legend items for health sakhi dashboard
  const legendItems = [
    { color: '#A1887F', label: language === 'english' ? 'Health Sakhi' : 'ஆரோக்கிய சகி' },
    { color: '#2196F3', label: language === 'english' ? 'Customer' : 'வாடிக்கையாளர்' },
    { color: '#FFCA28', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' }
  ];

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Get health sakhi data
        const healthSakhiData = getHealthSakhiById(currentUser.linkedId);
        setHealthSakhi(healthSakhiData);
        
        if (healthSakhiData) {
          // Get customers data
          const customersData = getCustomersByHealthSakhiId(healthSakhiData.id);
          setCustomers(customersData);
          
          // Create markers array with health sakhi marker
          const markersArray: MapMarker[] = [
            {
              id: healthSakhiData.id,
              type: 'healthSakhi',
              latitude: healthSakhiData.latitude,
              longitude: healthSakhiData.longitude,
              title: healthSakhiData.name,
              info: `Village: ${healthSakhiData.village}`
            }
          ];
          
          // Add customer markers
          const customerMarkers = convertCustomersToMarkers(customersData, {
            latitude: healthSakhiData.latitude,
            longitude: healthSakhiData.longitude
          });
          markersArray.push(...customerMarkers);
          
          setMarkers(markersArray);
        }
      } catch (error) {
        console.error('Error loading health sakhi data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleCustomerClick = async (customer: Customer) => {
    setSelectedCustomer(customer);
    
    if (!healthSakhi) return;
    
    // Get labs for the selected customer
    const labs = getNearbyLabs(customer.latitude, customer.longitude, 10);
    
    // Create markers array with health sakhi, all customers, and selected customer's nearby labs
    const markersArray: MapMarker[] = [
      // Add health sakhi marker
      {
        id: healthSakhi.id,
        type: 'healthSakhi',
        latitude: healthSakhi.latitude,
        longitude: healthSakhi.longitude,
        title: healthSakhi.name,
        info: `Village: ${healthSakhi.village}`
      }
    ];
    
    // Add all customer markers
    const customerMarkers = convertCustomersToMarkers(customers, {
      latitude: healthSakhi.latitude,
      longitude: healthSakhi.longitude
    });
    markersArray.push(...customerMarkers);
    
    // Add lab markers
    const labMarkers = convertLabsToMarkers(labs, {
      latitude: customer.latitude,
      longitude: customer.longitude
    });
    markersArray.push(...labMarkers);
    
    setMarkers(markersArray);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">
          {language === 'english' ? 'Loading dashboard...' : 'டாஷ்போர்டு ஏற்றப்படுகிறது...'}
        </p>
      </div>
    );
  }

  if (!healthSakhi) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium text-red-500">
          {language === 'english' ? 'Health Sakhi not found' : 'ஆரோக்கிய சகி கிடைக்கவில்லை'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Welcome' : 'வரவேற்கிறோம்'}, {healthSakhi.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Village' : 'கிராமம்'}: {healthSakhi.village}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்'}: {customers.length}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Specializations' : 'சிறப்பு திறன்கள்'}: {healthSakhi.specializations.join(', ')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">
            {language === 'english' ? 'Map' : 'வரைபடம்'}
          </TabsTrigger>
          <TabsTrigger value="appointments">
            {language === 'english' ? 'Appointments' : 'நேரம் பதிவு'}
          </TabsTrigger>
          <TabsTrigger value="patients">
            {language === 'english' ? 'Patients' : 'நோயாளிகள்'}
          </TabsTrigger>
          <TabsTrigger value="inbox">
            {language === 'english' ? 'Inbox' : 'உள்வரும்'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Customer Locations' : 'வாடிக்கையாளர் இருப்பிடங்கள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
                <MapView 
                  markers={markers} 
                  center={{ latitude: healthSakhi.latitude, longitude: healthSakhi.longitude }}
                  height="500px"
                  showLegend={true}
                  legendItems={legendItems}
                  onMarkerClick={(marker) => {
                    if (marker.type === 'customer') {
                      const customer = customers.find(c => c.id === marker.id);
                      if (customer) handleCustomerClick(customer);
                    }
                  }}
                  selectedMarkerId={selectedCustomer?.id}
                >
                  {selectedCustomer && (
                    <ConcentricCircles
                      center={{ latitude: selectedCustomer.latitude, longitude: selectedCustomer.longitude }}
                      distances={[2, 5, 10]}
                      colors={['#4CAF50', '#FF9800', '#F44336']}
                      opacity={0.2}
                    />
                  )}
                </MapView>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Schedule Appointments' : 'நேரம் பதிவு செய்ய'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentChat 
                healthSakhi={healthSakhi}
                customers={customers}
                language={language}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Patient Records' : 'நோயாளி பதிவுகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PatientNotes 
                healthSakhi={healthSakhi}
                customers={customers}
                language={language}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Messages' : 'செய்திகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Inbox 
                healthSakhi={healthSakhi}
                language={language}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthSakhiDashboard; 