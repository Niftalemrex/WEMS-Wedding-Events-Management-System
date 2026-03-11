import React, { useEffect } from "react";
import { useAppAppearance } from "../Contexts/AppAppearanceContext";
import type { Theme } from "../Contexts/AppAppearanceContext";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./ManagerAppearance.css";

const themes: { labelKey: string; value: Theme }[] = [
  { labelKey: "light", value: "light" },
  { labelKey: "dark", value: "dark" },
  { labelKey: "system", value: "system" },
];

const ManagerAppearance: React.FC = () => {
  const { t } = useAppSettings();
  const { theme, setTheme, applyTheme } = useAppAppearance();

  /** Apply theme whenever it changes */
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  /** Handle theme selection */
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
    localStorage.setItem("app-theme", selected);
  };

  return (
    <div className="manager-appearance-page p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">{t("appearanceSettings")}</h2>
      <p className="text-gray-600 mb-4">{t("appearanceDescription")}</p>

      {/* Theme Selector */}
      <div className="theme-selector mb-4 flex flex-col">
        <label htmlFor="theme-select" className="font-semibold mb-1">
          {t("chooseTheme")}
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          {themes.map((tItem) => (
            <option key={tItem.value} value={tItem.value}>
              {t(tItem.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {/* Live Preview */}
      <div className="preview-box p-4 border rounded bg-gray-50">
        <p>
          {t("livePreview")}{" "}
          <strong>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default ManagerAppearance;
