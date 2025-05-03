
import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserLocationProps {
  userLocation: { latitude: number; longitude: number };
}

const UserLocation: React.FC<UserLocationProps> = ({ userLocation }) => {
  const { language } = useLanguage();

  return (
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
  );
};

export default UserLocation;
