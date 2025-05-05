import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getHealthSakhiById,
  getNearbyCustomers,
  getLabById,
  getHealthSakhiMessages,
  sendMessage,
  markMessageAsRead,
  calculateDistanceInKm,
  type HealthSakhi,
  type Customer,
  type Lab,
  type Message
} from '@/lib/database';
import { 
  convertCustomersToMarkers,
  convertLabsToMarkers,
  type MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import { ErrorBoundary } from 'react-error-boundary';

interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  labId: string;
  labName: string;
  testName: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  results?: string;
}

const HealthSakhiDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [healthSakhi, setHealthSakhi] = useState<HealthSakhi | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [assignedLab, setAssignedLab] = useState<Lab | null>(null);
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
        // Get health sakhi data
        const sakhiData = getHealthSakhiById(currentUser.linkedId);
        setHealthSakhi(sakhiData);
        
        if (sakhiData) {
          // Get nearby customers within 10km radius
          const customersData = getNearbyCustomers(sakhiData.latitude, sakhiData.longitude, 10);
          setCustomers(customersData);
          
          // Get assigned lab
          if (sakhiData.linkedLab) {
            const lab = getLabById(sakhiData.linkedLab);
            setAssignedLab(lab || null);
          }
          
          // Get messages
          const sakhiMessages = getHealthSakhiMessages(sakhiData.id);
          setMessages(sakhiMessages);
          
          // Create markers array
          const markersArray: MapMarker[] = [
            // Health sakhi marker
            {
              id: sakhiData.id,
              type: 'healthSakhi',
              latitude: sakhiData.latitude,
              longitude: sakhiData.longitude,
              title: sakhiData.name,
              info: `Village: ${sakhiData.village}`
            }
          ];
          
          // Add assigned lab marker if exists
          if (sakhiData.linkedLab) {
            const lab = getLabById(sakhiData.linkedLab);
            if (lab) {
              const labMarker = convertLabsToMarkers([lab], {
                latitude: sakhiData.latitude,
                longitude: sakhiData.longitude
              });
              markersArray.push(...labMarker);
            }
          }
          
          // Add customer markers
          const customerMarkers = convertCustomersToMarkers(customersData, {
            latitude: sakhiData.latitude,
            longitude: sakhiData.longitude
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

  const handleSendMessage = (content: string, type: Message['type'], appointmentId?: string) => {
    if (!healthSakhi || !assignedLab) return;
    
    const newMessage = sendMessage({
      fromId: healthSakhi.id,
      fromName: healthSakhi.name,
      fromType: 'healthSakhi',
      toId: assignedLab.id,
      toName: assignedLab.name,
      toType: 'lab',
      subject: type === 'appointment' ? 'New Appointment Request' : 'Message from Health Sakhi',
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('healthSakhi.name')}: {healthSakhi.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('healthSakhi.customers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customers.length} {t('healthSakhi.active')} {t('healthSakhi.customers')} {t('healthSakhi.inYourArea')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('healthSakhi.appointments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('healthSakhi.appointmentsScheduled')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('healthSakhi.lab')}</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedLab ? (
              <>
                <div className="text-xl font-bold">{assignedLab.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {assignedLab.services.join(', ')}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t('healthSakhi.noLab')}</p>
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
            {t('healthSakhi.mapView')}
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('healthSakhi.customerList')}
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {t('healthSakhi.messages')}
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
                  ? 'View customer and lab locations'
                  : 'வாடிக்கையாளர் மற்றும் ஆய்வக இருப்பிடங்களைக் காண்க'}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
                <MapView 
                  markers={markers}
                  center={{ latitude: healthSakhi.latitude, longitude: healthSakhi.longitude }}
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
              <CardTitle>{t('healthSakhi.customerList')}</CardTitle>
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
                              healthSakhi.latitude,
                              healthSakhi.longitude,
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
              <CardTitle>{t('healthSakhi.messages')}</CardTitle>
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
                          {message.fromType === 'lab' ? 'From' : 'To'}: {message.fromType === 'lab' ? message.fromName : message.toName}
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

export default HealthSakhiDashboard; 