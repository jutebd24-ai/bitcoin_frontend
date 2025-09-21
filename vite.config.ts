import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react()];
  if (process.env.REPLIT || process.env.REPL_ID) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer() as unknown as PluginOption);
  }
  return {
    plugins,
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
      "@assets": fileURLToPath(new URL("../attached_assets", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
          ],
          "chart-vendor": ["lightweight-charts", "recharts"],
          "motion-vendor": ["framer-motion"],
        },
      },
    },
  },
  server: {
    port: 8000,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:9000",
        changeOrigin: true,
        ws: true,
      },
      "/ws": {
        target: "http://localhost:9000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  };
});