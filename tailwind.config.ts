import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {}
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        darkTheme: "night",
        themes: ["light", "night"]
    }
} satisfies Config;
