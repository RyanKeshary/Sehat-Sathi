import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { languages, currentLanguage, changeLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <select 
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.native}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
            currentLanguage === lang.code
              ? 'bg-[#1A6FA3] text-white border-[#1A6FA3]'
              : 'bg-white text-[#4A5A72] border-[#D4DCE8] hover:border-[#1A6FA3]'
          }`}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
