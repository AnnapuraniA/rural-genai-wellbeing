import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getCoordinatorById,
  getHealthSakhisByCoordinatorId,
  getCustomersByHealthSakhiId,
  getNearbyLabs,
  type Coordinator,
  type HealthSakhi,
  type Customer,
  type Lab
} from '@/lib/database';
import { 
  convertHealthSakhisToMarkers,
  convertCustomersToMarkers,
  convertLabsToMarkers,
  MapMarker
} from '@/lib/mapServices';
import MapView from '@/components/MapView';
import HealthSakhiAnalyzer from '@/components/HealthSakhiAnalyzer';
import ConcentricCircles from '@/components/map/ConcentricCircles';
import { ErrorBoundary } from 'react-error-boundary';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock data for analytics
const mockAnalyticsData = {
  coverage: 72, // percentage
  underservedZones: [
    { 
      name: 'Pennagaram South', 
      priority: 'High', 
      population: 12500, 
      servedPopulation: 5625,  // 45% of 12500
      coverage: 45 
    },
    { 
      name: 'Harur East', 
      priority: 'Medium', 
      population: 9800, 
      servedPopulation: 5880,  // 60% of 9800
      coverage: 60 
    },
    { 
      name: 'Palacode North', 
      priority: 'High', 
      population: 15200, 
      servedPopulation: 6080,  // 40% of 15200
      coverage: 40 
    }
  ],
  monthlyGrowth: [
    { month: 'Jan', customers: 120, healthSakhis: 3 },
    { month: 'Feb', customers: 145, healthSakhis: 3 },
    { month: 'Mar', customers: 162, healthSakhis: 4 },
    { month: 'Apr', customers: 190, healthSakhis: 4 },
    { month: 'May', customers: 205, healthSakhis: 5 },
  ]
};

const CoordinatorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [coordinator, setCoordinator] = useState<Coordinator | null>(null);
  const [healthSakhis, setHealthSakhis] = useState<HealthSakhi[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedSakhi, setSelectedSakhi] = useState<HealthSakhi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Custom legend items for coordinator dashboard
  const legendItems = useMemo(() => [
    { color: '#2E7D32', label: language === 'english' ? 'Coordinator' : 'ஒருங்கிணைப்பாளர்' },
    { color: '#A1887F', label: language === 'english' ? 'Health Sakhi' : 'ஆரோக்கிய சகி' },
    { color: '#2196F3', label: language === 'english' ? 'Customer' : 'வாடிக்கையாளர்' },
    { color: '#FFCA28', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' }
  ], [language]);

  // Calculate total customers
  const totalCustomers = useMemo(() => {
    return healthSakhis.reduce((total, sakhi) => {
      const customers = getCustomersByHealthSakhiId(sakhi.id);
      return total + customers.length;
    }, 0);
  }, [healthSakhis]);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Get coordinator data
        const coordinatorData = getCoordinatorById(currentUser.linkedId);
        setCoordinator(coordinatorData);
        
        if (coordinatorData) {
          // Get health sakhis data
          const healthSakhisData = getHealthSakhisByCoordinatorId(coordinatorData.id);
          setHealthSakhis(healthSakhisData);
          
          // Create markers array with coordinator marker
          const markersArray: MapMarker[] = [
            {
              id: coordinatorData.id,
              type: 'coordinator',
              latitude: coordinatorData.latitude,
              longitude: coordinatorData.longitude,
              title: coordinatorData.name,
              info: `District: ${coordinatorData.district}`
            }
          ];
          
          // Add health sakhi markers
          const sakhiMarkers = convertHealthSakhisToMarkers(healthSakhisData, {
            latitude: coordinatorData.latitude,
            longitude: coordinatorData.longitude
          });
          markersArray.push(...sakhiMarkers);
          
          setMarkers(markersArray);
        }
      } catch (error) {
        console.error('Error loading coordinator data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleSakhiClick = async (sakhi: HealthSakhi) => {
    setSelectedSakhi(sakhi);
    
    if (!coordinator) return;
    
    // Get customers and labs for the selected sakhi
    const customers = getCustomersByHealthSakhiId(sakhi.id);
    const labs = getNearbyLabs(sakhi.latitude, sakhi.longitude, 10);
    
    // Create markers array with coordinator, all health sakhis, and selected sakhi's customers/labs
    const markersArray: MapMarker[] = [
      // Add coordinator marker
      {
        id: coordinator.id,
        type: 'coordinator',
        latitude: coordinator.latitude,
        longitude: coordinator.longitude,
        title: coordinator.name,
        info: `District: ${coordinator.district}`
      }
    ];
    
    // Add all health sakhi markers
    const sakhiMarkers = convertHealthSakhisToMarkers(healthSakhis, {
      latitude: coordinator.latitude,
      longitude: coordinator.longitude
    });
    markersArray.push(...sakhiMarkers);
    
    // Add customer markers for selected sakhi
    const customerMarkers = convertCustomersToMarkers(customers, {
      latitude: sakhi.latitude,
      longitude: sakhi.longitude
    });
    markersArray.push(...customerMarkers);
    
    // Add lab markers
    const labMarkers = convertLabsToMarkers(labs, {
      latitude: sakhi.latitude,
      longitude: sakhi.longitude
    });
    markersArray.push(...labMarkers);
    
    setMarkers(markersArray);
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

  if (!coordinator) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium text-red-500">
          {language === 'english' ? 'Coordinator not found' : 'ஒருங்கிணைப்பாளர் கிடைக்கவில்லை'}
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
            {language === 'english' ? 'Welcome' : 'வரவேற்கிறோம்'}, {coordinator.name}
          </CardTitle>
          <CardDescription>
            {language === 'english' ? 'District Coordinator' : 'மாவட்ட ஒருங்கிணைப்பாளர்'}
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
            value="analysis" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {language === 'english' ? 'Analysis' : 'பகுப்பாய்வு'}
          </TabsTrigger>
          <TabsTrigger 
            value="health-sakhis" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            {language === 'english' ? 'Health Sakhis' : 'ஆரோக்கிய சகிகள்'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* District Summary and Coordinator Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* District Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'english' ? 'District Summary' : 'மாவட்ட சுருக்கம்'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'District' : 'மாவட்டம்'}:
                    </span>
                    <span className="font-medium">{coordinator.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Health Sakhis' : 'ஆரோக்கிய சகிகள்'}:
                    </span>
                    <span className="font-medium">{healthSakhis.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்'}:
                    </span>
                    <span className="font-medium">{totalCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Labs' : 'ஆய்வகங்கள்'}:
                    </span>
                    <span className="font-medium">15</span> {/* Replace 15 with actual labs count if available */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordinator Contact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'english' ? 'Coordinator Contact' : 'ஒருங்கிணைப்பாளர் தொடர்பு'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Name' : 'பெயர்'}:
                    </span>
                    <span className="font-medium">{coordinator.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Contact' : 'தொடர்பு'}:
                    </span>
                    <span className="font-medium">{coordinator.contactNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {language === 'english' ? 'Email' : 'மின்னஞ்சல்'}:
                    </span>
                    <span className="font-medium">{coordinator.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'english' ? 'Quick Stats' : 'விரைவு புள்ளிவிவரங்கள்'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  <span className="text-sm text-gray-600">{language === 'english' ? 'Average Coverage' : 'சராசரி ஆதரவு'}: </span>
                  <span className="font-medium">{mockAnalyticsData.coverage}%</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{language === 'english' ? 'Last Updated' : 'கடைசியாக புதுப்பிக்கப்பட்டது'}: </span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Health Sakhi Locations' : 'ஆரோக்கிய சகி இருப்பிடங்கள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
                <MapView 
                  markers={markers} 
                  center={{ latitude: coordinator.latitude, longitude: coordinator.longitude }}
                  height="500px"
                  showLegend={true}
                  legendItems={legendItems}
                  onMarkerClick={(marker) => {
                    if (marker.type === 'healthSakhi') {
                      const sakhi = healthSakhis.find(s => s.id === marker.id);
                      if (sakhi) handleSakhiClick(sakhi);
                    }
                  }}
                  selectedMarkerId={selectedSakhi?.id}
                >
                  {selectedSakhi && (
                    <ConcentricCircles
                      center={{ latitude: selectedSakhi.latitude, longitude: selectedSakhi.longitude }}
                      distances={[2, 5, 10]}
                      colors={['#4CAF50', '#FF9800', '#F44336']}
                      opacity={0.2}
                    />
                  )}
                </MapView>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Coverage Analysis' : 'ஆதரவு பகுப்பாய்வு'}
              </CardTitle>
              <CardDescription>
                {language === 'english' 
                  ? 'Analysis of health coverage and underserved zones' 
                  : 'ஆரோக்கிய ஆதரவு மற்றும் குறைந்த ஆதரவு மண்டலங்களின் பகுப்பாய்வு'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coverage Chart */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {language === 'english' ? 'Monthly Growth' : 'மாதாந்திர வளர்ச்சி'}
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockAnalyticsData.monthlyGrowth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="customers" 
                          stroke="#2E7D32" 
                          name={language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="healthSakhis" 
                          stroke="#2196F3" 
                          name={language === 'english' ? 'Health Sakhis' : 'ஆரோக்கிய சகிகள்'}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Underserved Zones */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {language === 'english' ? 'Underserved Zones' : 'குறைந்த ஆதரவு மண்டலங்கள்'}
                  </h3>
                  <div className="space-y-4">
                    {mockAnalyticsData.underservedZones.map((zone, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{zone.name}</h4>
                              <p className="text-sm text-gray-500">
                                {language === 'english' ? 'Population' : 'மக்கள் தொகை'}: {zone.population}
                              </p>
                            </div>
                            <Badge variant={zone.priority === 'High' ? 'destructive' : 'default'}>
                              {zone.priority}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{language === 'english' ? 'Coverage' : 'ஆதரவு'}</span>
                              <span>{zone.coverage}%</span>
                            </div>
                            <Progress value={zone.coverage} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-sakhis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthSakhis.map((sakhi) => (
              <Card key={sakhi.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSakhiClick(sakhi)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{sakhi.name}</CardTitle>
                  <CardDescription>{sakhi.village}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்'}</span>
                      <span>{getCustomersByHealthSakhiId(sakhi.id).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{language === 'english' ? 'Specializations' : 'சிறப்பு திறன்கள்'}</span>
                      <span>{sakhi.specializations.join(', ')}</span>
                    </div>
                    {sakhi.linkedLab && (
                      <div className="flex justify-between text-sm">
                        <span>{language === 'english' ? 'Linked Lab' : 'இணைக்கப்பட்ட ஆய்வகம்'}</span>
                        <span>{sakhi.linkedLab}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoordinatorDashboard;
