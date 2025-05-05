import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/i18n';

type Language = 'english' | 'tamil';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(i18n.language === 'en' ? 'english' : 'tamil');

  useEffect(() => {
    i18n.changeLanguage(language === 'english' ? 'en' : 'ta');
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
