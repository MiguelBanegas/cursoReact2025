import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "public", // Asegura que sw.js se copie al build
  build: {
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Bootstrap
          bootstrap: ["bootstrap"],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
