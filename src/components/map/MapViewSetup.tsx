
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface SetMapViewProps {
  center: [number, number];
}

// Helper component to set the map view when center prop changes
export const SetMapView: React.FC<SetMapViewProps> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

// Component for fixing Leaflet marker icons
export const FixLeafletMarker: React.FC = () => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);
  
  return null;
};

interface MapInstructionsProps {
  language: string;
}

export const MapInstructions: React.FC<MapInstructionsProps> = ({ language }) => {
  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/80 py-1 px-3 rounded-full text-sm shadow-md z-[1000]">
      {language === 'english' ? 'Click on markers to see details' : 'விவரங்களைக் காண குறியீடுகளை கிளிக் செய்யவும்'}
    </div>
  );
};
