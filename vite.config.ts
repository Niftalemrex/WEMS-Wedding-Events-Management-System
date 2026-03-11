import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Get the repository name
const repoName = "WEMS-Wedding-Events-Management-System";

export default defineConfig({
  // Set base dynamically based on environment
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  plugins: [react()],
  // Ensure assets are properly referenced
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});