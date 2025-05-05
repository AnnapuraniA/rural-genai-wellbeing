import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getLabById,
  getNearbyCustomers,
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
import type { Lab, Customer } from '@/lib/database';
import { ErrorBoundary } from 'react-error-boundary';

type Language = 'english' | 'tamil';

const LabDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [lab, setLab] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Memoize legend items
  const legendItems = useMemo(() => [
    { color: '#FFCA28', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' },
    { color: '#2196F3', label: language === 'english' ? 'Customer' : 'வாடிக்கையாளர்' }
  ], [language]);

  // Memoize filtered customers
  const filteredCustomers = useMemo(() => 
    selectedService === 'all' 
      ? customers 
      : customers.filter(customer => customer.services?.includes(selectedService)),
    [customers, selectedService]
  );

  // Memoize average distance calculation
  const averageDistance = useMemo(() => {
    if (customers.length === 0) return '0.0';
    const totalDistance = customers.reduce((sum, customer) => 
      sum + calculateDistanceInKm(
        lab.latitude,
        lab.longitude,
        customer.latitude,
        customer.longitude
      ), 0);
    return (totalDistance / customers.length).toFixed(1);
  }, [customers, lab]);

  // Memoize marker click handler
  const handleMarkerClick = useCallback((marker: MapMarker) => {
    if (marker.type === 'customer') {
      const customer = customers.find(c => c.id === marker.id);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  }, [customers]);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Get lab data
        const labData = getLabById(currentUser.linkedId);
        setLab(labData);
        
        if (labData) {
          // Get nearby customers within 10km radius
          const customersData = getNearbyCustomers(labData.latitude, labData.longitude, 10);
          setCustomers(customersData);
          
          // Create markers array
          const markersArray: MapMarker[] = [
            // Lab marker
            {
              id: labData.id,
              type: 'lab',
              latitude: labData.latitude,
              longitude: labData.longitude,
              title: labData.name,
              info: `Services: ${labData.services.join(', ')}`
            }
          ];
          
          // Add customer markers with distances
          const customerMarkers = convertCustomersToMarkers(customersData, {
            latitude: labData.latitude,
            longitude: labData.longitude
          });
          markersArray.push(...customerMarkers);
          
          setMarkers(markersArray);
        }
      } catch (error) {
        console.error('Error loading lab data:', error);
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

  if (!lab) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">Lab not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('lab.name')}: {lab.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('lab.customers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customers.length} {t('lab.active')} {t('lab.customers')} {t('lab.inYourArea')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('lab.services')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lab.services.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('lab.servicesOffered')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('lab.avgDistance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageDistance} km</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('lab.averageDistance')}
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
            {t('lab.mapView')}
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('lab.customerList')}
          </TabsTrigger>
          <TabsTrigger 
            value="ai-tools" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('lab.aiTools')}
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('lab.educationalVideos')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Customer Locations' : 'வாடிக்கையாளர் இருப்பிடங்கள்'}
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                {language === 'english' 
                  ? 'Click on a customer to see the distance from your lab'
                  : 'உங்கள் ஆய்வகத்திலிருந்து தூரத்தைப் பார்க்க வாடிக்கையாளரைக் கிளிக் செய்யவும்'}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
                <MapView 
                  markers={markers}
                  center={{ latitude: lab.latitude, longitude: lab.longitude }}
                  height="500px"
                  showLegend={true}
                  legendItems={legendItems}
                  onMarkerClick={handleMarkerClick}
                >
                  <ConcentricCircles
                    center={{ latitude: lab.latitude, longitude: lab.longitude }}
                    distances={[2, 5, 10]}
                    colors={['#4CAF50', '#FF9800', '#F44336']}
                    opacity={0.2}
                  />
                  {selectedCustomer && (
                    <DistanceLine
                      start={{
                        latitude: lab.latitude,
                        longitude: lab.longitude,
                        name: lab.name,
                        address: lab.address
                      }}
                      end={{
                        latitude: selectedCustomer.latitude,
                        longitude: selectedCustomer.longitude,
                        name: selectedCustomer.name,
                        village: selectedCustomer.village
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
              <CardTitle>{t('lab.customerList')}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={selectedService === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedService('all')}
                >
                  {language === 'english' ? 'All Services' : 'அனைத்து சேவைகளும்'}
                </Button>
                {lab.services.map((service: string) => (
                  <Button
                    key={service}
                    variant={selectedService === service ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedService(service)}
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Village</th>
                      <th className="pb-2">Age</th>
                      <th className="pb-2">Gender</th>
                      <th className="pb-2">Services</th>
                      <th className="pb-2 text-right">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => {
                      const distance = calculateDistanceInKm(
                        lab.latitude,
                        lab.longitude,
                        customer.latitude,
                        customer.longitude
                      );
                      return (
                        <tr 
                          key={customer.id} 
                          className="border-b hover:bg-muted cursor-pointer"
                          onClick={() => handleMarkerClick({
                            id: customer.id,
                            type: 'customer',
                            latitude: customer.latitude,
                            longitude: customer.longitude,
                            title: customer.name,
                            info: `Village: ${customer.village}`
                          })}
                        >
                          <td className="py-3">{customer.name}</td>
                          <td>{customer.village}</td>
                          <td>{customer.age}</td>
                          <td>{customer.gender}</td>
                          <td>{customer.services?.join(', ') || '-'}</td>
                          <td className="text-right">{distance.toFixed(1)} km</td>
                        </tr>
                      );
                    })}
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

export default React.memo(LabDashboard);
