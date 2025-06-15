import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getLabById,
  getLabAppointments, 
  getLabMessages,
  sendMessage,
  updateAppointmentStatus,
  type Message,
  type Appointment,
  type Lab
} from "@/lib/database";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface TestResult {
  id: string;
  appointmentId: string;
  testName: string;
  result: string;
  notes: string;
  timestamp: string;
}

export default function LabDashboard() {
  const { currentUser } = useAuth();
  const [lab, setLab] = useState<Lab | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Appointment | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [testResult, setTestResult] = useState<{
    testName: string;
    results: Record<string, string>;
    notes: string;
  }>({
    testName: '',
    results: {},
    notes: ''
  });

  useEffect(() => {
    if (currentUser?.linkedId) {
    const loadData = async () => {
        const labData = await getLabById(currentUser.linkedId);
        setLab(labData);
        
        const appointmentsData = await getLabAppointments(currentUser.linkedId);
        setAppointments(appointmentsData);
        
        const messagesData = await getLabMessages(currentUser.linkedId);
        setMessages(messagesData);
      };
    loadData();
    }
  }, [currentUser]);

  const handleSendMessage = async () => {
    if (!selectedCustomer || !newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      fromId: currentUser?.linkedId || '',
      fromName: lab?.name || '',
      fromType: 'lab',
      toId: selectedCustomer.customerId,
      toName: selectedCustomer.customerName,
      toType: 'customer',
      subject: 'Test Results',
      content: newMessage,
      type: 'result',
      date: new Date().toISOString(),
      status: 'unread'
    };
    
    await sendMessage(message);
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: 'completed' | 'cancelled') => {
    await updateAppointmentStatus(appointmentId, status);
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status } : apt
    ));
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    handleUpdateAppointmentStatus(appointmentId, 'completed');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    handleUpdateAppointmentStatus(appointmentId, 'cancelled');
  };

  const handleAddTestResult = async (appointmentId: string) => {
    if (!testResult.testName || Object.keys(testResult.results).length === 0) return;

    const result: TestResult = {
      id: Date.now().toString(),
      appointmentId,
      testName: testResult.testName,
      result: JSON.stringify(testResult.results),
      notes: testResult.notes,
      date: new Date().toISOString()
    };

    // Update appointment with results
    await updateAppointmentStatus(appointmentId, 'completed', JSON.stringify(testResult.results));
    setTestResult({ testName: '', results: {}, notes: '' });
    setSelectedCustomer(null);
    
    // Send notification to customer
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      const message: Message = {
        id: Date.now().toString(),
        fromId: currentUser?.linkedId || '',
        fromName: lab?.name || '',
        fromType: 'lab',
        toId: appointment.customerId,
        toName: appointment.customerName,
        toType: 'customer',
        subject: 'Test Results Ready',
        content: `Your test results for ${testResult.testName} are ready. Please check your dashboard.`,
        type: 'result',
        date: new Date().toISOString(),
        status: 'unread'
      };
      await sendMessage(message);
      setMessages([...messages, message]);
    }
  };

  const today = new Date();
  const todayAppointments = appointments.filter(apt => 
    new Date(apt.date).toDateString() === today.toDateString()
  );
  const pendingResults = appointments.filter(apt => 
    apt.status === 'completed' && !apt.results
  );

  // Add some sample data for demonstration
  const sampleAppointments = [
    {
      id: '1',
      customerId: '1',
      customerName: 'Priya Sharma',
      healthSakhiId: '1',
      healthSakhiName: 'Meera Patel',
      testName: 'Blood Test',
      date: new Date().toISOString(),
      status: 'pending' as const,
      results: null
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Rajesh Kumar',
      healthSakhiId: '1',
      healthSakhiName: 'Meera Patel',
      testName: 'Diabetes Screening',
      date: new Date().toISOString(),
      status: 'completed' as const,
      results: null
    }
  ];

  const sampleTestResults = [
    {
      id: '1',
      appointmentId: '1',
      patientName: 'Priya Sharma',
      testName: 'Blood Test',
      results: {
        hemoglobin: '12.5 g/dL',
        glucose: '95 mg/dL',
        cholesterol: '180 mg/dL'
      } as Record<string, string>,
      notes: 'All values within normal range',
      date: new Date().toISOString()
    },
    {
      id: '2',
      appointmentId: '2',
      patientName: 'Rajesh Kumar',
      testName: 'Diabetes Screening',
      results: {
        fastingGlucose: '110 mg/dL',
        hba1c: '6.2%',
        randomGlucose: '140 mg/dL'
      } as Record<string, string>,
      notes: 'Slightly elevated glucose levels. Recommend follow-up.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    }
  ];

  const samplePatientHistory = [
    {
      id: '1',
      patientName: 'Priya Sharma',
      tests: [
        {
          id: '1',
          testName: 'Blood Test',
          date: new Date().toISOString(),
          results: {
            hemoglobin: '12.5 g/dL',
            glucose: '95 mg/dL',
            cholesterol: '180 mg/dL'
          } as Record<string, string>,
          notes: 'All values within normal range'
        },
        {
          id: '2',
          testName: 'Complete Blood Count',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          results: {
            wbc: '7.5 x10^9/L',
            rbc: '4.8 x10^12/L',
            platelets: '250 x10^9/L'
          } as Record<string, string>,
          notes: 'Normal CBC results'
        }
      ]
    },
    {
      id: '2',
      patientName: 'Rajesh Kumar',
      tests: [
        {
          id: '3',
          testName: 'Diabetes Screening',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          results: {
            fastingGlucose: '110 mg/dL',
            hba1c: '6.2%',
            randomGlucose: '140 mg/dL'
          } as Record<string, string>,
          notes: 'Slightly elevated glucose levels. Recommend follow-up.'
        },
        {
          id: '4',
          testName: 'Lipid Profile',
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          results: {
            totalCholesterol: '220 mg/dL',
            hdl: '45 mg/dL',
            ldl: '140 mg/dL',
            triglycerides: '180 mg/dL'
          } as Record<string, string>,
          notes: 'Borderline high cholesterol. Lifestyle modifications recommended.'
        }
      ]
    }
  ];

  if (!lab) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {lab?.name}</h1>
        <p className="text-gray-600 mt-2">Manage your lab operations and test results here.</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
          <div className="mt-4 space-y-4">
            {sampleAppointments.map(apt => (
              <div key={apt.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{apt.customerName}</p>
                    <p className="text-sm text-gray-600">{apt.testName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant={apt.status === 'completed' ? 'default' : 'secondary'}>
                    {apt.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Results</h3>
          <div className="mt-4 space-y-4">
            {sampleAppointments.filter(apt => apt.status === 'completed' && !apt.results).map(apt => (
              <div key={apt.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{apt.customerName}</p>
                    <p className="text-sm text-gray-600">{apt.testName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTestResult(apt.id)}
                  >
                    Add Results
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Lab Information</h3>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address:</span> {lab?.address}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Contact:</span> {lab?.contactNumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Services:</span> {lab?.services.join(', ')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
          <TabsTrigger value="patient-history">Patient History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
              <div className="mt-4 space-y-4">
                {sampleAppointments.map(apt => (
                  <div key={apt.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{apt.customerName}</p>
                        <p className="text-sm text-gray-600">{apt.testName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(apt.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {apt.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompleteAppointment(apt.id)}
                            >
                              Complete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(apt.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="test-results" className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
              <div className="mt-4 space-y-4">
                {sampleTestResults.map(result => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{result.patientName}</p>
                        <p className="text-sm text-gray-600">{result.testName}</p>
                        <div className="mt-2 space-y-1">
                          {Object.entries(result.results).map(([key, value]) => (
                            <p key={key} className="text-sm text-gray-600">
                              <span className="font-medium">{key}:</span> {value}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(result.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{result.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patient-history" className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Patient History</h3>
              <div className="mt-4 space-y-6">
                {samplePatientHistory.map(patient => (
                  <div key={patient.id} className="border rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">{patient.patientName}</h4>
                    <div className="space-y-4">
                      {patient.tests.map(test => (
                        <div key={test.id} className="border-l-2 border-gray-200 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{test.testName}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(test.date).toLocaleDateString()}
                              </p>
                              <div className="mt-2 space-y-1">
                                {Object.entries(test.results).map(([key, value]) => (
                                  <p key={key} className="text-sm text-gray-600">
                                    <span className="font-medium">{key}:</span> {value}
                                  </p>
                                ))}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{test.notes}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Result Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Test Results for {selectedCustomer.customerName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Test Name</Label>
                <Input
                  value={testResult.testName}
                  onChange={(e) => setTestResult({ ...testResult, testName: e.target.value })}
                  placeholder="Enter test name"
                />
              </div>
              <div className="space-y-2">
                <Label>Results</Label>
                <div className="space-y-2">
                  {Object.entries(testResult.results || {}).map(([key, value], index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const newResults = { ...testResult.results };
                          delete newResults[key];
                          newResults[e.target.value] = value;
                          setTestResult({ ...testResult, results: newResults });
                        }}
                        placeholder="Parameter"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          setTestResult({
                            ...testResult,
                            results: { ...testResult.results, [key]: e.target.value }
                          });
                        }}
                        placeholder="Value"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newResults = { ...testResult.results };
                          delete newResults[key];
                          setTestResult({ ...testResult, results: newResults });
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTestResult({
                        ...testResult,
                        results: { ...testResult.results, '': '' }
                      });
                    }}
                  >
                    Add Parameter
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={testResult.notes}
                  onChange={(e) => setTestResult({ ...testResult, notes: e.target.value })}
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleAddTestResult(selectedCustomer.id)}>
                Save Results
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

