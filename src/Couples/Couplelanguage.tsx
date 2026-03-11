// src/Couple/CoupleLanguage.tsx
import React, { useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import type { Language } from "../Contexts/AppSettingsContext";

import "./CoupleLanguage.css"; // can reuse AdminLanguage.css style

const FLAG_IMAGES: Record<Language, string> = {
  en: "https://flagcdn.com/w40/us.png",
  am: "https://flagcdn.com/w40/et.png",
  ti: "https://flagcdn.com/w40/er.png",
  om: "https://flagcdn.com/w40/et.png",
  ar: "https://flagcdn.com/w40/sa.png",
  zh: "https://flagcdn.com/w40/cn.png",
};

const LANGUAGES: Language[] = ["en", "am", "ti", "om", "ar", "zh"];

const CoupleLanguage: React.FC = () => {
  const { language, setLanguage, isRTL, t } = useAppSettings();

  // Load stored couple language
  useEffect(() => {
    const storedLang = localStorage.getItem("couple-language") as Language | null;
    if (storedLang && LANGUAGES.includes(storedLang)) setLanguage(storedLang);
  }, [setLanguage]);

  const handleChangeLanguage = (code: Language) => {
    setLanguage(code);
    localStorage.setItem("couple-language", code);
  };

  return (
    <div className={`couple-language ${isRTL ? "rtl" : ""}`}>
      <div className="language-container">
        <h2>🌍 {t("languageSettings")}</h2>
        <p>{t("selectLanguage")}</p>

        <div className="language-grid">
          {LANGUAGES.map((code) => (
            <button
              key={code}
              className={`language-card ${language === code ? "active" : ""}`}
              onClick={() => handleChangeLanguage(code)}
            >
              <img
                src={FLAG_IMAGES[code]}
                alt={t(`lang_${code}`)}
                className="flag-image"
              />
              <span className="language-label">{t(`lang_${code}`)}</span>
            </button>
          ))}
        </div>

        <div className="language-info">
          <strong>{t("direction")}:</strong> {isRTL ? t("rtl") : t("ltr")}
        </div>
      </div>
    </div>
  );
};

export default CoupleLanguage;
