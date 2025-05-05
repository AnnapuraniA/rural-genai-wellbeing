import { Coordinator, Customer, Lab, HealthSakhi, calculateDistanceInKm } from './database';

// Define map marker types
export type MarkerType = 'coordinator' | 'healthSakhi' | 'customer' | 'lab';

// Define marker data structure
export interface MapMarker {
  id: string;
  type: MarkerType;
  latitude: number;
  longitude: number;
  title: string;
  info?: string;
  distance?: number; // Distance in km from reference point
}

// Convert coordinators to map markers
export const convertCoordinatorsToMarkers = (coordinators: Coordinator[]): MapMarker[] => {
  return coordinators.map(coordinator => ({
    id: coordinator.id,
    type: 'coordinator',
    latitude: coordinator.latitude,
    longitude: coordinator.longitude,
    title: coordinator.name,
    info: `District: ${coordinator.district}\nHealth Sakhis: ${coordinator.linkedHealthSakhis.length}`
  }));
};

// Convert health sakhis to map markers
export const convertHealthSakhisToMarkers = (
  healthSakhis: HealthSakhi[], 
  referencePoint?: { latitude: number; longitude: number }
): MapMarker[] => {
  return healthSakhis.map(sakhi => {
    const marker: MapMarker = {
      id: sakhi.id,
      type: 'healthSakhi',
      latitude: sakhi.latitude,
      longitude: sakhi.longitude,
      title: sakhi.name,
      info: `Village: ${sakhi.village}\nCustomers: ${sakhi.linkedCustomers.length}`
    };
    
    if (referencePoint) {
      marker.distance = calculateDistanceInKm(
        referencePoint.latitude, 
        referencePoint.longitude, 
        sakhi.latitude, 
        sakhi.longitude
      );
    }
    
    return marker;
  });
};

// Convert customers to map markers
export const convertCustomersToMarkers = (
  customers: Customer[],
  referencePoint?: { latitude: number; longitude: number }
): MapMarker[] => {
  return customers.map(customer => {
    const marker: MapMarker = {
      id: customer.id,
      type: 'customer',
      latitude: customer.latitude,
      longitude: customer.longitude,
      title: customer.name,
      info: `Village: ${customer.village}\nAge: ${customer.age}\nGender: ${customer.gender}`
    };
    
    if (referencePoint) {
      marker.distance = calculateDistanceInKm(
        referencePoint.latitude, 
        referencePoint.longitude, 
        customer.latitude, 
        customer.longitude
      );
    }
    
    return marker;
  });
};

// Convert labs to map markers
export const convertLabsToMarkers = (
  labs: Lab[],
  referencePoint?: { latitude: number; longitude: number }
): MapMarker[] => {
  return labs.map(lab => {
    const marker: MapMarker = {
      id: lab.id,
      type: 'lab',
      latitude: lab.latitude,
      longitude: lab.longitude,
      title: lab.name,
      info: `Services: ${lab.services.join(', ')}\nWorking Hours: ${lab.workingHours}`
    };
    
    if (referencePoint) {
      marker.distance = calculateDistanceInKm(
        referencePoint.latitude, 
        referencePoint.longitude, 
        lab.latitude, 
        lab.longitude
      );
    }
    
    return marker;
  });
};

// Filter markers by distance
export const filterMarkersByDistance = (
  markers: MapMarker[],
  maxDistance: number
): MapMarker[] => {
  return markers.filter(marker => 
    marker.distance !== undefined && marker.distance <= maxDistance
  );
};

// Get marker color based on type and distance
export const getMarkerColor = (markerType: MarkerType, distance?: number): string => {
  switch (markerType) {
    case 'coordinator':
      return '#2E7D32'; // Forest Green
    case 'healthSakhi':
      if (distance === undefined) return '#A1887F'; // Default Soil Brown
      if (distance <= 2) return '#4CAF50'; // Green
      if (distance <= 5) return '#FF9800'; // Orange
      return '#F44336'; // Red
    case 'customer':
      if (distance === undefined) return '#2196F3'; // Default Blue
      if (distance <= 2) return '#4CAF50'; // Green
      if (distance <= 5) return '#FF9800'; // Orange
      return '#F44336'; // Red
    case 'lab':
      return '#FFCA28'; // Golden Yellow
    default:
      return '#757575'; // Grey
  }
};

// Generate Google Maps direction URL
export const getGoogleMapsDirectionUrl = (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): string => {
  return `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}`;
};
