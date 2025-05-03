
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getCoordinatorById, getHealthSakhisByCoordinatorId } from '@/lib/database';
import { convertHealthSakhisToMarkers } from '@/lib/mapServices';
import MapView from '@/components/MapView';
import { Progress } from "@/components/ui/progress";

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
  const [coordinator, setCoordinator] = useState<any>(null);
  const [healthSakhis, setHealthSakhis] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedSakhi, setSelectedSakhi] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        // Get coordinator data
        const coordinatorData = getCoordinatorById(currentUser.linkedId);
        setCoordinator(coordinatorData);
        
        if (coordinatorData) {
          // Get health sakhis data
          const healthSakhisData = getHealthSakhisByCoordinatorId(coordinatorData.id);
          setHealthSakhis(healthSakhisData);
          
          // Convert health sakhis to map markers
          const healthSakhisMarkers = convertHealthSakhisToMarkers(healthSakhisData, {
            latitude: coordinatorData.latitude,
            longitude: coordinatorData.longitude
          });
          setMarkers(healthSakhisMarkers);
        }
      } catch (error) {
        console.error('Error loading coordinator data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (!coordinator) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg font-medium">Coordinator data not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coordinator Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Health Sakhis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{healthSakhis.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthSakhis.length} health sakhis in your district
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Area Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockAnalyticsData.coverage}%</div>
            <Progress value={mockAnalyticsData.coverage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {100 - mockAnalyticsData.coverage}% of your area still needs coverage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{mockAnalyticsData.monthlyGrowth[4].customers - mockAnalyticsData.monthlyGrowth[3].customers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              New customers this month
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
            value="list" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            Health Sakhis
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Health Sakhi Locations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MapView 
                markers={markers} 
                center={{ latitude: coordinator.latitude, longitude: coordinator.longitude }}
                height="500px"
                onMarkerClick={(marker) => setSelectedSakhi(marker.id)}
                selectedMarkerId={selectedSakhi || undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Sakhis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Village</th>
                      <th className="pb-2">Specializations</th>
                      <th className="pb-2 text-right">Customers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthSakhis.map((sakhi) => (
                      <tr key={sakhi.id} className="border-b">
                        <td className="py-3">{sakhi.name}</td>
                        <td>{sakhi.village}</td>
                        <td>{sakhi.specializations.join(', ')}</td>
                        <td className="text-right">{sakhi.linkedCustomers.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {mockAnalyticsData.monthlyGrowth.map((month) => (
                    <div key={month.month} className="flex flex-col items-center">
                      <div className="w-12 bg-wellnet-green rounded-t-md" style={{ 
                        height: `${(month.customers / 250) * 100}%` 
                      }}></div>
                      <div className="mt-2 text-xs font-medium">{month.month}</div>
                      <div className="text-xs text-muted-foreground">{month.customers}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Underserved Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {mockAnalyticsData.underservedZones.map((zone) => (
                    <li key={zone.name} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">{zone.name}</h4>
                        <p className="text-xs text-muted-foreground">Needs additional coverage</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        zone.priority === 'High' 
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {zone.priority} Priority
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">AI-Generated Suggestion</h4>
                  <p className="text-sm">
                    Consider recruiting 2 more Health Sakhis for Pennagaram South and 1 for Harur East
                    to improve health coverage in these areas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoordinatorDashboard;
