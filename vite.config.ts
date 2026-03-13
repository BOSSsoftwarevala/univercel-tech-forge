import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Minify to reduce attack surface via source leakage
    minify: "esbuild",
    // Split vendor chunks for better caching and smaller bundles
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Keep supabase separate so it can be audited independently
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("react")) return "react-vendor";
            return "vendor";
          }
        },
      },
    },
    // Warn if any individual chunk exceeds 500 kB (helps spot bundle bloat)
    chunkSizeWarningLimit: 500,
  },
  // Prevent environment variables other than VITE_ prefixed ones from leaking
  envPrefix: "VITE_",
}));
