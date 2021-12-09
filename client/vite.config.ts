import { defineConfig } from "vite";
import { resolve } from "path";

import reactRefresh from "@vitejs/plugin-react-refresh";
import reactSvgPlugin from "vite-plugin-react-svg";
import scss from "rollup-plugin-scss";
import alias from "@rollup/plugin-alias";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    // scss(),
    reactSvgPlugin({
      // Default behavior when importing `.svg` files, possible options are: 'url' and `component`
      defaultExport: "url",
    }),
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
