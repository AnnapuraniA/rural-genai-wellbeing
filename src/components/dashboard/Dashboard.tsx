import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockCustomerData, mockHealthSakhiData, mockLabData, mockTestResults, mockVideos } from '../../data/mockData';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';
import { Appointment } from '../../types';

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

const Dashboard: React.FC = () => {
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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

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
            
            markersArray.push({
              id: nearestLab.id,
              type: 'lab',
              latitude: nearestLab.latitude,
              longitude: nearestLab.longitude,
              title: nearestLab.name,
              info: `Services: ${nearestLab.services.join(', ')}`,
              distance: labDistance
            });
          }
          
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
    <div className="container-fluid py-4">
      <h2 className="mb-4">Welcome, {customer?.name || mockCustomerData.name}</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="videos">Educational Videos</TabsTrigger>
          <TabsTrigger value="history">Health History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Row>
            <Col md={6}>
              <Card>
                <CardHeader>
                  <CardTitle>Your Health Sakhi</CardTitle>
                </CardHeader>
                <CardContent>
                  <h5>{assignedHealthSakhi?.name || '-'}</h5>
                  <p className="text-muted">{assignedHealthSakhi?.specialization || '-'}</p>
                  <p>Experience: {assignedHealthSakhi?.experience || '-'}</p>
                  <p>Availability: {assignedHealthSakhi?.availability || '-'}</p>
                  <Button onClick={() => setActiveTab('messages')}>
                    Message Health Sakhi
                  </Button>
                </CardContent>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.length > 0 ? (
                    appointments.map(appointment => (
                      <div key={appointment.id} className="mb-4">
                        <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {appointment.time}</p>
                        <p><strong>Type:</strong> {appointment.type}</p>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming appointments</p>
                  )}
                </CardContent>
              </Card>
            </Col>
          </Row>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardContent>
              <MapView
                markers={markers}
                onMarkerClick={handleMarkerClick}
                selectedMarker={selectedMarker}
                legendItems={legendItems}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value=""
                    onChange={() => {}}
                  />
                  <Button>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <EducationalVideos videos={mockVideos} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Health History</CardTitle>
            </CardHeader>
            <CardContent>
              {mockTestResults.map(result => (
                <div key={result.id} className="mb-4">
                  <h4>{result.type} - {result.date}</h4>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard; 