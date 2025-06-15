import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  type Lab,
  type Appointment
} from '@/lib/database';
import { 
  convertCustomersToMarkers,
  convertLabsToMarkers,
  convertHealthSakhisToMarkers,
  filterMarkersByDistance,
  type MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import EducationalVideos from '@/components/EducationalVideos';
import { textToSpeech } from '@/lib/aiServices';
import { ErrorBoundary } from 'react-error-boundary';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, MessageSquare, Video, MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Row, Col } from 'react-bootstrap';
import { mockCustomerData, mockHealthSakhiData, mockLabData, mockTestResults, mockVideos } from '../../data/mockData';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CustomerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [assignedHealthSakhi, setAssignedHealthSakhi] = useState<HealthSakhi | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Memoize legend items
  const legendItems = useMemo(() => [
    { color: '#A1887F', label: language === 'english' ? 'Health Sakhi' : 'ஆரோக்கிய சகி' },
    { color: '#4CAF50', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' },
    { color: '#2196F3', label: language === 'english' ? 'You' : 'நீங்கள்' }
  ], [language]);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Get customer data
        const customerData = getCustomerById(currentUser.linkedId);
        setCustomer(customerData);
        
        if (customerData) {
          // Get assigned health sakhi
          if (customerData.linkedHealthSakhi) {
            const sakhi = getHealthSakhiById(customerData.linkedHealthSakhi);
            setAssignedHealthSakhi(sakhi || null);
          }
          
          // Get nearby labs
          const labsData = getNearbyLabs(customerData.latitude, customerData.longitude, 10);
          setLabs(labsData);
          
          // Create markers array
          const markersArray: MapMarker[] = [
            // Customer marker
            {
              id: customerData.id,
              type: 'customer',
              latitude: customerData.latitude,
              longitude: customerData.longitude,
              title: customerData.name,
              info: `Village: ${customerData.village}`
            }
          ];
          
          // Add assigned health sakhi marker if exists
          if (customerData.linkedHealthSakhi) {
            const sakhi = getHealthSakhiById(customerData.linkedHealthSakhi);
            if (sakhi) {
              const sakhiMarker = convertHealthSakhisToMarkers([sakhi], {
                latitude: customerData.latitude,
                longitude: customerData.longitude
              });
              markersArray.push(...sakhiMarker);
            }
          }
          
          // Add all nearby labs
          const labMarkers = convertLabsToMarkers(labsData, {
            latitude: customerData.latitude,
            longitude: customerData.longitude
          });
          markersArray.push(...labMarkers);
          
          setMarkers(markersArray);
          setAppointments(customerData.appointments || []);
          setSelectedMarker(markersArray[0]);
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
    setSelectedMarker(marker);
  };

  const handleGetDirections = (marker: MapMarker) => {
    if (customer) {
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

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Welcome' : 'வரவேற்கிறோம்'}, {customer?.name || mockCustomerData.name}
          </CardTitle>
          <CardDescription>
            {language === 'english' ? 'Customer Dashboard' : 'வாடிக்கையாளர் டாஷ்போர்டு'}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="w-full bg-card border-b rounded-none justify-start h-auto p-0">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {language === 'english' ? 'Overview' : 'கண்ணோட்டம்'}
          </TabsTrigger>
          <TabsTrigger 
            value="map" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {language === 'english' ? 'Map' : 'வரைபடம்'}
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {language === 'english' ? 'Messages' : 'செய்திகள்'}
          </TabsTrigger>
          <TabsTrigger 
            value="videos" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {language === 'english' ? 'Educational Videos' : 'கல்வி வீடியோக்கள்'}
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {language === 'english' ? 'Health History' : 'ஆரோக்கிய வரலாறு'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Customer Summary and Health Sakhi Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'english' ? 'Customer Summary' : 'வாடிக்கையாளர் சுருக்கம்'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Village' : 'கிராமம்'}:
                    </span>
                    <span className="font-medium">{customer?.village || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Age' : 'வயது'}:
                    </span>
                    <span className="font-medium">{customer?.age || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Gender' : 'பாலினம்'}:
                    </span>
                    <span className="font-medium">{customer?.gender || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Contact' : 'தொடர்பு'}:
                    </span>
                    <span className="font-medium">{customer?.contactNumber || '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Sakhi Contact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'english' ? 'Health Sakhi Contact' : 'ஆரோக்கிய சகி தொடர்பு'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Name' : 'பெயர்'}:
                    </span>
                    <span className="font-medium">{assignedHealthSakhi?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Contact' : 'தொடர்பு'}:
                    </span>
                    <span className="font-medium">{assignedHealthSakhi?.contactNumber || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Specializations' : 'சிறப்பு திறன்கள்'}:
                    </span>
                    <span className="font-medium">{assignedHealthSakhi?.specializations?.join(', ') || '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'english' ? 'Upcoming Appointments' : 'வரவிருக்கும் நேரங்கள்'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {appointments.length > 0 ? (
                  appointments.map(appointment => (
                    <div key={appointment.id} className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{appointment.testName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      {appointment.results && (
                        <p className="mt-2 text-sm">{appointment.results}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-gray-500">
                    {language === 'english' ? 'No upcoming appointments' : 'வரவிருக்கும் நேரங்கள் எதுவும் இல்லை'}
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Nearby Services' : 'அருகிலுள்ள சேவைகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
                <MapView 
                  markers={markers} 
                  center={customer ? { latitude: customer.latitude, longitude: customer.longitude } : undefined}
                  height="500px"
                  showLegend={true}
                  legendItems={legendItems}
                  onMarkerClick={handleMarkerClick}
                  selectedMarkerId={selectedMarker?.id}
                  allowDirections={true}
                  userLocation={customer ? { latitude: customer.latitude, longitude: customer.longitude } : undefined}
                  onGetDirections={handleGetDirections}
                />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'english' ? 'Messages' : 'செய்திகள்'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={language === 'english' ? 'Type your message...' : 'உங்கள் செய்தியை உள்ளிடவும்...'}
                    value=""
                    onChange={() => {}}
                  />
                  <Button>{language === 'english' ? 'Send' : 'அனுப்பு'}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'english' ? 'Educational Videos' : 'கல்வி வீடியோக்கள்'}</CardTitle>
              <CardDescription>
                {language === 'english' 
                  ? 'Watch informative videos about health and wellness' 
                  : 'ஆரோக்கியம் மற்றும் நல்வாழ்வு பற்றிய தகவல் வீடியோக்களைப் பாருங்கள்'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(mockVideos).map(([category, videos]) => (
                  videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <Button variant="ghost" size="icon" className="text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-8 h-8"
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{video.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{video.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{video.duration}</span>
                          <Button variant="outline" size="sm">
                            {language === 'english' ? 'Watch' : 'பாருங்கள்'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'english' ? 'Health History' : 'ஆரோக்கிய வரலாறு'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {mockTestResults.map(result => (
                  <div key={result.id} className="mb-4">
                    <h4 className="font-medium">{result.type} - {result.date}</h4>
                    <div className="space-y-2">
                      {result.results.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>{item.value}</span>
                          <span className={item.status === 'normal' ? 'text-green-500' : 'text-red-500'}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{result.notes}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard; 