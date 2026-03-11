// src/Couple/CoupleAppearance.tsx
import React, { useEffect } from "react";
import type { ChangeEvent } from "react";
import { useAppAppearance } from "../Contexts/AppAppearanceContext";
import type { Theme } from "../Contexts/AppAppearanceContext";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // for translations
import "./CoupleAppearance.css";

const themes: { labelKey: string; value: Theme }[] = [
  { labelKey: "light", value: "light" },
  { labelKey: "dark", value: "dark" },
  { labelKey: "system", value: "system" },
];

const CoupleAppearance: React.FC = () => {
  const { theme, setTheme, applyTheme } = useAppAppearance();
  const { t } = useAppSettings();

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
    localStorage.setItem("app-theme", selected);
  };

  return (
    <div className="couple-appearance-page">
      <h2>{t("appearanceSettings")}</h2>
      <p>{t("appearanceDescription")}</p>

      <div className="theme-selector">
        <label htmlFor="couple-theme-select">{t("chooseTheme")}:</label>
        <select
          id="couple-theme-select"
          value={theme}
          onChange={handleChange}
          className="theme-select"
        >
          {themes.map((tItem) => (
            <option key={tItem.value} value={tItem.value}>
              {t(tItem.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="preview-box">
        <p>
          {t("livePreview")}{" "}
          <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)}</strong>.
        </p>
      </div>
    </div>
  );
};

export default CoupleAppearance;
