// src/Attendee/AttendeeAppearance.tsx
import React, { useEffect } from "react";
import { useAppAppearance } from "../Contexts/AppAppearanceContext"; // shared context
import type { Theme } from "../Contexts/AppAppearanceContext";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // for t()
import "./AttendeeAppearance.css"; // can reuse the same CSS

const themes: { labelKey: string; value: Theme }[] = [
  { labelKey: "light", value: "light" },
  { labelKey: "dark", value: "dark" },
  { labelKey: "system", value: "system" },
];

const AttendeeAppearance: React.FC = () => {
  const { theme, setTheme, applyTheme } = useAppAppearance();
  const { t } = useAppSettings();

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
    localStorage.setItem("app-theme", selected);
  };

  return (
    <div className="attendee-appearance-page">
      <h2>{t("appearanceSettings")}</h2>
      <p>{t("themeDescription")}</p>

      <div className="theme-selector">
        <label htmlFor="theme-select">{t("chooseTheme")}</label>
        <select id="theme-select" value={theme} onChange={handleChange}>
          {themes.map((tItem) => (
            <option key={tItem.value} value={tItem.value}>
              {t(tItem.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="preview-box">
        <p>
          {t("livePreview")} <strong>{t(theme)}</strong>.
        </p>
      </div>
    </div>
  );
};

export default AttendeeAppearance;
