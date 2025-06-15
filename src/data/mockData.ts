import { TestResult, Message, Video, HealthSakhi, Lab } from '../types';

export const mockCustomerData = {
  id: 'CUST001',
  name: 'Priya Sharma',
  age: 45,
  gender: 'Female',
  location: {
    lat: 19.0760,
    lng: 72.8777,
    address: 'Mumbai, Maharashtra'
  },
  phone: '+91 98765 43210',
  email: 'priya.sharma@example.com',
  emergencyContact: {
    name: 'Rajesh Sharma',
    phone: '+91 98765 43211',
    relationship: 'Spouse'
  }
};

export const mockHealthSakhiData: HealthSakhi = {
  id: 'HS001',
  name: 'Dr. Meera Patel',
  specialization: 'General Medicine',
  experience: '15 years',
  location: {
    lat: 19.0765,
    lng: 72.8780,
    address: 'Andheri West, Mumbai'
  },
  phone: '+91 98765 43212',
  email: 'dr.meera@healthsakhi.com',
  availability: 'Mon-Sat, 9 AM - 6 PM',
  rating: 4.8,
  reviews: 156
};

export const mockLabData: Lab[] = [
  {
    id: 'LAB001',
    name: 'HealthFirst Diagnostics',
    location: {
      lat: 19.0755,
      lng: 72.8770,
      address: 'Andheri East, Mumbai'
    },
    phone: '+91 98765 43213',
    email: 'info@healthfirst.com',
    tests: ['Blood Tests', 'X-Ray', 'ECG'],
    rating: 4.5,
    reviews: 89
  },
  {
    id: 'LAB002',
    name: 'MediCare Labs',
    location: {
      lat: 19.0762,
      lng: 72.8775,
      address: 'Vile Parle, Mumbai'
    },
    phone: '+91 98765 43214',
    email: 'contact@medicare.com',
    tests: ['Blood Tests', 'MRI', 'CT Scan'],
    rating: 4.7,
    reviews: 124
  }
];

export const mockTestResults: TestResult[] = [
  {
    id: 'TEST001',
    date: '2024-03-15',
    type: 'Blood Test',
    results: [
      { name: 'Hemoglobin', value: '12.5 g/dL', normalRange: '11.5-15.5 g/dL', status: 'normal' },
      { name: 'Blood Sugar', value: '95 mg/dL', normalRange: '70-100 mg/dL', status: 'normal' },
      { name: 'Cholesterol', value: '180 mg/dL', normalRange: '125-200 mg/dL', status: 'normal' }
    ],
    notes: 'All parameters within normal range. Continue current diet and exercise routine.'
  },
  {
    id: 'TEST002',
    date: '2024-02-28',
    type: 'ECG',
    results: [
      { name: 'Heart Rate', value: '72 bpm', normalRange: '60-100 bpm', status: 'normal' },
      { name: 'Rhythm', value: 'Regular', normalRange: 'Regular', status: 'normal' }
    ],
    notes: 'Normal sinus rhythm. No abnormalities detected.'
  }
];

export const mockVideos = {
  emergencyCare: [
    {
      id: 'VID001',
      title: 'CPR Training',
      description: 'Learn the essential steps of Cardiopulmonary Resuscitation (CPR) for adults and children.',
      thumbnail: '/videos/cpr-thumbnail.jpg',
      duration: '10:30',
      url: 'https://example.com/videos/cpr-training'
    },
    {
      id: 'VID002',
      title: 'First Aid Basics',
      description: 'Essential first aid techniques for common emergencies and injuries.',
      thumbnail: '/videos/first-aid-thumbnail.jpg',
      duration: '15:45',
      url: 'https://example.com/videos/first-aid-basics'
    }
  ],
  healthTips: [
    {
      id: 'VID003',
      title: 'Healthy Living',
      description: 'Tips for maintaining a healthy lifestyle through diet and exercise.',
      thumbnail: '/videos/healthy-living-thumbnail.jpg',
      duration: '12:20',
      url: 'https://example.com/videos/healthy-living'
    },
    {
      id: 'VID004',
      title: 'Preventive Care',
      description: 'Understanding the importance of regular health check-ups and preventive measures.',
      thumbnail: '/videos/preventive-care-thumbnail.jpg',
      duration: '08:15',
      url: 'https://example.com/videos/preventive-care'
    }
  ]
}; 