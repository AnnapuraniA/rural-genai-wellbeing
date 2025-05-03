
import React, { useEffect, useState } from 'react';
import { MapMarker, getMarkerColor, getGoogleMapsDirectionUrl } from '@/lib/mapServices';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Component for fixing Leaflet marker icons
function FixLeafletMarker() {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);
  
  return null;
}

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

// Helper component to set the map view when center prop changes
function SetMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
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
  const { toast } = useToast();
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
  
  // Create custom marker icons based on marker type
  const createMarkerIcon = (markerType: string, distance?: number, isSelected: boolean = false): L.DivIcon => {
    const color = getMarkerColor(markerType as any, distance);
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
          <>
            <Marker 
              position={[userLocation.latitude, userLocation.longitude]}
              icon={L.divIcon({
                className: 'user-location-marker',
                html: `
                  <div style="
                    width: 14px;
                    height: 14px;
                    background-color: #2196F3;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.3);
                  ">
                    <div style="
                      width: 6px;
                      height: 6px;
                      background-color: white;
                      border-radius: 50%;
                      margin: 1px;
                    "></div>
                  </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })}
            >
              <Popup>
                <b>{language === 'english' ? 'Your Location' : 'உங்கள் இருப்பிடம்'}</b>
              </Popup>
            </Marker>
            
            {/* Range circle around user */}
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              pathOptions={{ 
                fillColor: '#2196F3', 
                fillOpacity: 0.05, 
                color: '#2196F3',
                opacity: 0.2,
                weight: 1
              }}
              radius={10000} // 10km
            />
          </>
        )}
        
        {/* Markers */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={createMarkerIcon(marker.type, marker.distance, marker.id === selectedMarkerId)}
            eventHandlers={{ 
              click: () => handleMarkerClick(marker) 
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
      </MapContainer>
      
      {/* Instructions overlay for better UX */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/80 py-1 px-3 rounded-full text-sm shadow-md z-[1000]">
        {language === 'english' ? 'Click on markers to see details' : 'விவரங்களைக் காண குறிப்பானைக் கிளிக் செய்யவும்'}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="absolute top-2 right-2 bg-white/95 p-2 rounded-md shadow-md text-xs border border-gray-200 z-[1000]">
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
      
      {/* Selected marker info card */}
      {selectedMarker && (
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
      )}
    </div>
  );
};

export default MapView;
