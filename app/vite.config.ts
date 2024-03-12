import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import path, { resolve } from "path";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "images/superalliancelogo.png"],
  manifest: {
    name: "SuperAlliance",
    short_name: "SA",
    description: "Team 7028's Most Advanced Scouting Tool",
    icons: [
      {
        src: "/images/superalliancelogo.png",
        sizes: "2000x2000",
        type: "image/png",
        purpose: "apple touch icon",
      },
    ],
    theme_color: "#000000",
    background_color: "#000000",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
});
