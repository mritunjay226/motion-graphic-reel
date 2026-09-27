import React from "react";
import { LANGUAGES } from "./constants";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (langId: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="inline-flex items-center bg-black/[0.04] p-1 rounded-full border border-black/[0.04]">
      {LANGUAGES.map((lang) => {
        const isSelected = selectedLanguage === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onLanguageChange(lang.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer select-none ${isSelected
                ? "bg-white text-[#1D1D1F] shadow-sm font-semibold"
                : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span>{lang.id.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};
