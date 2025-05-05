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
        return '#2196F3'; // Always Blue
      case 'lab':
        return '#FFCA28'; // Golden Yellow
      default:
        return '#757575'; // Grey
    }
  };

  const color = getMarkerColor(markerType, distance);
  // Make lab markers larger than other markers
  const size = markerType === 'lab' ? 20 : (isSelected ? 16 : 12);
  const borderWidth = markerType === 'lab' ? 4 : (isSelected ? 3 : 2);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        ${markerType === 'lab' ? 'box-shadow: 0 0 0 2px rgba(0,0,0,0.2);' : ''}
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
          <Popup className="custom-popup">
            <div className="p-2">
              <h4 className="font-semibold text-sm">{marker.title}</h4>
              {marker.info && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                  {marker.info}
                </div>
              )}
              {marker.distance !== undefined && (
                <div className="text-xs mt-1">
                  <span className="font-medium">
                    {language === 'english' ? 'Distance:' : 'தூரம்:'}
                  </span>{' '}
                  <span className="text-gray-600">
                    {marker.distance.toFixed(1)} km
                  </span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;
