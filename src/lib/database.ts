
// This file simulates a database with TypeScript types and dummy data

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: 'coordinator' | 'health_sakhi' | 'customer' | 'lab';
  linkedId: string;
  name: string;
  profilePic?: string;
  languages: ('tamil' | 'english')[];
  createdAt: string;
}

export interface Coordinator {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  district: string;
  linkedHealthSakhis: string[]; // IDs of linked health sakhis
  contactNumber: string;
  email: string;
}

export interface HealthSakhi {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  village: string;
  linkedCoordinator: string; // ID of the coordinator
  linkedCustomers: string[]; // IDs of linked customers
  contactNumber: string;
  specializations: string[];
}

export interface Customer {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  village: string;
  linkedHealthSakhi?: string; // ID of the health sakhi if within 10km
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  medicalHistory: MedicalRecord[];
}

export interface MedicalRecord {
  id: string;
  date: string;
  symptoms: string;
  diagnosis?: string;
  prescriptions?: string;
  labTests?: LabTest[];
}

export interface LabTest {
  id: string;
  labId: string;
  testName: string;
  date: string;
  results?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Lab {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  contactNumber: string;
  services: string[];
  workingHours: string;
  workingDays: string[];
}

// Generate dummy data
function generateUsers(): User[] {
  const users: User[] = [];
  
  // Coordinators
  for (let i = 0; i < 8; i++) {
    users.push({
      id: `coor-${i + 1}`,
      username: `coordinator${i + 1}`,
      password: 'password123', // In real app, would be hashed
      role: 'coordinator',
      linkedId: `coor-${i + 1}`,
      name: `Coordinator ${i + 1}`,
      languages: ['tamil', 'english'],
      createdAt: new Date(2023, i, 1).toISOString()
    });
  }
  
  // Health Sakhis
  for (let i = 0; i < 20; i++) {
    users.push({
      id: `hs-${i + 1}`,
      username: `sakhi${i + 1}`,
      password: 'password123',
      role: 'health_sakhi',
      linkedId: `hs-${i + 1}`,
      name: `Health Sakhi ${i + 1}`,
      languages: i % 3 === 0 ? ['tamil'] : ['tamil', 'english'],
      createdAt: new Date(2023, Math.floor(i / 3), 15).toISOString()
    });
  }
  
  // Customers (only adding 50 for simplicity)
  for (let i = 0; i < 50; i++) {
    users.push({
      id: `cust-${i + 1}`,
      username: `customer${i + 1}`,
      password: 'password123',
      role: 'customer',
      linkedId: `cust-${i + 1}`,
      name: `Customer ${i + 1}`,
      languages: i % 4 === 0 ? ['english'] : ['tamil'],
      createdAt: new Date(2023, Math.floor(i / 10), i % 28 + 1).toISOString()
    });
  }
  
  // Labs
  for (let i = 0; i < 15; i++) {
    users.push({
      id: `lab-${i + 1}`,
      username: `lab${i + 1}`,
      password: 'password123',
      role: 'lab',
      linkedId: `lab-${i + 1}`,
      name: `Lab ${i + 1}`,
      languages: ['tamil', 'english'],
      createdAt: new Date(2023, Math.floor(i / 5), 10).toISOString()
    });
  }
  
  return users;
}

// Dharmapuri district coordinates as center point
const baseLatitude = 12.1289;
const baseLongitude = 78.1578;

// Generate random coordinates within a radius
function generateRandomCoordinates(baseLat: number, baseLng: number, radiusInKm: number) {
  // Earth's radius in km
  const earthRadius = 6371;
  
  // Convert radius from km to radians
  const radiusInRadians = radiusInKm / earthRadius;
  
  // Generate a random angle in radians
  const randomAngle = Math.random() * 2 * Math.PI;
  
  // Generate a random radius within the given radius
  const randomRadius = Math.sqrt(Math.random()) * radiusInRadians;
  
  // Calculate new latitude
  const newLat = baseLat + randomRadius * Math.cos(randomAngle) * (180 / Math.PI);
  
  // Calculate new longitude
  const newLng = baseLng + randomRadius * Math.sin(randomAngle) * (180 / Math.PI) / Math.cos(baseLat * Math.PI / 180);
  
  return { latitude: newLat, longitude: newLng };
}

// Calculate distance between two points in km
export function calculateDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function generateCoordinators(): Coordinator[] {
  const coordinators: Coordinator[] = [];
  
  for (let i = 0; i < 8; i++) {
    // Generate coordinates for coordinators in different parts of Dharmapuri
    const { latitude, longitude } = generateRandomCoordinates(baseLatitude, baseLongitude, 20);
    
    coordinators.push({
      id: `coor-${i + 1}`,
      name: `Coordinator ${i + 1}`,
      latitude,
      longitude,
      district: 'Dharmapuri',
      linkedHealthSakhis: [],
      contactNumber: `+91 9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      email: `coordinator${i+1}@wellnet.org`
    });
  }
  
  return coordinators;
}

function generateHealthSakhis(coordinators: Coordinator[]): HealthSakhi[] {
  const healthSakhis: HealthSakhi[] = [];
  const villages = [
    'Pennagaram', 'Palacode', 'Harur', 'Karimangalam', 
    'Nallampalli', 'Morappur', 'Pappireddipatti', 'Dharmapuri'
  ];
  
  for (let i = 0; i < 20; i++) {
    // Assign to a random coordinator
    const randomCoordinatorIndex = Math.floor(Math.random() * coordinators.length);
    const linkedCoordinator = coordinators[randomCoordinatorIndex].id;
    
    // Generate coordinates within 20km of the coordinator
    const { latitude, longitude } = generateRandomCoordinates(
      coordinators[randomCoordinatorIndex].latitude,
      coordinators[randomCoordinatorIndex].longitude,
      20
    );
    
    const specializations = [
      'Maternal Care', 'Child Health', 'First Aid', 'Nutrition', 
      'Preventive Care', 'Basic Medicine', 'Health Education'
    ];
    
    const randomSpecializations = [];
    for (let j = 0; j < 2 + Math.floor(Math.random() * 3); j++) {
      const randomSpecialization = specializations[Math.floor(Math.random() * specializations.length)];
      if (!randomSpecializations.includes(randomSpecialization)) {
        randomSpecializations.push(randomSpecialization);
      }
    }
    
    const healthSakhi = {
      id: `hs-${i + 1}`,
      name: `Health Sakhi ${i + 1}`,
      latitude,
      longitude,
      village: villages[Math.floor(Math.random() * villages.length)],
      linkedCoordinator,
      linkedCustomers: [],
      contactNumber: `+91 8${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      specializations: randomSpecializations
    };
    
    // Add this health sakhi to the coordinator's linked health sakhis
    coordinators[randomCoordinatorIndex].linkedHealthSakhis.push(healthSakhi.id);
    
    healthSakhis.push(healthSakhi);
  }
  
  return healthSakhis;
}

function generateLabs(): Lab[] {
  const labs: Lab[] = [];
  const labServices = [
    'Blood Tests', 'Urine Analysis', 'X-Ray', 'Ultrasound', 
    'ECG', 'Basic Health Checkup', 'Diabetes Screening', 
    'Pregnancy Test', 'Hemoglobin Test', 'Malaria Test'
  ];
  
  for (let i = 0; i < 15; i++) {
    // Generate coordinates within 30km of Dharmapuri
    const { latitude, longitude } = generateRandomCoordinates(baseLatitude, baseLongitude, 30);
    
    const randomServices = [];
    for (let j = 0; j < 3 + Math.floor(Math.random() * 5); j++) {
      const randomService = labServices[Math.floor(Math.random() * labServices.length)];
      if (!randomServices.includes(randomService)) {
        randomServices.push(randomService);
      }
    }
    
    const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    if (Math.random() > 0.3) workingDays.push('Saturday');
    if (Math.random() > 0.7) workingDays.push('Sunday');
    
    labs.push({
      id: `lab-${i + 1}`,
      name: `Health Lab ${i + 1}`,
      latitude,
      longitude,
      address: `${Math.floor(Math.random() * 100) + 1}, Main Road, ${
        ['Pennagaram', 'Palacode', 'Harur', 'Karimangalam', 'Dharmapuri'][Math.floor(Math.random() * 5)]
      }`,
      contactNumber: `+91 7${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      services: randomServices,
      workingHours: `${8 + Math.floor(Math.random() * 2)}:00 AM - ${4 + Math.floor(Math.random() * 4)}:00 PM`,
      workingDays
    });
  }
  
  return labs;
}

function generateMedicalRecords(customerId: string, labs: Lab[]): MedicalRecord[] {
  const records: MedicalRecord[] = [];
  const numRecords = Math.floor(Math.random() * 3); // 0 to 2 records per customer
  
  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Body pain',
    'Joint pain', 'Sore throat', 'Cold', 'Stomachache', 'Dizziness'
  ];
  
  const commonDiagnosis = [
    'Common cold', 'Viral fever', 'Bacterial infection', 'Dehydration',
    'Vitamin deficiency', 'Anemia', 'Gastritis', 'Migraine', 'Allergic reaction'
  ];
  
  const commonPrescriptions = [
    'Paracetamol, twice daily for 3 days',
    'Rest and increase fluid intake',
    'Vitamin B12 supplements daily',
    'Iron supplements daily for 1 month',
    'Antibiotics, three times daily after food for 5 days',
    'ORS solution as needed',
    'Pain relievers as needed'
  ];
  
  const labTestNames = [
    'Complete Blood Count (CBC)', 'Blood Sugar Test', 'Hemoglobin Test',
    'Urine Analysis', 'Thyroid Function Test', 'Malaria Test'
  ];
  
  for (let i = 0; i < numRecords; i++) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 180)); // Random date in last 6 months
    
    const randomSymptoms = commonSymptoms[Math.floor(Math.random() * commonSymptoms.length)];
    const randomDiagnosis = Math.random() > 0.3 ? commonDiagnosis[Math.floor(Math.random() * commonDiagnosis.length)] : undefined;
    const randomPrescription = Math.random() > 0.3 ? commonPrescriptions[Math.floor(Math.random() * commonPrescriptions.length)] : undefined;
    
    const labTests: LabTest[] = [];
    if (Math.random() > 0.5) {
      const randomLab = labs[Math.floor(Math.random() * labs.length)];
      const testName = labTestNames[Math.floor(Math.random() * labTestNames.length)];
      const testDate = new Date(pastDate);
      testDate.setDate(testDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after record date
      
      const labTest: LabTest = {
        id: `test-${customerId}-${i}`,
        labId: randomLab.id,
        testName,
        date: testDate.toISOString(),
        status: Math.random() > 0.3 ? 'completed' : 'scheduled',
      };
      
      if (labTest.status === 'completed') {
        labTest.results = `Results for ${testName}. ${Math.random() > 0.8 ? 'Abnormal values detected.' : 'All values within normal range.'}`;
      }
      
      labTests.push(labTest);
    }
    
    records.push({
      id: `record-${customerId}-${i}`,
      date: pastDate.toISOString(),
      symptoms: randomSymptoms,
      diagnosis: randomDiagnosis,
      prescriptions: randomPrescription,
      labTests: labTests.length > 0 ? labTests : undefined
    });
  }
  
  return records;
}

function generateCustomers(healthSakhis: HealthSakhi[], labs: Lab[]): Customer[] {
  const customers: Customer[] = [];
  
  for (let i = 0; i < 500; i++) {
    // Generate random coordinates within 30km of Dharmapuri
    const { latitude, longitude } = generateRandomCoordinates(baseLatitude, baseLongitude, 30);
    
    // Find nearest health sakhi within 10km
    let nearestHealthSakhi: string | undefined;
    let minDistance = Infinity;
    
    for (const sakhi of healthSakhis) {
      const distance = calculateDistanceInKm(latitude, longitude, sakhi.latitude, sakhi.longitude);
      if (distance <= 10 && distance < minDistance) {
        minDistance = distance;
        nearestHealthSakhi = sakhi.id;
      }
    }
    
    // If a health sakhi is found, add this customer to their linked customers
    if (nearestHealthSakhi) {
      const sakhiIndex = healthSakhis.findIndex(s => s.id === nearestHealthSakhi);
      if (sakhiIndex !== -1) {
        healthSakhis[sakhiIndex].linkedCustomers.push(`cust-${i + 1}`);
      }
    }
    
    const villages = [
      'Pennagaram', 'Palacode', 'Harur', 'Karimangalam', 
      'Nallampalli', 'Morappur', 'Pappireddipatti', 'Dharmapuri',
      'Kadathur', 'Velur', 'Papparapatti', 'Hogenakkal'
    ];
    
    const customer: Customer = {
      id: `cust-${i + 1}`,
      name: `Customer ${i + 1}`,
      latitude,
      longitude,
      village: villages[Math.floor(Math.random() * villages.length)],
      linkedHealthSakhi: nearestHealthSakhi,
      age: 18 + Math.floor(Math.random() * 60), // Age between 18 and 77
      gender: ['male', 'female', 'other'][Math.floor(Math.random() * 2.1)] as 'male' | 'female' | 'other',
      contactNumber: `+91 6${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      medicalHistory: []
    };
    
    // Generate medical records for this customer
    customer.medicalHistory = generateMedicalRecords(customer.id, labs);
    
    customers.push(customer);
  }
  
  return customers;
}

// Generate all data
const coordinators = generateCoordinators();
const healthSakhis = generateHealthSakhis(coordinators);
const labs = generateLabs();
const customers = generateCustomers(healthSakhis, labs);
const users = generateUsers();

// Export the dummy data
export const dummyData = {
  users,
  coordinators,
  healthSakhis,
  customers,
  labs
};

// Export functions to get data
export const getUserByCredentials = (username: string, password: string): User | undefined => {
  return dummyData.users.find(user => user.username === username && user.password === password);
};

export const getCoordinatorById = (id: string): Coordinator | undefined => {
  return dummyData.coordinators.find(coordinator => coordinator.id === id);
};

export const getHealthSakhiById = (id: string): HealthSakhi | undefined => {
  return dummyData.healthSakhis.find(sakhi => sakhi.id === id);
};

export const getCustomerById = (id: string): Customer | undefined => {
  return dummyData.customers.find(customer => customer.id === id);
};

export const getLabById = (id: string): Lab | undefined => {
  return dummyData.labs.find(lab => lab.id === id);
};

export const getHealthSakhisByCoordinatorId = (coordinatorId: string): HealthSakhi[] => {
  const coordinator = dummyData.coordinators.find(c => c.id === coordinatorId);
  if (!coordinator) return [];
  return dummyData.healthSakhis.filter(sakhi => coordinator.linkedHealthSakhis.includes(sakhi.id));
};

export const getCustomersByHealthSakhiId = (healthSakhiId: string): Customer[] => {
  return dummyData.customers.filter(customer => customer.linkedHealthSakhi === healthSakhiId);
};

export const getNearbyLabs = (latitude: number, longitude: number, radiusInKm: number): Lab[] => {
  return dummyData.labs.filter(lab => {
    const distance = calculateDistanceInKm(latitude, longitude, lab.latitude, lab.longitude);
    return distance <= radiusInKm;
  });
};

// Save data in localStorage for persistence between page refreshes
export const saveAuthToLocalStorage = (user: User) => {
  localStorage.setItem('wellnet_user', JSON.stringify(user));
};

export const getAuthFromLocalStorage = (): User | null => {
  const userData = localStorage.getItem('wellnet_user');
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthFromLocalStorage = () => {
  localStorage.removeItem('wellnet_user');
};
