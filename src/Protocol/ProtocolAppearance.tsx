// src/Protocol/ProtocolAppearance.tsx
import React, { useEffect } from "react";
import type { ChangeEvent } from "react";

import { useAppAppearance } from "../Contexts/AppAppearanceContext";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import type { Theme } from "../Contexts/AppAppearanceContext";
import "./ProtocolAppearance.css";

const THEMES: ReadonlyArray<{ labelKey: string; value: Theme }> = [
  { labelKey: "light", value: "light" },
  { labelKey: "dark", value: "dark" },
  { labelKey: "system", value: "system" },
];

const STORAGE_KEY = "protocol-theme";

const ProtocolAppearance: React.FC = () => {
  const { theme, setTheme, applyTheme } = useAppAppearance();
  const { t } = useAppSettings();

  /**
   * Apply theme whenever it changes
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  /**
   * Handle theme selection
   */
  const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value as Theme;

    setTheme(selectedTheme);
    localStorage.setItem(STORAGE_KEY, selectedTheme);
  };

  return (
    <section
      className="protocol-appearance-page"
      aria-labelledby="protocol-appearance-title"
    >
      <header className="appearance-header">
        <h2 id="protocol-appearance-title">
          {t("appearanceSettings")}
        </h2>

        <p className="appearance-description">
          {t("appearanceDescription")}
        </p>
      </header>

      <div className="theme-selector">
        <label htmlFor="protocol-theme-select">
          {t("theme")}
        </label>

        <select
          id="protocol-theme-select"
          className="theme-select"
          value={theme}
          onChange={handleThemeChange}
          aria-describedby="theme-preview"
        >
          {THEMES.map(({ labelKey, value }) => (
            <option key={value} value={value}>
              {t(labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div
        className="preview-box"
        id="theme-preview"
        aria-live="polite"
      >
        <p>
          {t("livePreview")}{" "}
          <strong>
            {t(theme)}
          </strong>
        </p>
      </div>
    </section>
  );
};

export default ProtocolAppearance;
