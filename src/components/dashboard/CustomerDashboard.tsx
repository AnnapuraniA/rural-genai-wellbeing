import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  getCustomerById,
  getHealthSakhiById,
  getNearbyLabs,
  calculateDistanceInKm,
  type Customer,
  type HealthSakhi,
  type Lab
} from '@/lib/database';
import { 
  convertCustomersToMarkers,
  convertLabsToMarkers,
  convertHealthSakhisToMarkers,
  filterMarkersByDistance,
  MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import AIChat from '@/components/AIChat';
import NoteSummarizer from '@/components/NoteSummarizer';
import EducationalVideos from '@/components/EducationalVideos';
import { textToSpeech } from '@/lib/aiServices';
import ConcentricCircles from '@/components/map/ConcentricCircles';
import { ErrorBoundary } from 'react-error-boundary';

const CustomerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [healthSakhi, setHealthSakhi] = useState<HealthSakhi | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedSakhi, setSelectedSakhi] = useState<HealthSakhi | null>(null);
  const [filteredMarkers, setFilteredMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Get customer data
        const customerData = getCustomerById(currentUser.linkedId);
        setCustomer(customerData);
        
        if (customerData) {
          // Get health sakhi data
          const sakhiData = getHealthSakhiById(customerData.linkedHealthSakhi);
          setHealthSakhi(sakhiData);
          setSelectedSakhi(sakhiData);
          
          // Get nearby labs
          const labsData = getNearbyLabs(customerData.latitude, customerData.longitude, 10);
          setLabs(labsData);
          
          // Create markers array
          const markers: MapMarker[] = [
            // Customer marker
            {
              id: customerData.id,
              type: 'customer',
              latitude: customerData.latitude,
              longitude: customerData.longitude,
              title: customerData.name,
              info: `Age: ${customerData.age}\nGender: ${customerData.gender}`
            }
          ];
          
          // Add health sakhi marker if available
          if (sakhiData) {
            const sakhiDistance = calculateDistanceInKm(
              customerData.latitude,
              customerData.longitude,
              sakhiData.latitude,
              sakhiData.longitude
            );
            
            markers.push({
              id: sakhiData.id,
              type: 'healthSakhi',
              latitude: sakhiData.latitude,
              longitude: sakhiData.longitude,
              title: sakhiData.name,
              info: `Village: ${sakhiData.village}`,
              distance: sakhiDistance
            });
          }
          
          // Add nearest lab if available
          if (labsData.length > 0) {
            const nearestLab = labsData.reduce((nearest, current) => {
              const nearestDist = calculateDistanceInKm(
                customerData.latitude,
                customerData.longitude,
                nearest.latitude,
                nearest.longitude
              );
              const currentDist = calculateDistanceInKm(
                customerData.latitude,
                customerData.longitude,
                current.latitude,
                current.longitude
              );
              return currentDist < nearestDist ? current : nearest;
            }, labsData[0]);
            
            const labDistance = calculateDistanceInKm(
              customerData.latitude,
              customerData.longitude,
              nearestLab.latitude,
              nearestLab.longitude
            );
            
            markers.push({
              id: nearestLab.id,
              type: 'lab',
              latitude: nearestLab.latitude,
              longitude: nearestLab.longitude,
              title: nearestLab.name,
              info: `Services: ${nearestLab.services.join(', ')}`,
              distance: labDistance
            });
          }
          
          setFilteredMarkers(markers);
        }
      } catch (error) {
        console.error('Error loading customer data:', error);
        toast({
          title: 'Error',
          description: language === 'english' 
            ? 'Failed to load customer data. Please try again.' 
            : 'வாடிக்கையாளர் தரவை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, language, toast]);

  const handleSakhiClick = (sakhi: any) => {
    setSelectedSakhi(sakhi);
    
    // Filter markers within 10km of selected sakhi
    const sakhiLocation = {
      latitude: sakhi.latitude,
      longitude: sakhi.longitude
    };
    
    // First convert markers with distances
    const customersWithDistances = convertCustomersToMarkers([customer], sakhiLocation);
    const labsWithDistances = convertLabsToMarkers(labs, sakhiLocation);
    
    // Then filter by distance
    const filteredCustomers = filterMarkersByDistance(customersWithDistances, 10);
    const filteredLabs = filterMarkersByDistance(labsWithDistances, 10);
    
    setFilteredMarkers([...filteredCustomers, ...filteredLabs]);
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      await textToSpeech(text, language);
      toast({
        title: language === 'english' ? 'Success' : 'வெற்றி',
        description: language === 'english' ? 'Text converted to speech' : 'உரை பேச்சாக மாற்றப்பட்டது',
      });
    } catch (error) {
      console.error('Error converting text to speech:', error);
      toast({
        title: language === 'english' ? 'Error' : 'பிழை',
        description: language === 'english' ? 'Failed to convert text to speech' : 'உரையை பேச்சாக மாற்ற முடியவில்லை',
        variant: 'destructive',
      });
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    // Just set the selected marker, the popup will show automatically
    setSelectedMarker(marker);
  };

  const handleGetDirections = (marker: MapMarker) => {
    if (customer) {
      // Open Google Maps directions in a new tab
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${customer.latitude},${customer.longitude}&destination=${marker.latitude},${marker.longitude}`;
      window.open(directionsUrl, '_blank');
    }
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

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium text-red-500">
          {language === 'english' ? 'Customer not found' : 'வாடிக்கையாளர் கிடைக்கவில்லை'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Welcome' : 'வரவேற்கிறோம்'}, {customer.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Your Health Sakhi' : 'உங்கள் ஆரோக்கிய சகி'}: {healthSakhi?.name || '-'}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Village' : 'கிராமம்'}: {customer.village}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Age' : 'வயது'}: {customer.age}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Gender' : 'பாலினம்'}: {customer.gender}
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
          <TabsTrigger value="chat">
            {language === 'english' ? 'AI Chat' : 'ஏஐ அரட்டை'}
          </TabsTrigger>
          <TabsTrigger value="notes">
            {language === 'english' ? 'Notes' : 'குறிப்புகள்'}
          </TabsTrigger>
          <TabsTrigger value="videos">
            {language === 'english' ? 'Videos' : 'வீடியோக்கள்'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Your Location' : 'உங்கள் இருப்பிடம்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
                <MapView 
                  markers={filteredMarkers}
                  center={{ latitude: customer.latitude, longitude: customer.longitude }}
                  height="500px"
                  showLegend={true}
                  onMarkerClick={setSelectedMarker}
                  selectedMarkerId={selectedMarker?.id}
                />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="pt-4">
          <AIChat language={language} />
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          <NoteSummarizer language={language} />
        </TabsContent>

        <TabsContent value="videos" className="pt-4">
          <EducationalVideos language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
