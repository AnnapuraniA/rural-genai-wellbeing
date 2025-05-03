
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getHealthSakhiById, 
  getCustomersByHealthSakhiId,
  getNearbyLabs
} from '@/lib/database';
import { 
  convertCustomersToMarkers,
  convertLabsToMarkers,
  filterMarkersByDistance
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import AIChat from '@/components/AIChat';
import NoteSummarizer from '@/components/NoteSummarizer';
import EducationalVideos from '@/components/EducationalVideos';

const SakhiDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [healthSakhi, setHealthSakhi] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [customerMarkers, setCustomerMarkers] = useState<any[]>([]);
  const [labMarkers, setLabMarkers] = useState<any[]>([]);
  const [radius, setRadius] = useState(5); // Default radius in km
  const [showCustomers, setShowCustomers] = useState(true);
  const [showLabs, setShowLabs] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiLanguage, setAiLanguage] = useState<'english' | 'tamil'>('english');

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
          
          // Get nearby labs
          const labsData = getNearbyLabs(sakhiData.latitude, sakhiData.longitude, 10);
          setLabs(labsData);
          
          // Convert customers to map markers
          const custMarkers = convertCustomersToMarkers(customersData, {
            latitude: sakhiData.latitude,
            longitude: sakhiData.longitude
          });
          setCustomerMarkers(custMarkers);
          
          // Convert labs to map markers
          const labMrks = convertLabsToMarkers(labsData, {
            latitude: sakhiData.latitude,
            longitude: sakhiData.longitude
          });
          setLabMarkers(labMrks);
        }
      } catch (error) {
        console.error('Error loading health sakhi data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  const getVisibleMarkers = () => {
    const visibleMarkers = [];
    
    if (showCustomers) {
      visibleMarkers.push(...filterMarkersByDistance(customerMarkers, radius));
    }
    
    if (showLabs) {
      visibleMarkers.push(...filterMarkersByDistance(labMarkers, radius));
    }
    
    return visibleMarkers;
  };

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
        <h1 className="text-2xl font-bold">Health Sakhi Dashboard</h1>
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
            <CardTitle className="text-sm font-medium">Your Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{healthSakhi.linkedCustomers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customers.length} active customers in your area
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Village</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthSakhi.village}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Primary service area
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nearby Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{labs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {labs.filter(lab => lab.services.includes('Blood Tests')).length} offer blood tests
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
            Map View
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger 
            value="ai-tools" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            AI Tools
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            Educational Videos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Area Map</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="show-customers" 
                      checked={showCustomers} 
                      onChange={() => setShowCustomers(!showCustomers)}
                    />
                    <label htmlFor="show-customers" className="text-sm">Show Customers</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="show-labs" 
                      checked={showLabs} 
                      onChange={() => setShowLabs(!showLabs)}
                    />
                    <label htmlFor="show-labs" className="text-sm">Show Labs</label>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Radius: {radius} km</span>
                  <div className="space-x-2">
                    <Button 
                      variant={radius === 2 ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setRadius(2)}
                      className={radius === 2 ? "bg-wellnet-green" : ""}
                    >
                      2km
                    </Button>
                    <Button 
                      variant={radius === 5 ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setRadius(5)}
                      className={radius === 5 ? "bg-wellnet-green" : ""}
                    >
                      5km
                    </Button>
                    <Button 
                      variant={radius === 10 ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setRadius(10)}
                      className={radius === 10 ? "bg-wellnet-green" : ""}
                    >
                      10km
                    </Button>
                  </div>
                </div>
                <Slider 
                  value={[radius]} 
                  min={1} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => setRadius(value[0])}
                  className="mt-2"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <MapView 
                markers={getVisibleMarkers()} 
                center={{ latitude: healthSakhi.latitude, longitude: healthSakhi.longitude }}
                height="500px"
                onMarkerClick={(marker) => setSelectedMarker(marker.id)}
                selectedMarkerId={selectedMarker || undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Customers</CardTitle>
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
                      <th className="pb-2 text-right">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => {
                      const customerMarker = customerMarkers.find(m => m.id === customer.id);
                      return (
                        <tr key={customer.id} className="border-b">
                          <td className="py-3">{customer.name}</td>
                          <td>{customer.village}</td>
                          <td>{customer.age}</td>
                          <td>{customer.gender}</td>
                          <td className="text-right">
                            {customerMarker?.distance ? `${customerMarker.distance.toFixed(1)} km` : 'N/A'}
                          </td>
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
              <AIChat language={aiLanguage} className="h-[600px]" />
            </div>
            
            <div className="md:col-span-1">
              <NoteSummarizer language={aiLanguage} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="pt-4">
          <EducationalVideos language={aiLanguage} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SakhiDashboard;
