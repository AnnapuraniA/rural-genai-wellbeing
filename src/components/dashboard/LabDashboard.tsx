
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getLabById, getCustomerById } from '@/lib/database';
import MapView from '@/components/MapView';
import { convertCustomersToMarkers, MapMarker } from '@/lib/mapServices';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Generate some mock referrals data
const generateMockReferrals = (labId: string) => {
  const referrals = [];
  const statuses = ['pending', 'completed', 'scheduled'];
  
  for (let i = 1; i <= 10; i++) {
    referrals.push({
      id: `ref-${i}`,
      customerId: `cust-${Math.floor(Math.random() * 50) + 1}`,
      labId,
      referredBy: `hs-${Math.floor(Math.random() * 20) + 1}`,
      testType: ['Blood Test', 'X-Ray', 'Ultrasound', 'ECG'][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: Math.random() > 0.5 ? 'Priority case' : undefined
    });
  }
  
  return referrals;
};

const LabDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [lab, setLab] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerMarkers, setCustomerMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTabStatus, setSelectedTabStatus] = useState('all');
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const loadData = async () => {
      try {
        // Get lab data
        const labData = getLabById(currentUser.linkedId);
        setLab(labData);
        
        if (labData) {
          // Set services from lab data
          setServices(labData.services);
          
          // Generate mock referrals
          const mockReferrals = generateMockReferrals(labData.id);
          setReferrals(mockReferrals);
          
          // Get customers from referrals
          const customerIds = [...new Set(mockReferrals.map(ref => ref.customerId))];
          const customersData = customerIds.map(id => getCustomerById(id)).filter(Boolean);
          setCustomers(customersData);
          
          // Convert customers to map markers
          const custMarkers = convertCustomersToMarkers(customersData, {
            latitude: labData.latitude,
            longitude: labData.longitude
          });
          setCustomerMarkers(custMarkers);
        }
      } catch (error) {
        console.error('Error loading lab data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleServiceToggle = (service: string) => {
    setServices(prevServices => {
      if (prevServices.includes(service)) {
        return prevServices.filter(s => s !== service);
      } else {
        return [...prevServices, service];
      }
    });
  };

  const filteredReferrals = selectedTabStatus === 'all' 
    ? referrals 
    : referrals.filter(ref => ref.status === selectedTabStatus);

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
        <p className="text-lg font-medium">Lab data not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lab Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {referrals.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {referrals.filter(r => r.status === 'scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Upcoming appointments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {referrals.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully processed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="referrals" onValueChange={(value) => {
        if (['all', 'pending', 'scheduled', 'completed'].includes(value)) {
          setSelectedTabStatus(value);
        }
      }}>
        <TabsList className="w-full bg-card border-b rounded-none justify-start h-auto p-0">
          <TabsTrigger 
            value="referrals" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            Referrals & Tests
          </TabsTrigger>
          <TabsTrigger 
            value="map" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            Customer Map
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-wellnet-green rounded-none px-4 py-2"
          >
            Manage Services
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="referrals" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Test Referrals</CardTitle>
                <div className="flex space-x-2">
                  <TabsList>
                    <TabsTrigger value="all" className="px-3">All</TabsTrigger>
                    <TabsTrigger value="pending" className="px-3">Pending</TabsTrigger>
                    <TabsTrigger value="scheduled" className="px-3">Scheduled</TabsTrigger>
                    <TabsTrigger value="completed" className="px-3">Completed</TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Test Type</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferrals.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center">No referrals found</td>
                      </tr>
                    ) : (
                      filteredReferrals.map((referral) => {
                        const customer = customers.find(c => c.id === referral.customerId);
                        return (
                          <tr key={referral.id} className="border-b">
                            <td className="py-3">
                              {customer ? customer.name : 'Unknown Customer'}
                              {referral.notes && (
                                <div className="text-xs text-red-500 font-medium mt-1">
                                  {referral.notes}
                                </div>
                              )}
                            </td>
                            <td>{referral.testType}</td>
                            <td>{new Date(referral.date).toLocaleDateString()}</td>
                            <td>
                              <Badge className={`
                                ${referral.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                ${referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${referral.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                              `}>
                                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                              </Badge>
                            </td>
                            <td>
                              {referral.status === 'pending' && (
                                <Button size="sm" variant="outline">Schedule</Button>
                              )}
                              {referral.status === 'scheduled' && (
                                <Button size="sm" variant="outline">Complete</Button>
                              )}
                              {referral.status === 'completed' && (
                                <Button size="sm" variant="outline">View Results</Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="pt-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Customer Locations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MapView 
                markers={customerMarkers}
                center={{ latitude: lab.latitude, longitude: lab.longitude }}
                height="500px"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Available Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Blood Tests', 'Urine Analysis', 'X-Ray', 'Ultrasound', 
                      'ECG', 'Basic Health Checkup', 'Diabetes Screening', 
                      'Pregnancy Test', 'Hemoglobin Test', 'Malaria Test'
                    ].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`service-${service}`}
                          checked={services.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <Label htmlFor={`service-${service}`}>{service}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Working Hours</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="working-hours">Hours</Label>
                      <input 
                        id="working-hours"
                        type="text"
                        value={lab.workingHours}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label>Working Days</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`day-${day}`}
                              checked={lab.workingDays.includes(day)}
                              disabled
                            />
                            <Label htmlFor={`day-${day}`}>{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button className="bg-wellnet-green hover:bg-wellnet-green/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabDashboard;
