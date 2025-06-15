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
  calculateDistanceInKm,
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
import AIChat from '@/components/AIChat';
import NoteSummarizer from '@/components/NoteSummarizer';
import ConcentricCircles from '@/components/map/ConcentricCircles';
import DistanceLine from '@/components/map/DistanceLine';
import { ErrorBoundary } from 'react-error-boundary';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

// New interfaces
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface Appointment {
  id: string;
  customerId: string;
  type: 'health' | 'lab';
  date: Date;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface HealthRecord {
  id: string;
  customerId: string;
  bloodPressure?: string;
  bloodSugar?: string;
  notes?: string;
  date: Date;
}

type Language = 'english' | 'tamil';

export default function SakhiDashboard() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [healthSakhi, setHealthSakhi] = useState<HealthSakhi | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [nearbyLabs, setNearbyLabs] = useState<Lab[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    type: 'health' as 'health' | 'lab',
    date: new Date(),
    time: '09:00',
    notes: ''
  });
  const [newMessage, setNewMessage] = useState('');
  const [newHealthRecord, setNewHealthRecord] = useState({
    bloodPressure: '',
    bloodSugar: '',
    notes: ''
  });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [summary, setSummary] = useState('');
  const [notifications, setNotifications] = useState<{
    id: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }[]>([]);

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
      const lab = nearbyLabs.find(l => l.id === marker.id);
      if (lab) {
        setSelectedCustomer(null);
        setNearbyLabs([lab]);
      }
    }
  }, [customers, nearbyLabs]);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        // Get health sakhi data
        const sakhiData = getHealthSakhiById(currentUser.linkedId);
        setHealthSakhi(sakhiData);
        
        if (sakhiData) {
          // Get customers data
          const customersData = getCustomersByHealthSakhiId(sakhiData.id);
          setCustomers(customersData);
          
          // Get labs data
          const labsData = getNearbyLabs(sakhiData.latitude, sakhiData.longitude, 10);
          setNearbyLabs(labsData);
          
          // Create markers array
          const markersArray: MapMarker[] = [];

          // Add health sakhi marker
          markersArray.push({
            id: sakhiData.id,
            type: 'healthSakhi' as const,
            latitude: sakhiData.latitude,
            longitude: sakhiData.longitude,
            title: sakhiData.name,
            info: `Village: ${sakhiData.village}\nContact: ${sakhiData.contactNumber}\nSpecializations: ${sakhiData.specializations.join(', ')}`
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

          // Handle marker clicks
          markersArray.forEach(marker => handleMarkerClick(marker));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleNewMessage = useCallback((message: Message) => {
    if (message.senderId !== healthSakhi?.id) {
      setUnreadMessages(prev => prev + 1);
      setNotifications(prev => [
        {
          id: message.id,
          message: `New message from ${customers.find(c => c.id === message.senderId)?.name || 'Customer'}`,
          timestamp: message.timestamp,
          read: false
        },
        ...prev
      ]);
    }
  }, [healthSakhi, customers]);

  const markMessagesAsRead = useCallback(() => {
    setUnreadMessages(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedCustomer || !healthSakhi) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: healthSakhi.id,
      receiverId: selectedCustomer.id,
      content: newMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  }, [newMessage, selectedCustomer, healthSakhi]);

  const handleScheduleAppointment = useCallback(() => {
    if (!selectedCustomer || !appointmentDetails.date) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      type: appointmentDetails.type,
      date: appointmentDetails.date,
      time: appointmentDetails.time,
      status: 'scheduled',
      notes: appointmentDetails.notes
    };

    setAppointments(prev => [...prev, appointment]);
    setAppointmentDetails({
      type: 'health',
      date: new Date(),
      time: '09:00',
      notes: ''
    });
  }, [selectedCustomer, appointmentDetails]);

  const handleCancelAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'cancelled' as const }
        : apt
    ));
  }, []);

  const handleAddHealthRecord = useCallback(() => {
    if (!selectedCustomer) return;

    const record: HealthRecord = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      bloodPressure: newHealthRecord.bloodPressure,
      bloodSugar: newHealthRecord.bloodSugar,
      notes: newHealthRecord.notes,
      date: new Date()
    };

    setHealthRecords(prev => [...prev, record]);
    setNewHealthRecord({
      bloodPressure: '',
      bloodSugar: '',
      notes: ''
    });
  }, [selectedCustomer, newHealthRecord]);

  const calculateAverageDistance = useCallback(() => {
    if (!healthSakhi || !customers.length) return 0;

    const totalDistance = customers.reduce((sum, customer) => {
      return sum + calculateDistanceInKm(
        healthSakhi.latitude,
        healthSakhi.longitude,
        customer.latitude,
        customer.longitude
      );
    }, 0);

    return totalDistance / customers.length;
  }, [healthSakhi, customers]);

  const getAvailableServices = useCallback(() => {
    const services = new Set<string>();
    nearbyLabs.forEach(lab => {
      lab.services.forEach(service => services.add(service));
    });
    return Array.from(services).join(', ');
  }, [nearbyLabs]);

  // Add notification bell component
  const NotificationBell = () => (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          markMessagesAsRead();
          // Show notifications dropdown
        }}
      >
        <Bell className="h-5 w-5" />
        {unreadMessages > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
            {unreadMessages}
          </Badge>
        )}
      </Button>
      </div>
    );

  if (!healthSakhi) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">{t('Loading dashboard...')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Welcome Page */}
      <div className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {language === 'english' ? 'Welcome' : 'வரவேற்கிறோம்'}, {healthSakhi?.name}
              </CardTitle>
              <CardDescription>
                {language === 'english' ? 'Health Sakhi Dashboard' : 'ஆரோக்கிய சகி டாஷ்போர்டு'}
              </CardDescription>
            </div>
            <NotificationBell />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Personal Information')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('Name')}: {healthSakhi?.name}</p>
                  <p>{t('Village')}: {healthSakhi?.village}</p>
                  <p>{t('Contact')}: {healthSakhi?.contactNumber}</p>
          </CardContent>
        </Card>
        
        <Card>
                <CardHeader>
                  <CardTitle>{t('Service Statistics')}</CardTitle>
          </CardHeader>
          <CardContent>
                  <p>{t('Total Customers')}: {customers.length}</p>
                  <p>{t('Average Distance')}: {calculateAverageDistance().toFixed(1)} km</p>
          </CardContent>
        </Card>
        
        <Card>
                <CardHeader>
                  <CardTitle>{t('Nearby Resources')}</CardTitle>
          </CardHeader>
          <CardContent>
                  <p>{t('Nearby Labs')}: {nearbyLabs.length}</p>
                  <p>{t('Services Available')}: {getAvailableServices()}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation Tabs */}
      <Tabs defaultValue="map" className="space-y-4">
        <TabsList className="w-full bg-card border-b rounded-none justify-start h-auto p-0">
          <TabsTrigger value="map">
            {language === 'english' ? 'Map View' : 'வரைபடக் காட்சி'}
          </TabsTrigger>
          <TabsTrigger value="customers">
            {language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்'}
          </TabsTrigger>
          <TabsTrigger value="appointments">
            {language === 'english' ? 'Appointments' : 'நேரங்கள்'}
          </TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            {language === 'english' ? 'Messages' : 'செய்திகள்'}
            {unreadMessages > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="summarizer">
            {language === 'english' ? 'Note Summarizer' : 'குறிப்பு சுருக்கம்'}
          </TabsTrigger>
        </TabsList>
        
        {/* Map View Tab */}
        <TabsContent value="map">
          <div className="h-[600px] relative">
              <MapView 
              markers={[
                // Add Health Sakhi marker
                healthSakhi ? {
                  id: healthSakhi.id,
                  type: 'healthSakhi' as const,
                  latitude: healthSakhi.latitude,
                  longitude: healthSakhi.longitude,
                  title: healthSakhi.name,
                  info: `Village: ${healthSakhi.village}\nContact: ${healthSakhi.contactNumber}\nSpecializations: ${healthSakhi.specializations.join(', ')}`
                } : null,
                // Add customer markers with enhanced info
                ...customers.map(customer => ({
                  id: customer.id,
                  type: 'customer' as const,
                  latitude: customer.latitude,
                  longitude: customer.longitude,
                  title: customer.name,
                  info: `Village: ${customer.village}\nAge: ${customer.age}\nGender: ${customer.gender}\nContact: ${customer.contactNumber}\nDistance: ${calculateDistanceInKm(
                    healthSakhi?.latitude || 0,
                    healthSakhi?.longitude || 0,
                    customer.latitude,
                    customer.longitude
                  ).toFixed(1)} km`
                })),
                // Add lab markers with enhanced info
                ...nearbyLabs.map(lab => ({
                  id: lab.id,
                  type: 'lab' as const,
                  latitude: lab.latitude,
                  longitude: lab.longitude,
                  title: lab.name,
                  info: `Address: ${lab.address}\nContact: ${lab.contactNumber}\nServices: ${lab.services.join(', ')}\nWorking Hours: ${lab.workingHours}\nWorking Days: ${lab.workingDays.join(', ')}\nDistance: ${calculateDistanceInKm(
                    healthSakhi?.latitude || 0,
                    healthSakhi?.longitude || 0,
                    lab.latitude,
                    lab.longitude
                  ).toFixed(1)} km`
                }))
              ].filter(Boolean) as MapMarker[]}
              center={healthSakhi ? { latitude: healthSakhi.latitude, longitude: healthSakhi.longitude } : undefined}
                  onMarkerClick={handleMarkerClick}
              showLegend={true}
              legendItems={legendItems}
            />
          </div>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers">
          <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>{t('Customer List')}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                  {customers.map(customer => (
                    <div
                      key={customer.id}
                      className="p-4 border-b cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.village}</p>
                      <p className="text-sm text-gray-500">
                        {t('Distance')}: {calculateDistanceInKm(
                          healthSakhi?.latitude || 0,
                          healthSakhi?.longitude || 0,
                            customer.latitude,
                            customer.longitude
                          ).toFixed(1)} km
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {selectedCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('Customer Details')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{t('Basic Information')}</h3>
                      <p>{t('Name')}: {selectedCustomer.name}</p>
                      <p>{t('Village')}: {selectedCustomer.village}</p>
                      <p>{t('Contact')}: {selectedCustomer.contactNumber}</p>
                      <p>{t('Distance')}: {calculateDistanceInKm(
                        healthSakhi?.latitude || 0,
                        healthSakhi?.longitude || 0,
                        selectedCustomer.latitude,
                        selectedCustomer.longitude
                      ).toFixed(1)} km</p>
                    </div>

                    <div>
                      <h3 className="font-medium">{t('Health Records')}</h3>
                      <ScrollArea className="h-[200px]">
                        {healthRecords
                          .filter(record => record.customerId === selectedCustomer.id)
                          .map(record => (
                            <div key={record.id} className="p-2 border-b">
                              <p>{new Date(record.date).toLocaleDateString()}</p>
                              {record.bloodPressure && <p>BP: {record.bloodPressure}</p>}
                              {record.bloodSugar && <p>BS: {record.bloodSugar}</p>}
                              {record.notes && <p>{record.notes}</p>}
                            </div>
                          ))}
                      </ScrollArea>
                    </div>

                    <div>
                      <h3 className="font-medium">{t('Add Health Record')}</h3>
                      <div className="space-y-2">
                        <Input
                          placeholder={t('Blood Pressure')}
                          value={newHealthRecord.bloodPressure}
                          onChange={e => setNewHealthRecord(prev => ({
                            ...prev,
                            bloodPressure: e.target.value
                          }))}
                        />
                        <Input
                          placeholder={t('Blood Sugar')}
                          value={newHealthRecord.bloodSugar}
                          onChange={e => setNewHealthRecord(prev => ({
                            ...prev,
                            bloodSugar: e.target.value
                          }))}
                        />
                        <Textarea
                          placeholder={t('Notes')}
                          value={newHealthRecord.notes}
                          onChange={e => setNewHealthRecord(prev => ({
                            ...prev,
                            notes: e.target.value
                          }))}
                        />
                        <Button onClick={handleAddHealthRecord}>
                          {t('Add Record')}
                        </Button>
                      </div>
                    </div>
              </div>
            </CardContent>
          </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('Schedule Appointment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('Customer')}
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      onChange={e => setSelectedCustomer(
                        customers.find(c => c.id === e.target.value) || null
                      )}
                    >
                      <option value="">{t('Select Customer')}</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('Appointment Type')}
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={appointmentDetails.type}
                      onChange={e => setAppointmentDetails(prev => ({
                        ...prev,
                        type: e.target.value as 'health' | 'lab'
                      }))}
                    >
                      <option value="health">{t('Health Check')}</option>
                      <option value="lab">{t('Lab Test')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('Date')}
                    </label>
                    <Calendar
                      mode="single"
                      selected={appointmentDetails.date}
                      onSelect={date => date && setAppointmentDetails(prev => ({
                        ...prev,
                        date
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('Time')}
                    </label>
                    <Input
                      type="time"
                      value={appointmentDetails.time}
                      onChange={e => setAppointmentDetails(prev => ({
                        ...prev,
                        time: e.target.value
                      }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('Notes')}
                    </label>
                    <Textarea
                      value={appointmentDetails.notes}
                      onChange={e => setAppointmentDetails(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                    />
            </div>
            
                  <Button onClick={handleScheduleAppointment}>
                    {t('Schedule')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('Upcoming Appointments')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {appointments
                    .filter(apt => apt.status === 'scheduled')
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map(appointment => {
                      const customer = customers.find(c => c.id === appointment.customerId);
                      return (
                        <div key={appointment.id} className="p-4 border-b">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{customer?.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                              <Badge variant={appointment.type === 'health' ? 'default' : 'secondary'}>
                                {t(appointment.type === 'health' ? 'Health Check' : 'Lab Test')}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              {t('Cancel')}
                            </Button>
                          </div>
                          {appointment.notes && (
                            <p className="mt-2 text-sm">{appointment.notes}</p>
                          )}
                        </div>
                      );
                    })}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('Customer List')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {customers.map(customer => (
                    <div
                      key={customer.id}
                      className="p-4 border-b cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.village}</p>
                        </div>
                        {messages.some(m => 
                          m.senderId === customer.id && 
                          !notifications.find(n => n.id === m.id)?.read
                        ) && (
                          <Badge>{t('New')}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {selectedCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('Messages')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ScrollArea className="h-[300px]">
                      {messages
                        .filter(msg => 
                          (msg.senderId === selectedCustomer.id && msg.receiverId === healthSakhi?.id) ||
                          (msg.senderId === healthSakhi?.id && msg.receiverId === selectedCustomer.id)
                        )
                        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                        .map(message => (
                          <div
                            key={message.id}
                            className={`p-2 rounded-lg mb-2 ${
                              message.senderId === healthSakhi?.id
                                ? 'bg-blue-100 ml-auto'
                                : 'bg-gray-100'
                            } max-w-[80%]`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                    </ScrollArea>

                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder={t('Type a message...')}
                      />
                      <Button onClick={handleSendMessage}>
                        {t('Send')}
                      </Button>
                    </div>
            </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Summarizer Tab */}
        <TabsContent value="summarizer">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('Note Summarizer')}</CardTitle>
              </CardHeader>
              <CardContent>
                <NoteSummarizer language={language as Language} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('Summary Results')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {summary ? (
                    <div dangerouslySetInnerHTML={{ __html: summary }} />
                  ) : (
                    <p className="text-gray-500">{t('No summary generated yet')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
