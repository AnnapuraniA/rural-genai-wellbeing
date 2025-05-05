import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapMarker } from '@/lib/mapServices';
import { useLanguage } from '@/contexts/LanguageContext';

export interface SelectedMarkerCardProps {
  selectedMarker: MapMarker | null;
  allowDirections?: boolean;
  userLocation?: { latitude: number; longitude: number };
  onGetDirections?: (marker: MapMarker) => void;
}

const SelectedMarkerCard: React.FC<SelectedMarkerCardProps> = ({ 
  selectedMarker, 
  allowDirections = false,
  userLocation,
  onGetDirections
}) => {
  const { language } = useLanguage();
  
  if (!selectedMarker) return null;
  
  return (
    <Card className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{selectedMarker.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 whitespace-pre-line">{selectedMarker.info}</p>
        {selectedMarker.distance !== undefined && (
          <p className="text-sm text-gray-600 mt-2">
            {language === 'english' ? 'Distance' : 'தூரம்'}: {selectedMarker.distance.toFixed(1)} km
          </p>
        )}
        {allowDirections && userLocation && onGetDirections && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => onGetDirections(selectedMarker)}
          >
            {language === 'english' ? 'Get Directions' : 'வழிகாட்டுதலைப் பெறுங்கள்'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedMarkerCard;
