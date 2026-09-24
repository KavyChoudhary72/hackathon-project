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
          900: "#0B241B",
          800: "#113A2B", // Primary Forest Green
          700: "#1B4332", // Active Nav / Accent Green
          600: "#2D6A4F",
          500: "#40916C",
          400: "#52B788",
          300: "#74C69D",
          200: "#95D5B2",
          100: "#E8F5E9", // Mint / Sage Tint
          50: "#F2F9F4",
        },
        accent: {
          600: "#E05326",
          500: "#F9683A", // Vibrant Coral Orange
          400: "#FB8562",
          100: "#FFE8E0",
          50: "#FFF4F0",
        },
        surface: {
          base: "#FAF9F5", // Warm cream/mist background
          card: "#FFFFFF",
          subtle: "#F4F6F5",
          dark: "#121C18",
          darkCard: "#182621",
        },
        tier: {
          1: {
            bg: "#DCFCE7",
            text: "#166534",
            border: "#86EFAC",
          },
          2: {
            bg: "#FEF3C7",
            text: "#92400E",
            border: "#FCD34D",
          },
          3: {
            bg: "#EFEBE7",
            text: "#78350F",
            border: "#D7CCC8",
          },
        },
        reward: {
          friend: "#22C55E",
          supporter: "#10B981",
          hero: "#F59E0B",
          changemaker: "#8B5CF6",
          leader: "#F43F5E",
        },
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        card: "0 10px 30px -4px rgba(17, 58, 43, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 20px 35px -5px rgba(17, 58, 43, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.04)",
        float: "0 25px 50px -12px rgba(17, 58, 43, 0.15)",
        pressed: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
      },
      scale: {
        97: "0.97",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        hindi: ["var(--font-noto-hindi)", "sans-serif"],
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
