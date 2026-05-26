import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://prime-pit-backend-production-1236.up.railway.app",
  //       // target: "http://localhost:4000",
  //       changeOrigin: true,
  //     },
  //   },
  // },
  assetsInclude: ["**/*.mpeg"],
  theme: {
    extend: {
      fontFamily: {
        protest: ['"Protest Riot"', "sans-serif"],
      },
    },
  },
});
