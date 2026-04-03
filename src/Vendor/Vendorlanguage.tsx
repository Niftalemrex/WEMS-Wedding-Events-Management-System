// src/Vendor/VendorLanguage.tsx
import React, { useEffect } from "react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import type { Language } from "../Contexts/AppSettingsContext";
import "./VendorLanguage.css";

const FLAG_IMAGES: Record<Language, string> = {
  en: "https://flagcdn.com/w40/us.png",
  am: "https://flagcdn.com/w40/et.png",
  ti: "https://flagcdn.com/w40/er.png",
  om: "https://flagcdn.com/w40/et.png",
  ar: "https://flagcdn.com/w40/sa.png",
  zh: "https://flagcdn.com/w40/cn.png",
};

const LANGUAGES: Language[] = ["en", "am", "ti", "om", "ar", "zh"];

const VendorLanguage: React.FC = () => {
  const { language, setLanguage, isRTL, t } = useAppSettings();

  // Load stored vendor language
  useEffect(() => {
    const storedLang = localStorage.getItem("vendor-language") as Language | null;
    if (storedLang && LANGUAGES.includes(storedLang)) setLanguage(storedLang);
  }, [setLanguage]);

  const handleChangeLanguage = (code: Language) => {
    setLanguage(code);
    localStorage.setItem("vendor-language", code);
  };

  return (
    <div className={`vendor-language ${isRTL ? "rtl" : ""}`}>
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
              <img src={FLAG_IMAGES[code]} alt={code} className="flag-image" />
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

export default VendorLanguage;
