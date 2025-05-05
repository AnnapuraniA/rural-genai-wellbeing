import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import MapLegend from './MapLegend';
import MapMarkers from './MapMarkers';
import type { MapMarker } from '@/lib/mapServices';

interface MapViewProps {
  markers: MapMarker[];
  center: {
    latitude: number;
    longitude: number;
  };
  height: string;
  showLegend?: boolean;
  legendItems?: Array<{
    label: string;
    color: string;
  }>;
  onMarkerClick?: (marker: MapMarker) => void;
  selectedMarkerId?: string;
}

const MapView: React.FC<MapViewProps> = ({
  markers,
  center,
  height,
  showLegend = false,
  legendItems = [],
  onMarkerClick,
  selectedMarkerId
}) => {
  const mapContainerStyle = {
    width: '100%',
    height: height
  };

  const centerPosition = {
    lat: center.latitude,
    lng: center.longitude
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={centerPosition}
          zoom={12}
        >
          <MapMarkers
            markers={markers}
            onMarkerClick={onMarkerClick || (() => {})}
            selectedMarkerId={selectedMarkerId}
          />
        </GoogleMap>
        {showLegend && (
          <MapLegend show={true} legendItems={legendItems} />
        )}
      </div>
    </LoadScript>
  );
};

export default MapView; 