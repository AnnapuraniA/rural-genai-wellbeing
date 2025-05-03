
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
  onMarkerClick?: (marker: MapMarker) => void;
  selectedMarkerId?: string;
  allowDirections?: boolean;
  userLocation?: { latitude: number; longitude: number };
}

const MapView: React.FC<MapViewProps> = ({
  markers,
  center,
  height = '400px',
  showLegend = true,
  onMarkerClick,
  selectedMarkerId,
  allowDirections = false,
  userLocation
}) => {
  const { language } = useLanguage();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  
  // Set default center if not provided
  const mapCenter = center 
    ? [center.latitude, center.longitude] as [number, number]
    : [12.1289, 78.1578] as [number, number]; // Dharmapuri district coordinates
  
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
    <div className="relative w-full" style={{ height: height }}>
      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
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
      </MapContainer>
      
      {/* Instructions overlay */}
      <MapInstructions language={language} />
      
      {/* Legend */}
      <MapLegend show={showLegend} />
      
      {/* Selected marker info card */}
      <SelectedMarkerCard 
        selectedMarker={selectedMarker}
        allowDirections={allowDirections}
        userLocation={userLocation}
      />
    </div>
  );
};

export default MapView;
