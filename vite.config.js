/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    port: 5173,
    open: true,
    
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "alumnitestpsgcas.psginstitutions.in",
      "alumni.psgcas.ac.in",
      "www.alumni.psgcas.ac.in",
    ],
    
    // ✅ Proxy API requests to backend
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },

    // ✅ FIX: Service Worker Configuration
    middlewareMode: false,
    headers: {
      "Service-Worker-Allowed": "/",
      "Cache-Control": "public, max-age=3600",
    },
  },

  // ✅ Build optimizations
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    chunkSizeWarningLimit: 1024,
    
    assetsDir: "assets",
    assetsInlineLimit: 4096,
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["framer-motion", "lucide-react"],
          charts: ["recharts"],
          maps: ["leaflet", "react-leaflet"],
        },
      },
    },
  },

  // ✅ Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "axios",
      "recharts",
      "leaflet",
      "react-leaflet",
    ],
    // Exclude service worker from optimization
    exclude: ["public/service-worker.js"],
  },

  // ✅ Environment variables
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:5000"
    ),
    "import.meta.env.VITE_API_BASE": JSON.stringify("/api"),
  },

  // ✅ CSS preprocessing
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
});