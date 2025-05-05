import React, { useState, useEffect } from 'react';
import { MapMarker } from '@/lib/mapServices';
import { useLanguage } from '@/contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapMarkers from './map/MapMarkers';
import UserLocation from './map/UserLocation';
import MapLegend from './map/MapLegend';
import SelectedMarkerCard from './map/SelectedMarkerCard';
import { FixLeafletMarker, SetMapView, MapInstructions } from './map/MapViewSetup';

interface MapViewProps {
  markers: MapMarker[];
  center?: { latitude: number; longitude: number };
  height?: string;
  showLegend?: boolean;
  legendItems?: Array<{ color: string; label: string }>;
  onMarkerClick?: (marker: MapMarker) => void;
  selectedMarkerId?: string;
  allowDirections?: boolean;
  userLocation?: { latitude: number; longitude: number };
  onGetDirections?: (marker: MapMarker) => void;
  children?: React.ReactNode;
}

const MapView: React.FC<MapViewProps> = ({
  markers,
  center,
  height = '500px',
  showLegend = true,
  legendItems,
  onMarkerClick,
  selectedMarkerId,
  allowDirections = false,
  userLocation,
  onGetDirections,
  children
}) => {
  const { language } = useLanguage();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  
  // Set default center if not provided
  const mapCenter = center 
    ? [center.latitude, center.longitude] as [number, number]
    : [11.1271, 78.6569] as [number, number]; // Default to Tamil Nadu center
  
  // Calculate initial zoom based on markers
  const getInitialZoom = () => {
    if (markers.length === 0) return 8;
    if (markers.length === 1) return 12;
    return 10;
  };
  
  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };
  
  // Find selected marker when selectedMarkerId changes
  useEffect(() => {
    if (selectedMarkerId) {
      const marker = markers.find(m => m.id === selectedMarkerId);
      if (marker) {
        setSelectedMarker(marker);
      }
    } else {
      setSelectedMarker(null);
    }
  }, [selectedMarkerId, markers]);
  
  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={getInitialZoom()}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <FixLeafletMarker />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Set map view when center changes */}
        <SetMapView center={mapCenter} />
        
        {/* User location */}
        {userLocation && (
          <UserLocation userLocation={userLocation} />
        )}
        
        {/* Markers */}
        <MapMarkers 
          markers={markers} 
          onMarkerClick={handleMarkerClick} 
          selectedMarkerId={selectedMarkerId}
        />
        
        {/* Additional map elements */}
        {children}
      </MapContainer>
      
      {/* Instructions overlay */}
      <MapInstructions language={language} />
      
      {/* Legend */}
      <MapLegend show={showLegend} legendItems={legendItems} />
      
      {/* Selected marker info card */}
      <SelectedMarkerCard 
        selectedMarker={selectedMarker}
        allowDirections={allowDirections}
        userLocation={userLocation}
        onGetDirections={onGetDirections}
      />
    </div>
  );
};

export default MapView;
