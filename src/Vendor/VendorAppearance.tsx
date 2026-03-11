// src/Vendor/VendorAppearance.tsx
import React, { useEffect } from "react";
import { useAppAppearance } from "../Contexts/AppAppearanceContext";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import type { Theme } from "../Contexts/AppAppearanceContext";
import "./VendorAppearance.css";

// Define available themes
const themes: { labelKey: string; value: Theme }[] = [
  { labelKey: "light", value: "light" },
  { labelKey: "dark", value: "dark" },
  { labelKey: "system", value: "system" },
];

const VendorAppearance: React.FC = () => {
  const { theme, setTheme, applyTheme } = useAppAppearance();
  const { t } = useAppSettings(); // translation function

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
    localStorage.setItem("app-theme", selected);
  };

  return (
    <div className="vendor-appearance-page max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{t("appearanceSettings")}</h2>
      <p className="mb-6 text-gray-600">{t("appearanceDescription")}</p>

      <div className="theme-selector mb-6 flex flex-col gap-2">
        <label htmlFor="theme-select" className="font-medium">
          {t("chooseTheme")}
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          {themes.map((tItem) => (
            <option key={tItem.value} value={tItem.value}>
              {t(tItem.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="preview-box p-4 border rounded bg-gray-50">
        <p>
          {t("themePreviewText")}{" "}
          <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)}</strong>.
        </p>
      </div>
    </div>
  );
};

export default VendorAppearance;
