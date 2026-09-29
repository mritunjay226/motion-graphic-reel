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
    <div className="inline-flex items-center bg-white p-1 rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] gap-1 select-none">
      {LANGUAGES.map((lang) => {
        const isSelected = selectedLanguage === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onLanguageChange(lang.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? "bg-[#FFE600] text-[#111111] shadow-[1px_1px_0px_#111111] border border-[#111111] scale-102"
                : "text-[#555555] hover:text-[#111111] hover:bg-[#F4F4F6]"
            }`}
          >
            <span className="text-sm leading-none">{lang.flag}</span>
            <span className="uppercase">{lang.id}</span>
          </button>
        );
      })}
    </div>
  );
};

