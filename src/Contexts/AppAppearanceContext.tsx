import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

interface AppAppearanceContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme: Theme) => void;
}

const AppAppearanceContext = createContext<AppAppearanceContextType | undefined>(undefined);

export const AppAppearanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("app-theme") as Theme) || "system"
  );

  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;

    // Remove old classes
    root.classList.remove("light", "dark", "system");

    let effectiveTheme = theme;

    // system mode
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effectiveTheme = prefersDark ? "dark" : "light";
    }

    // add class for styling
    root.classList.add(effectiveTheme);

    // set CSS variables
    if (effectiveTheme === "light") {
        root.style.setProperty("--bg-color", "#ffffff");
        root.style.setProperty("--text-color", "#333333");
        root.style.setProperty("--border-color", "#ccc");
        root.style.setProperty("--sidebar-bg", "#f2f2f2");
        root.style.setProperty("--sidebar-text", "#333");
      } else if (effectiveTheme === "dark") {
        root.style.setProperty("--bg-color", "#1e1e1e");
        root.style.setProperty("--text-color", "#f5f5f5");
        root.style.setProperty("--border-color", "#555");
        root.style.setProperty("--sidebar-bg", "#2c2c2c");
        root.style.setProperty("--sidebar-text", "#f5f5f5");
      }
      
  }, []);

  // Apply theme on load and when changed
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return (
    <AppAppearanceContext.Provider value={{ theme, setTheme, applyTheme }}>
      {children}
    </AppAppearanceContext.Provider>
  );
};

export const useAppAppearance = () => {
  const context = useContext(AppAppearanceContext);
  if (!context) throw new Error("useAppAppearance must be used within AppAppearanceProvider");
  return context;
};
