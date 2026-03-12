import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detect environment
const isGHPages = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react()],
  base: isGHPages
    ? "/WEMS-Wedding-Events-Management-System/"
    : "/",
});
