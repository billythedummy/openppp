/* eslint-disable import/no-extraneous-dependencies */
// silence `'vite' should be listed in project's dependencies, not devDependencies`

import glob from "glob";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// import path from "path" causes eslint to crash for some reason
const path = require("path");

export default defineConfig({
  appType: "mpa",
  build: {
    // include source maps if env var set to true
    sourcemap: process.env.SOURCE_MAP === "true",
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(path.join(__dirname, "/**/*.html"))
          .filter(
            (htmlFilePath) =>
              !htmlFilePath.includes("dist/") &&
              !htmlFilePath.includes("node_modules/")
          )
          .map((htmlFilePath) => {
            const baseName = path.basename(htmlFilePath);
            return [
              baseName.slice(
                0,
                baseName.length - path.extname(baseName).length
              ),
              htmlFilePath,
            ];
          })
      ),
    },
  },
  plugins: [
    VitePWA({
      includeAssets: [`/favicon.ico`, `/apple-touch-icon.png`],
      manifestFilename: "site.webmanifest",
      manifest: {
        name: "OpenPPP",
        short_name: "OpenPPP",
        description: "The web platform for image processing",
        icons: [
          {
            src: `/android-chrome-512x512.png`,
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: `/android-chrome-192x192.png`,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: `/android-chrome-192x192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        start_url: `/index.html`,
        display: "fullscreen",
        // TODO: USE ACTUAL THEME COLORS
        theme_color: "#FFFFFF",
        background_color: "#FFFFFF",
      },
    }),
  ],
});
