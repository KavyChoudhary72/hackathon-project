import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#082119",
          800: "#0E3B2E", // Primary Dark Green
          700: "#17553F",
          600: "#1E9E5A", // Accent Green
          500: "#22C55E",
          100: "#E3F5EA",
          50: "#EEF8F1",
        },
        accent: {
          600: "#C2410C",
          500: "#F2622E", // Primary Vibrant Coral/Orange
          400: "#F7A55B",
          100: "#FDE8DD",
          50: "#FFF6E5",
        },
        surface: {
          base: "#F6F5F1", // Warm background from HTML spec
          card: "#FFFFFF",
          subtle: "#F1F0EB",
          border: "#ECE9E1",
          muted: "#5B6661",
        },
      },
      borderRadius: {
        "card": "22px",
        "pill": "999px",
        "sidebar": "28px",
      },
      fontFamily: {
        outfit: ["'Outfit'", "sans-serif"],
        plus: ["'Plus Jakarta Sans'", "sans-serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        hindi: ["'Noto Sans Devanagari'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
