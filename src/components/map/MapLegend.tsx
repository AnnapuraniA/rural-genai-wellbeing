import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapLegendProps {
  show?: boolean;
  legendItems?: Array<{ color: string; label: string }>;
}

const MapLegend: React.FC<MapLegendProps> = ({ show = true, legendItems }) => {
  const { language } = useLanguage();
  
  if (!show) return null;
  
  // Default legend items if none provided
  const defaultLegendItems = [
    { color: '#2196F3', label: language === 'english' ? 'Customer' : 'வாடிக்கையாளர்' },
    { color: '#A1887F', label: language === 'english' ? 'Health Sakhi' : 'ஆரோக்கிய சகி' },
    { color: '#FFCA28', label: language === 'english' ? 'Lab' : 'ஆய்வகம்' }
  ];
  
  const items = legendItems || defaultLegendItems;
  
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-md z-[1000]">
      <h4 className="text-sm font-semibold mb-2">
        {language === 'english' ? 'Legend' : 'விளக்கப்படம்'}
      </h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
