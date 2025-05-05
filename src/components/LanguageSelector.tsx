import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (value: 'english' | 'tamil') => {
    setLanguage(value);
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px] bg-wellnet-green text-white border-white hover:bg-wellnet-green/90">
        <SelectValue>
          <span>
            {t('common.language')}: {t(`common.${language}`)}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="english">{t('common.english')}</SelectItem>
        <SelectItem value="tamil">{t('common.tamil')}</SelectItem>
      </SelectContent>
    </Select>
  );
}; 