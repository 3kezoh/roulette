import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{ts,tsx}"],
	daisyui: {
		themes: ["lofi"],
	},
	plugins: [daisyui],
} satisfies Config;
