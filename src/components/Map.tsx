import React from 'react';
import MapView from '@/components/map/MapView';
import ConcentricCircles from '@/components/map/ConcentricCircles';
import { ErrorBoundary } from 'react-error-boundary';
import type { HealthSakhi, Customer } from '@/lib/database';

interface MapProps {
  healthSakhi: HealthSakhi;
  customers: Customer[];
  language: 'english' | 'tamil';
}

interface MapMarker {
  id: string;
  type: 'health_sakhi' | 'customer';
  latitude: number;
  longitude: number;
  name: string;
}

const Map: React.FC<MapProps> = ({
  healthSakhi,
  customers,
  language
}) => {
  const markers: MapMarker[] = [
    {
      id: healthSakhi.id,
      type: 'health_sakhi' as const,
      latitude: healthSakhi.latitude,
      longitude: healthSakhi.longitude,
      name: healthSakhi.name
    },
    ...customers.map(customer => ({
      id: customer.id,
      type: 'customer' as const,
      latitude: customer.latitude,
      longitude: customer.longitude,
      name: customer.name
    }))
  ];

  const legendItems = [
    {
      label: language === 'english' ? 'Health Sakhi' : 'சுகாதார சகி',
      color: '#4CAF50'
    },
    {
      label: language === 'english' ? 'Customers' : 'வாடிக்கையாளர்கள்',
      color: '#2196F3'
    }
  ];

  return (
    <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing the page.</div>}>
      <MapView
        markers={markers}
        center={{ latitude: healthSakhi.latitude, longitude: healthSakhi.longitude }}
        height="500px"
        showLegend={true}
        legendItems={legendItems}
      />
    </ErrorBoundary>
  );
};

export default Map; 