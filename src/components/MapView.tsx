
import React, { useEffect, useRef, useState } from 'react';
import { MapMarker, getMarkerColor, getGoogleMapsDirectionUrl } from '@/lib/mapServices';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  
  // This effect initializes a simple map display
  // In a real app, this would use a proper mapping library like Leaflet or Google Maps
  useEffect(() => {
    if (!mapRef.current || mapInitialized) return;
    
    try {
      // Canvas dimensions
      const width = mapRef.current.clientWidth;
      const height = mapRef.current.clientHeight;
      
      // Create canvas for our simple map
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      mapRef.current.appendChild(canvas);
      
      // Mark map as initialized
      setMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapInitialized]);
  
  // This effect draws the markers on the map
  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return;
    
    try {
      const canvas = mapRef.current.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background with a more distinct color
      ctx.fillStyle = '#EBF2F9';  // Light blue background for better contrast
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add grid lines for better orientation
      ctx.strokeStyle = '#D1DCE8';
      ctx.lineWidth = 1;
      
      // Grid lines
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }
      
      // Calculate map bounds
      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLng = Infinity;
      let maxLng = -Infinity;
      
      markers.forEach(marker => {
        minLat = Math.min(minLat, marker.latitude);
        maxLat = Math.max(maxLat, marker.latitude);
        minLng = Math.min(minLng, marker.longitude);
        maxLng = Math.max(maxLng, marker.longitude);
      });
      
      // Add padding to bounds
      const latPadding = (maxLat - minLat) * 0.1;
      const lngPadding = (maxLng - minLng) * 0.1;
      
      minLat -= latPadding;
      maxLat += latPadding;
      minLng -= lngPadding;
      maxLng += lngPadding;
      
      // If center is provided, adjust bounds
      if (center) {
        // Add center to bounds calculation
        minLat = Math.min(minLat, center.latitude);
        maxLat = Math.max(maxLat, center.latitude);
        minLng = Math.min(minLng, center.longitude);
        maxLng = Math.max(maxLng, center.longitude);
      }
      
      // Function to convert coordinates to canvas position
      const coordToCanvas = (lat: number, lng: number) => {
        const x = ((lng - minLng) / (maxLng - minLng)) * canvas.width;
        const y = canvas.height - ((lat - minLat) / (maxLat - minLat)) * canvas.height;
        return { x, y };
      };
      
      // Draw user location if available
      if (userLocation) {
        const pos = coordToCanvas(userLocation.latitude, userLocation.longitude);
        
        // Draw user location with a blue pulsing dot
        ctx.fillStyle = '#2196F3'; // Blue
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add a ring around user location
        ctx.strokeStyle = '#0D47A1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 12, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Add a white dot in center for better visibility
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add "You are here" label
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(language === 'english' ? 'You are here' : 'நீங்கள் இங்கே', pos.x, pos.y + 25);
      }
      
      // Draw markers with improved visibility
      markers.forEach(marker => {
        const pos = coordToCanvas(marker.latitude, marker.longitude);
        
        // Determine marker color
        const color = getMarkerColor(marker.type, marker.distance);
        
        // Draw marker circle with larger size and border
        const isSelected = marker.id === selectedMarkerId;
        const markerSize = isSelected ? 10 : 8;
        
        // Draw shadow for depth
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(pos.x + 2, pos.y + 2, markerSize, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw main marker
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, markerSize, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, markerSize, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw selection ring if selected
        if (isSelected) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, markerSize + 5, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Add label
          ctx.font = '12px Arial';
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.fillText(marker.title, pos.x, pos.y - 15);
        }
        
        // Add distance label if available
        if (marker.distance !== undefined && marker.distance <= 10) {
          ctx.font = '10px Arial';
          ctx.fillStyle = '#555';
          ctx.textAlign = 'center';
          ctx.fillText(`${marker.distance.toFixed(1)} km`, pos.x, pos.y + 20);
        }
      });
      
      // Make markers clickable
      canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find clicked marker
        for (const marker of markers) {
          const pos = coordToCanvas(marker.latitude, marker.longitude);
          const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
          
          if (distance <= 12) {
            if (onMarkerClick) {
              onMarkerClick(marker);
            }
            setSelectedMarker(marker);
            return;
          }
        }
        
        // If no marker clicked, clear selection
        setSelectedMarker(null);
      };
      
    } catch (error) {
      console.error('Error drawing map:', error);
    }
  }, [markers, mapInitialized, selectedMarkerId, center, onMarkerClick, userLocation, language]);
  
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
    <div className="relative w-full">
      <div 
        ref={mapRef} 
        className="bg-muted rounded-md border border-gray-300 shadow-inner overflow-hidden" 
        style={{ height, width: '100%' }}
      >
        {/* Map will be rendered here */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          {language === 'english' ? 'Loading map...' : 'வரைபடம் ஏற்றப்படுகிறது...'}
        </div>
      </div>
      
      {/* Instructions overlay for better UX */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/80 py-1 px-3 rounded-full text-sm shadow-md">
        {language === 'english' ? 'Click on markers to see details' : 'விவரங்களைக் காண குறிப்பானைக் கிளிக் செய்யவும்'}
      </div>
      
      {showLegend && (
        <div className="absolute top-2 right-2 bg-white/95 p-2 rounded-md shadow-md text-xs border border-gray-200">
          <div className="font-semibold mb-1">
            {language === 'english' ? 'Legend' : 'விளக்கம்'}
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-wellnet-green"></span>
            <span>{language === 'english' ? 'Coordinator' : 'ஒருங்கிணைப்பாளர்'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-wellnet-brown"></span>
            <span>{language === 'english' ? 'Health Sakhi' : 'ஆரோக்கிய சகி'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span>{language === 'english' ? 'Customer' : 'வாடிக்கையாளர்'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-wellnet-yellow"></span>
            <span>{language === 'english' ? 'Lab' : 'ஆய்வகம்'}</span>
          </div>
        </div>
      )}
      
      {selectedMarker && (
        <Card className="absolute left-2 bottom-2 w-56 shadow-md border-2 border-gray-300">
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
      )}
    </div>
  );
};

export default MapView;
