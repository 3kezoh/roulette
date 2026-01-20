import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    solidPlugin(),
    viteSingleFile(),
    tailwindcss()
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
