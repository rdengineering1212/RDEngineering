import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        brandNavy: "#0A1628",
        secondaryNavy: "#162338",
        cardNavy: "#1B2738",
        mutedGray: "#A8B3C5",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          50: "#f0f4fa",
          100: "#d9e2f0",
          200: "#b3c8e1",
          300: "#8daed2",
          400: "#6694c3",
          500: "#4a7ab4",
          600: "#3a6396",
          700: "#2d4d78",
          800: "#1f375a",
          900: "#0A1628",
          950: "#050d18",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          50: "#fcf6e7",
          100: "#f8edcf",
          200: "#f1db9f",
          300: "#eac96f",
          400: "#e3b74f",
          500: "#D4AF37",
          600: "#b8942e",
          700: "#9a7925",
          800: "#7c5e1c",
          900: "#5e4313",
          950: "#3f280a",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          dark: "hsl(var(--background))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          light: "hsl(var(--foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        heading: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        button: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.7) 100%)",
        "section-gradient":
          "linear-gradient(180deg, #F8FAFC 0%, #f1f5f9 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
