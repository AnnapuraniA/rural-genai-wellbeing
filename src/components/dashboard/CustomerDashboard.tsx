
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCustomerById, 
  getHealthSakhiById,
  getNearbyLabs
} from '@/lib/database';
import { 
  convertHealthSakhisToMarkers,
  convertLabsToMarkers,
  MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import AIChat from '@/components/AIChat';
import EducationalVideos from '@/components/EducationalVideos';
import { textToSpeech } from '@/lib/aiServices';
import { useToast } from '@/components/ui/use-toast';

const CustomerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [customer, setCustomer] = useState<any>(null);
  const [healthSakhi, setHealthSakhi] = useState<any>(null);
  const [labs, setLabs] = useState<any[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiLanguage, setAiLanguage] = useState<'english' | 'tamil'>('tamil');
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        // Get customer data
        const customerData = getCustomerById(currentUser.linkedId);
        setCustomer(customerData);
        
        if (customerData) {
          const allMarkers: MapMarker[] = [];
          
          // Get health sakhi data if linked
          if (customerData.linkedHealthSakhi) {
            const sakhiData = getHealthSakhiById(customerData.linkedHealthSakhi);
            setHealthSakhi(sakhiData);
            
            if (sakhiData) {
              // Add health sakhi to markers
              const sakhiMarkers = convertHealthSakhisToMarkers([sakhiData], {
                latitude: customerData.latitude,
                longitude: customerData.longitude
              });
              allMarkers.push(...sakhiMarkers);
            }
          }
          
          // Get nearby labs
          const labsData = getNearbyLabs(customerData.latitude, customerData.longitude, 10);
          setLabs(labsData);
          
          // Add labs to markers
          const labMarkers = convertLabsToMarkers(labsData, {
            latitude: customerData.latitude,
            longitude: customerData.longitude
          });
          allMarkers.push(...labMarkers);
          
          // Set all markers
          setMarkers(allMarkers);
        }
      } catch (error) {
        console.error('Error loading customer data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleTextToSpeech = async (text: string) => {
    try {
      await textToSpeech(text, aiLanguage);
      toast({
        title: aiLanguage === 'english' ? 'Text-to-Speech' : 'உரை-முதல்-பேச்சு',
        description: aiLanguage === 'english' 
          ? 'Playing audio...' 
          : 'ஆடியோ இயக்கப்படுகிறது...',
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: 'Error',
        description: aiLanguage === 'english' 
          ? 'Failed to play audio. Please try again.' 
          : 'ஆடியோவை இயக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">Customer data not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{aiLanguage === 'english' ? 'Customer Dashboard' : 'வாடிக்கையாளர் டாஷ்போர்டு'}</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAiLanguage(prev => prev === 'english' ? 'tamil' : 'english')}
          >
            {aiLanguage === 'english' ? 'தமிழ்' : 'English'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {aiLanguage === 'english' ? 'Your Health Sakhi' : 'உங்கள் ஆரோக்கிய சகி'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {healthSakhi ? healthSakhi.name : aiLanguage === 'english' ? 'Not Assigned' : 'நியமிக்கப்படவில்லை'}
            </div>
            {healthSakhi && (
              <>
                <p className="text-xs text-muted-foreground mt-1">
                  {aiLanguage === 'english' ? 'Contact:' : 'தொடர்பு:'} {healthSakhi.contactNumber}
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="mt-2 p-0 h-auto text-wellnet-green"
                  onClick={() => handleTextToSpeech(
                    aiLanguage === 'english'
                      ? `Your Health Sakhi is ${healthSakhi.name}. Contact number is ${healthSakhi.contactNumber}.`
                      : `உங்கள் ஆரோக்கிய சகி ${healthSakhi.name}. தொடர்பு எண் ${healthSakhi.contactNumber}.`
                  )}
                >
                  {aiLanguage === 'english' ? '🔊 Listen' : '🔊 கேட்க'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {aiLanguage === 'english' ? 'Nearby Labs' : 'அருகிலுள்ள ஆய்வகங்கள்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {labs.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {aiLanguage === 'english' 
                ? 'Labs within 10km of your location' 
                : 'உங்கள் இருப்பிடத்தில் இருந்து 10கிமீ தொலைவில் உள்ள ஆய்வகங்கள்'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {aiLanguage === 'english' ? 'Medical Records' : 'மருத்துவ பதிவுகள்'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.medicalHistory.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {aiLanguage === 'english' ? 'Available records' : 'கிடைக்கும் பதிவுகள்'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="health-assistant">
        <TabsList className="w-full bg-card border-b rounded-none justify-start h-auto p-0">
          <TabsTrigger 
            value="health-assistant" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {aiLanguage === 'english' ? 'Health Assistant' : 'ஆரோக்கிய உதவியாளர்'}
          </TabsTrigger>
          <TabsTrigger 
            value="map" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {aiLanguage === 'english' ? 'Nearby Services' : 'அருகிலுள்ள சேவைகள்'}
          </TabsTrigger>
          <TabsTrigger 
            value="records" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {aiLanguage === 'english' ? 'Medical Records' : 'மருத்துவ பதிவுகள்'}
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {aiLanguage === 'english' ? 'Educational Videos' : 'கல்வி வீடியோக்கள்'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="health-assistant" className="pt-4">
          <AIChat language={aiLanguage} className="h-[600px]" />
        </TabsContent>
        
        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {aiLanguage === 'english' ? 'Nearby Health Services' : 'அருகிலுள்ள ஆரோக்கிய சேவைகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MapView 
                markers={markers} 
                center={{ latitude: customer.latitude, longitude: customer.longitude }}
                height="500px"
                onMarkerClick={(marker) => setSelectedMarker(marker.id)}
                selectedMarkerId={selectedMarker || undefined}
                allowDirections={true}
                userLocation={{ latitude: customer.latitude, longitude: customer.longitude }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="records" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {aiLanguage === 'english' ? 'Medical Records' : 'மருத்துவ பதிவுகள்'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.medicalHistory.length === 0 ? (
                <div className="text-center py-8">
                  {aiLanguage === 'english' 
                    ? 'No medical records available yet.' 
                    : 'இன்னும் மருத்துவ பதிவுகள் எதுவும் இல்லை.'}
                </div>
              ) : (
                <div className="space-y-6">
                  {customer.medicalHistory.map((record: any, index: number) => {
                    const recordDate = new Date(record.date);
                    return (
                      <div key={record.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium">
                            {aiLanguage === 'english' ? 'Visit' : 'வருகை'} #{index + 1}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            {recordDate.toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">
                              {aiLanguage === 'english' ? 'Symptoms:' : 'அறிகுறிகள்:'}
                            </span> {record.symptoms}
                          </div>
                          
                          {record.diagnosis && (
                            <div>
                              <span className="font-medium">
                                {aiLanguage === 'english' ? 'Diagnosis:' : 'நோயறிதல்:'}
                              </span> {record.diagnosis}
                            </div>
                          )}
                          
                          {record.prescriptions && (
                            <div>
                              <span className="font-medium">
                                {aiLanguage === 'english' ? 'Prescription:' : 'மருந்து:'}
                              </span> {record.prescriptions}
                            </div>
                          )}
                          
                          {record.labTests && record.labTests.length > 0 && (
                            <div className="mt-3">
                              <div className="font-medium mb-1">
                                {aiLanguage === 'english' ? 'Lab Tests:' : 'ஆய்வக சோதனைகள்:'}
                              </div>
                              <ul className="list-disc pl-5 space-y-1">
                                {record.labTests.map((test: any) => (
                                  <li key={test.id}>
                                    {test.testName} - {
                                      aiLanguage === 'english' 
                                        ? test.status.charAt(0).toUpperCase() + test.status.slice(1) 
                                        : test.status === 'completed' 
                                          ? 'முடிக்கப்பட்டது' 
                                          : 'திட்டமிடப்பட்டுள்ளது'
                                    }
                                    {test.results && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {test.results}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => handleTextToSpeech(
                            `${aiLanguage === 'english' ? 'Visit on' : 'வருகை'} ${recordDate.toLocaleDateString()}. 
${aiLanguage === 'english' ? 'Symptoms' : 'அறிகுறிகள்'}: ${record.symptoms}.
${record.diagnosis ? (`${aiLanguage === 'english' ? 'Diagnosis' : 'நோயறிதல்'}: ${record.diagnosis}`) : ''}`
                          )}
                        >
                          {aiLanguage === 'english' ? '🔊 Listen' : '🔊 கேட்க'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education" className="pt-4">
          <EducationalVideos language={aiLanguage} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
