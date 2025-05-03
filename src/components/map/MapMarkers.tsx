
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { MapMarker } from '@/lib/mapServices';
import L from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapMarkersProps {
  markers: MapMarker[];
  onMarkerClick: (marker: MapMarker) => void;
  selectedMarkerId?: string;
}

// Helper function to create custom marker icons
const createMarkerIcon = (markerType: string, distance?: number, isSelected: boolean = false): L.DivIcon => {
  const getMarkerColor = (type: string, dist?: number): string => {
    switch (type) {
      case 'coordinator':
        return '#2E7D32'; // Forest Green
      case 'healthSakhi':
        if (dist === undefined) return '#A1887F'; // Default Soil Brown
        if (dist <= 2) return '#4CAF50'; // Green
        if (dist <= 5) return '#FF9800'; // Orange
        return '#F44336'; // Red
      case 'customer':
        if (dist === undefined) return '#2196F3'; // Default Blue
        if (dist <= 2) return '#4CAF50'; // Green
        if (dist <= 5) return '#FF9800'; // Orange
        return '#F44336'; // Red
      case 'lab':
        return '#FFCA28'; // Golden Yellow
      default:
        return '#757575'; // Grey
    }
  };

  const color = getMarkerColor(markerType, distance);
  const size = isSelected ? 14 : 10;
  const borderWidth = isSelected ? 3 : 2;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [size + 2*borderWidth, size + 2*borderWidth],
    iconAnchor: [(size + 2*borderWidth)/2, (size + 2*borderWidth)/2]
  });
};

const MapMarkers: React.FC<MapMarkersProps> = ({ markers, onMarkerClick, selectedMarkerId }) => {
  const { language } = useLanguage();

  return (
    <>
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={createMarkerIcon(marker.type, marker.distance, marker.id === selectedMarkerId)}
          eventHandlers={{ 
            click: () => onMarkerClick(marker) 
          }}
        >
          <Popup>
            <div>
              <b>{marker.title}</b>
              {marker.info && (
                <p className="text-xs whitespace-pre-wrap mt-1">{marker.info}</p>
              )}
              {marker.distance !== undefined && (
                <p className="text-xs mt-1">
                  <b>{language === 'english' ? 'Distance:' : 'தூரம்:'}</b> {marker.distance.toFixed(2)} km
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;
