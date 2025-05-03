
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapLegendProps {
  show: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({ show }) => {
  const { language } = useLanguage();
  
  if (!show) return null;
  
  return (
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
  );
};

export default MapLegend;
