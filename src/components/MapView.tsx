
import React, { useEffect, useRef, useState } from 'react';
import { MapMarker, getMarkerColor, getGoogleMapsDirectionUrl } from '@/lib/mapServices';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

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
      
      // Draw background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
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
        ctx.fillStyle = '#2196F3'; // Blue
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Draw markers
      markers.forEach(marker => {
        const pos = coordToCanvas(marker.latitude, marker.longitude);
        
        // Determine marker color
        const color = getMarkerColor(marker.type, marker.distance);
        
        // Draw marker circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, marker.id === selectedMarkerId ? 8 : 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw selection ring if selected
        if (marker.id === selectedMarkerId) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
          ctx.stroke();
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
          
          if (distance <= 10) {
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
  }, [markers, mapInitialized, selectedMarkerId, center, onMarkerClick, userLocation]);
  
  const handleGetDirections = () => {
    if (!selectedMarker || !userLocation) return;
    
    const url = getGoogleMapsDirectionUrl(
      userLocation.latitude,
      userLocation.longitude,
      selectedMarker.latitude,
      selectedMarker.longitude
    );
    
    toast({
      title: 'Opening directions',
      description: `Getting directions to ${selectedMarker.title}`,
    });
    
    // Open in new tab
    window.open(url, '_blank');
  };
  
  return (
    <div className="relative w-full">
      <div 
        ref={mapRef} 
        className="bg-muted rounded-md border overflow-hidden"
        style={{ height, width: '100%' }}
      >
        {/* Map will be rendered here */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Loading map...
        </div>
      </div>
      
      {showLegend && (
        <div className="absolute top-2 right-2 bg-white/90 p-2 rounded-md shadow-sm text-xs">
          <div className="font-semibold mb-1">Legend</div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-wellnet-green"></span>
            <span>Coordinator</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-wellnet-brown"></span>
            <span>Health Sakhi</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Customer</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-wellnet-yellow"></span>
            <span>Lab</span>
          </div>
        </div>
      )}
      
      {selectedMarker && (
        <Card className="absolute left-2 bottom-2 w-48 shadow-lg">
          <CardContent className="p-3 text-xs">
            <h4 className="font-semibold">{selectedMarker.title}</h4>
            {selectedMarker.info && (
              <p className="mt-1 whitespace-pre-line">{selectedMarker.info}</p>
            )}
            {selectedMarker.distance !== undefined && (
              <p className="mt-1">Distance: {selectedMarker.distance.toFixed(2)} km</p>
            )}
            {allowDirections && userLocation && (
              <Button 
                size="sm" 
                className="mt-2 w-full text-xs h-8" 
                onClick={handleGetDirections}
              >
                Get Directions
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapView;
