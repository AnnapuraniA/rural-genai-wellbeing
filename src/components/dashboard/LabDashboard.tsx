import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getLabById,
  getNearbyCustomers,
  getHealthSakhiById,
  getLabMessages,
  sendMessage,
  markMessageAsRead,
  calculateDistanceInKm,
  type Lab,
  type Customer,
  type HealthSakhi,
  type Message
} from '@/lib/database';
import { 
  convertCustomersToMarkers,
  convertHealthSakhisToMarkers,
  type MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import { ErrorBoundary } from 'react-error-boundary';

type Language = 'english' | 'tamil';

interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  healthSakhiId: string;
  healthSakhiName: string;
  testName: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  results?: string;
}

const LabDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [lab, setLab] = useState<Lab | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [assignedHealthSakhi, setAssignedHealthSakhi] = useState<HealthSakhi | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize legend items
  const legendItems = useMemo(() => [
    { color: '#FFCA28', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' },
    { color: '#2196F3', label: language === 'english' ? 'Customer' : 'வாடிக்கையாளர்' },
    { color: '#A1887F', label: language === 'english' ? 'Health Sakhi' : 'ஆரோக்கிய சகி' }
  ], [language]);

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
          
          // Get assigned health sakhi
          if (labData.linkedHealthSakhi) {
            const sakhi = getHealthSakhiById(labData.linkedHealthSakhi);
            setAssignedHealthSakhi(sakhi || null);
          }
          
          // Get messages
          const labMessages = getLabMessages(labData.id);
          setMessages(labMessages);
          
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
          
          // Add assigned health sakhi marker if exists
          if (labData.linkedHealthSakhi) {
            const sakhi = getHealthSakhiById(labData.linkedHealthSakhi);
            if (sakhi) {
              const sakhiMarker = convertHealthSakhisToMarkers([sakhi], {
                latitude: labData.latitude,
                longitude: labData.longitude
              });
              markersArray.push(...sakhiMarker);
            }
          }
          
          // Add customer markers
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

  const handleSendMessage = (content: string, type: Message['type'], appointmentId?: string) => {
    if (!lab || !assignedHealthSakhi) return;
    
    const newMessage = sendMessage({
      fromId: lab.id,
      fromName: lab.name,
      fromType: 'lab',
      toId: assignedHealthSakhi.id,
      toName: assignedHealthSakhi.name,
      toType: 'healthSakhi',
      subject: type === 'result' ? 'Test Results' : 'Message from Lab',
      content,
      type,
      appointmentId
    });
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleMarkAsRead = (messageId: string) => {
    const updatedMessage = markMessageAsRead(messageId);
    if (updatedMessage) {
      setMessages(prev => 
        prev.map(msg => msg.id === messageId ? updatedMessage : msg)
      );
    }
  };

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
            <CardTitle className="text-sm font-medium">{t('lab.healthSakhi')}</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedHealthSakhi ? (
              <>
                <div className="text-xl font-bold">{assignedHealthSakhi.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {assignedHealthSakhi.village}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No health sakhi assigned</p>
            )}
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
            value="messages" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('lab.messages')}
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
                  ? 'View customer and health sakhi locations'
                  : 'வாடிக்கையாளர் மற்றும் ஆரோக்கிய சகி இருப்பிடங்களைக் காண்க'}
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
                />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('lab.customerList')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map(customer => (
                  <Card key={customer.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-gray-600">
                          {language === 'english' ? 'Village' : 'கிராமம்'}: {customer.village}
                        </p>
                        <p className="text-sm text-gray-600">
                          {language === 'english' ? 'Age' : 'வயது'}: {customer.age}
                        </p>
                        <p className="text-sm text-gray-600">
                          {language === 'english' ? 'Gender' : 'பாலினம்'}: {customer.gender}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {language === 'english' ? 'Distance' : 'தூரம்'}: {
                            calculateDistanceInKm(
                              lab.latitude,
                              lab.longitude,
                              customer.latitude,
                              customer.longitude
                            ).toFixed(1)
                          } km
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('lab.messages')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map(message => (
                  <Card 
                    key={message.id} 
                    className={`p-4 cursor-pointer ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === 'unread') {
                        handleMarkAsRead(message.id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{message.subject}</h3>
                        <p className="text-sm text-gray-600">
                          {message.fromType === 'healthSakhi' ? 'From' : 'To'}: {message.fromType === 'healthSakhi' ? message.fromName : message.toName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(message.date).toLocaleString()}
                        </p>
                        {selectedMessage?.id === message.id && (
                          <p className="mt-2 text-sm">{message.content}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          message.type === 'appointment' ? 'bg-yellow-100 text-yellow-800' :
                          message.type === 'result' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {message.type}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabDashboard;

