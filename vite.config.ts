import babel from "vite-plugin-babel";
import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import devtoolsJson from "vite-plugin-devtools-json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    // react(),
    tailwindcss(),
    devtoolsJson(),
    babel({
      babelConfig: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});
