import React from 'react';
import { Circle } from 'react-leaflet';
import L from 'leaflet';

interface ConcentricCirclesProps {
  center: { latitude: number; longitude: number };
  distances: number[]; // in kilometers
  colors: string[];
  opacity: number;
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
  center,
  distances,
  colors,
  opacity
}) => {
  return (
    <>
      {distances.map((distance, index) => (
        <Circle
          key={index}
          center={[center.latitude, center.longitude]}
          radius={distance * 1000} // Convert km to meters
          pathOptions={{
            color: colors[index],
            fillColor: colors[index],
            fillOpacity: opacity,
            weight: 2
          }}
        />
      ))}
    </>
  );
};

export default ConcentricCircles; 