import React, { useEffect } from "react";
import { useAppAppearance } from "../Contexts/AppAppearanceContext"; // shared context
import type { Theme } from "../Contexts/AppAppearanceContext";
import { useAppSettings } from "../Contexts/AppSettingsContext"; // translation hook
import "./AdminAppearance.css";

const AdminAppearance: React.FC = () => {
  const { t } = useAppSettings();
  const { theme, setTheme, applyTheme } = useAppAppearance();

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
    localStorage.setItem("app-theme", selected);
  };

  const themes: { label: string; value: Theme }[] = [
    { label: t("themeLight"), value: "light" },
    { label: t("themeDark"), value: "dark" },
    { label: t("themeSystem"), value: "system" },
  ];

  return (
    <div className="admin-appearance-page">
      <h2>{t("appearanceSettings")}</h2>
      <p>{t("appearanceDescription")}</p>

      <div className="theme-selector">
        <label htmlFor="theme-select">{t("chooseTheme")}</label>
        <select id="theme-select" value={theme} onChange={handleChange}>
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="preview-box">
        <p>
          {t("livePreview")} <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)}</strong>.
        </p>
      </div>
    </div>
  );
};

export default AdminAppearance;
