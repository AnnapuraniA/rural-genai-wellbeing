import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// Mock data for analytics
const mockAnalyticsData = {
  coverage: 72, // percentage
  underservedZones: [
    { name: 'Pennagaram South', priority: 'High' },
    { name: 'Harur East', priority: 'Medium' }
  ],
  monthlyGrowth: [
    { month: 'Jan', customers: 120 },
    { month: 'Feb', customers: 145 },
    { month: 'Mar', customers: 162 },
    { month: 'Apr', customers: 190 },
    { month: 'May', customers: 205 },
  ]
};

const CoordinatorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [coordinator, setCoordinator] = useState<Coordinator | null>(null);
  const [healthSakhis, setHealthSakhis] = useState<HealthSakhi[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedSakhi, setSelectedSakhi] = useState<HealthSakhi | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Custom legend items for coordinator dashboard
  const legendItems = [
    { color: '#2E7D32', label: language === 'english' ? 'Coordinator' : 'ஒருங்கிணைப்பாளர்' },
    { color: '#A1887F', label: language === 'english' ? 'Health Sakhi' : 'ஆரோக்கிய சகி' },
    { color: '#2196F3', label: language === 'english' ? 'Customer' : 'வாடிக்கையாளர்' },
    { color: '#FFCA28', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' }
  ];

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
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'english' ? 'Welcome' : 'வரவேற்கிறோம்'}, {coordinator.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'District' : 'மாவட்டம்'}: {coordinator.district}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'english' ? 'Health Sakhis' : 'ஆரோக்கிய சகிகள்'}: {healthSakhis.length}
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
          <TabsTrigger value="analysis">
            {language === 'english' ? 'Health Sakhi Analysis' : 'ஆரோக்கிய சகி பகுப்பாய்வு'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="pt-4">
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

        <TabsContent value="analysis" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Health Sakhi Analysis' : 'ஆரோக்கிய சகி பகுப்பாய்வு'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HealthSakhiAnalyzer 
                healthSakhis={healthSakhis}
                onSakhiSelect={handleSakhiClick}
                selectedSakhi={selectedSakhi}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoordinatorDashboard;
