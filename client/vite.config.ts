import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

import scss from "rollup-plugin-scss";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    scss(),
    alias({
      entries: [
        {
          find: "services",
          replacement: resolve("./src/services"),
        },
        {
          find: "features",
          replacement: resolve("./src/features"),
        },
        {
          find: "components",
          replacement: resolve("./src/components"),
        },
        {
          find: "app",
          replacement: resolve("./src/app"),
        },
      ],
    }),
  ],
  root: "./",
  build: {
    outDir: "dist",
  },
  publicDir: "public",
  server: {
    watch: {
      usePolling: true,
    },
  },
});
