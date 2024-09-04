import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  daisyui: {
    themes: ["lofi"],
  },
  plugins: [daisyui],
} satisfies Config;
