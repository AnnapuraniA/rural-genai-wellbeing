import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getHealthSakhiById, 
  getCustomersByHealthSakhiId,
  getNearbyLabs,
  calculateDistanceInKm
} from '@/lib/database';
import { 
  convertCustomersToMarkers,
  convertLabsToMarkers,
  MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import AIChat from '@/components/AIChat';
import NoteSummarizer from '@/components/NoteSummarizer';
import EducationalVideos from '@/components/EducationalVideos';
import ConcentricCircles from '@/components/map/ConcentricCircles';
import DistanceLine from '@/components/map/DistanceLine';
import type { HealthSakhi, Customer, Lab } from '@/lib/database';
import { ErrorBoundary } from 'react-error-boundary';

type Language = 'english' | 'tamil';

const SakhiDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [healthSakhi, setHealthSakhi] = useState<HealthSakhi | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize legend items
  const legendItems = useMemo(() => [
    { color: '#A1887F', label: language === 'english' ? 'Health Sakhi' : 'சுகாதார சகி' },
    { color: '#2196F3', label: language === 'english' ? 'Customer' : 'வாடிக்கையாளர்' },
    { color: '#FFCA28', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' }
  ], [language]);

  // Memoize filtered customers
  const filteredCustomers = useMemo(() => 
    customers.filter(customer => customer.linkedHealthSakhi === healthSakhi?.id),
    [customers, healthSakhi]
  );

  // Memoize average distance calculation
  const averageDistance = useMemo(() => {
    if (!healthSakhi || filteredCustomers.length === 0) return 0;
    
    const totalDistance = filteredCustomers.reduce((sum, customer) => 
      sum + calculateDistanceInKm(
        healthSakhi.latitude,
        healthSakhi.longitude,
        customer.latitude,
        customer.longitude
      ),
      0
    );
    
    return totalDistance / filteredCustomers.length;
  }, [healthSakhi, filteredCustomers]);

  // Memoize marker click handler
  const handleMarkerClick = useCallback((marker: MapMarker) => {
    if (marker.type === 'customer') {
      const customer = customers.find(c => c.id === marker.id);
      if (customer) {
        setSelectedCustomer(customer);
      }
    } else if (marker.type === 'lab') {
      const lab = labs.find(l => l.id === marker.id);
      if (lab) {
        setSelectedLab(lab);
      }
    }
  }, [customers, labs]);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Get health sakhi data
        const sakhiData = getHealthSakhiById(currentUser.linkedId);
        setHealthSakhi(sakhiData);
        
        if (sakhiData) {
          // Get customers data
          const customersData = getCustomersByHealthSakhiId(sakhiData.id);
          setCustomers(customersData);
          
          // Get labs data
          const labsData = getNearbyLabs(sakhiData.latitude, sakhiData.longitude, 10);
          setLabs(labsData);
          
          // Create markers array
          const markersArray: MapMarker[] = [];

          // Add health sakhi marker
          markersArray.push({
            id: sakhiData.id,
            type: 'healthSakhi',
            latitude: sakhiData.latitude,
            longitude: sakhiData.longitude,
            title: sakhiData.name,
            info: `Village: ${sakhiData.village}`
          });

          // Add customer markers
          const customerMarkers = convertCustomersToMarkers(
            customersData,
            { latitude: sakhiData.latitude, longitude: sakhiData.longitude }
          );
          markersArray.push(...customerMarkers);

          // Add lab markers
          const labMarkers = convertLabsToMarkers(
            labsData,
            { latitude: sakhiData.latitude, longitude: sakhiData.longitude }
          );
          markersArray.push(...labMarkers);

          setMarkers(markersArray);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (!healthSakhi) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">Health Sakhi data not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('sakhi.name')}: {healthSakhi.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('sakhi.customers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredCustomers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredCustomers.length} {t('sakhi.active')} {t('sakhi.customers')} {t('sakhi.inYourArea')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('sakhi.village')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthSakhi.village}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('sakhi.primaryServiceArea')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('sakhi.nearbyLabs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{labs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {labs.filter(lab => lab.services.includes('Blood Tests')).length} {t('sakhi.offerBloodTests')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="map">
        <TabsList className="w-full bg-card border-b rounded-none justify-start h-auto p-0">
          <TabsTrigger 
            value="map" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('sakhi.mapView')}
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('sakhi.customerList')}
          </TabsTrigger>
          <TabsTrigger 
            value="ai-tools" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('sakhi.aiTools')}
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('sakhi.educationalVideos')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Customer and Lab Locations' : 'வாடிக்கையாளர் மற்றும் ஆய்வக இருப்பிடங்கள்'}
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                {language === 'english' 
                  ? 'Click on a customer and then a lab to see the distance between them'
                  : 'ஒரு வாடிக்கையாளர் மற்றும் ஆய்வகத்தைக் கிளிக் செய்து அவற்றுக்கிடையேயான தூரத்தைப் பார்க்கவும்'}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
              <MapView 
                  center={{ latitude: healthSakhi.latitude, longitude: healthSakhi.longitude }}
                  markers={markers}
                  onMarkerClick={handleMarkerClick}
                >
                  <ConcentricCircles
                center={{ latitude: healthSakhi.latitude, longitude: healthSakhi.longitude }}
                    distances={[2, 5, 10]}
                    colors={['#A1887F', '#A1887F', '#A1887F']}
                    opacity={0.2}
                  />
                  {selectedCustomer && selectedLab && (
                    <DistanceLine
                      start={{
                        latitude: selectedCustomer.latitude,
                        longitude: selectedCustomer.longitude,
                        name: selectedCustomer.name,
                        village: selectedCustomer.village
                      }}
                      end={{
                        latitude: selectedLab.latitude,
                        longitude: selectedLab.longitude,
                        name: selectedLab.name,
                        address: selectedLab.address
                      }}
                      color="#2196F3"
                      weight={3}
                      dashArray="5, 10"
                    />
                  )}
                </MapView>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('sakhi.customerList')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">
                        {language === 'english' ? 'Name' : 'பெயர்'}
                      </th>
                      <th className="py-3 text-left">
                        {language === 'english' ? 'Village' : 'கிராமம்'}
                      </th>
                      <th className="py-3 text-right">
                        {language === 'english' ? 'Distance' : 'தூரம்'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                          <td className="py-3">{customer.name}</td>
                        <td className="py-3">{customer.village}</td>
                          <td className="text-right">
                          {calculateDistanceInKm(
                            healthSakhi.latitude,
                            healthSakhi.longitude,
                            customer.latitude,
                            customer.longitude
                          ).toFixed(1)} km
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-tools" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <AIChat language={language as Language} className="h-[600px]" />
            </div>
            
            <div className="md:col-span-1">
              <NoteSummarizer language={language as Language} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="pt-4">
          <EducationalVideos language={language as Language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(SakhiDashboard);
