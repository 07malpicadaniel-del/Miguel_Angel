import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Prevenir que Vite borre la pantalla de Rust
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: true, // Permite escuchar en la red local
  },
});
