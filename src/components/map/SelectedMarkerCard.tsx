
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapMarker, getGoogleMapsDirectionUrl } from '@/lib/mapServices';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface SelectedMarkerCardProps {
  selectedMarker: MapMarker | null;
  allowDirections?: boolean;
  userLocation?: { latitude: number; longitude: number };
}

const SelectedMarkerCard: React.FC<SelectedMarkerCardProps> = ({ 
  selectedMarker, 
  allowDirections = false,
  userLocation
}) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  if (!selectedMarker) return null;
  
  // Get directions
  const handleGetDirections = () => {
    if (!selectedMarker || !userLocation) return;
    
    const url = getGoogleMapsDirectionUrl(
      userLocation.latitude,
      userLocation.longitude,
      selectedMarker.latitude,
      selectedMarker.longitude
    );
    
    toast({
      title: language === 'english' ? 'Opening directions' : 'திசைகள் திறக்கின்றன',
      description: language === 'english' ? `Getting directions to ${selectedMarker.title}` : 
        `${selectedMarker.title} க்கான வழிகளைப் பெறுகிறது`,
    });
    
    // Open in new tab
    window.open(url, '_blank');
  };
  
  return (
    <Card className="absolute left-2 bottom-2 w-56 shadow-md border-2 border-gray-300 z-[1000]">
      <CardContent className="p-3 text-xs">
        <h4 className="font-semibold">{selectedMarker.title}</h4>
        {selectedMarker.info && (
          <p className="mt-1 whitespace-pre-line">{selectedMarker.info}</p>
        )}
        {selectedMarker.distance !== undefined && (
          <p className="mt-1 font-medium">
            {language === 'english' ? 'Distance:' : 'தூரம்:'} {selectedMarker.distance.toFixed(2)} km
          </p>
        )}
        {allowDirections && userLocation && (
          <Button 
            size="sm" 
            className="mt-2 w-full text-xs h-8" 
            onClick={handleGetDirections}
          >
            {language === 'english' ? 'Get Directions' : 'திசைகளைப் பெறுக'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedMarkerCard;
