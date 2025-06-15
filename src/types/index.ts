export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface TestResult {
  id: string;
  date: string;
  type: string;
  results: {
    name: string;
    value: string;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
  notes: string;
}

export interface Message {
  id: string;
  sender: 'Customer' | 'HealthSakhi';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  url: string;
}

export interface HealthSakhi {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  location: Location;
  phone: string;
  email: string;
  availability: string;
  rating: number;
  reviews: number;
}

export interface Lab {
  id: string;
  name: string;
  location: Location;
  phone: string;
  email: string;
  tests: string[];
  rating: number;
  reviews: number;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
} 