import React, { useMemo } from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { calculateDistanceInKm } from '@/lib/database';
import { useLanguage } from '@/contexts/LanguageContext';
import { LatLngTuple } from 'leaflet';

interface DistanceLineProps {
  start: { latitude: number; longitude: number; name: string; village?: string; address?: string };
  end: { latitude: number; longitude: number; name: string; village?: string; address?: string };
  color?: string;
  weight?: number;
  dashArray?: string;
}

const DistanceLine: React.FC<DistanceLineProps> = ({
  start,
  end,
  color = '#2196F3',
  weight = 3,
  dashArray = '5, 10'
}) => {
  const { language } = useLanguage();
  
  // Memoize distance calculation
  const distance = useMemo(() => 
    calculateDistanceInKm(start.latitude, start.longitude, end.latitude, end.longitude),
    [start.latitude, start.longitude, end.latitude, end.longitude]
  );
  
  // Memoize curved line points
  const linePoints = useMemo(() => {
    const points: LatLngTuple[] = [];
    const steps = 10;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = start.latitude + (end.latitude - start.latitude) * t;
      const lng = start.longitude + (end.longitude - start.longitude) * t;
      
      // Add a slight curve to the line
      const curve = Math.sin(t * Math.PI) * 0.1;
      points.push([lat + curve, lng + curve]);
    }
    
    return points;
  }, [start.latitude, start.longitude, end.latitude, end.longitude]);

  // Calculate midpoint for popup position
  const midPoint: LatLngTuple = useMemo(() => [
    (start.latitude + end.latitude) / 2,
    (start.longitude + end.longitude) / 2
  ], [start.latitude, start.longitude, end.latitude, end.longitude]);

  return (
    <>
      <Polyline
        positions={linePoints}
        pathOptions={{
          color,
          weight,
          dashArray,
          opacity: 0.8,
          interactive: true
        }}
      >
        <Popup position={midPoint}>
          <div className="p-2 space-y-2">
            <div>
              <p className="font-medium">
                {language === 'english' ? 'From' : 'இருந்து'}:
              </p>
              <p className="text-sm">{start.name}</p>
              <p className="text-xs text-muted-foreground">{start.village || start.address}</p>
            </div>
            <div>
              <p className="font-medium">
                {language === 'english' ? 'To' : 'வரை'}:
              </p>
              <p className="text-sm">{end.name}</p>
              <p className="text-xs text-muted-foreground">{end.village || end.address}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="font-medium">
                {language === 'english' ? 'Distance' : 'தூரம்'}: {distance.toFixed(1)} km
              </p>
            </div>
          </div>
        </Popup>
      </Polyline>
      {/* Add invisible markers at start and end points to make the line draggable */}
      <Polyline
        positions={[[start.latitude, start.longitude], [end.latitude, end.longitude]]}
        pathOptions={{
          color: 'transparent',
          weight: 20, // Make the clickable area larger
          opacity: 0,
          interactive: true
        }}
      />
    </>
  );
};

export default React.memo(DistanceLine); 