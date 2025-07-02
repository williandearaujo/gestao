import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Verifica se está rodando no Replit (mantém compatibilidade)
const isReplit = process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined;

export default defineConfig(async () => {
  const cartographerPlugin = isReplit
    ? [(await import("@replit/vite-plugin-cartographer")).cartographer()]
    : [];

  return {
    plugins: [react(), runtimeErrorOverlay(), ...cartographerPlugin],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000, // Corrige o loop de refresh causado por arquivos como os do Clerk
      },
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
