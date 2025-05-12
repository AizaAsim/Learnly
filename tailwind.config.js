import tailwindAnimate from "tailwindcss-animate";
import tailwindScrollbarHide from "tailwind-scrollbar-hide";

/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      scrollbar: ["rounded"],
      colors: {
        primaryBlue: "#1E3A8A", // Royal Blue
        lightBlue: "#4299e1",
        accentBlue: "#3B82F6", // Blue
        mediumBlue: "#3182ce",
        accentGold: "#F59E0B", // Amber/Gold
        darkBlue: "#172554",
        secondaryGrey: "#64748B", // Slate Gray
        baseWhite: "#F9FAFB", // Soft White
        highlight: "#10B981", // Emerald Green
        dark: {
          T100: "var(--grayscale-100)",
          T90: "var(--grayscale-90)",
          T80: "var(--grayscale-80)",
          T70: "var(--grayscale-70)",
          T60: "var(--grayscale-60)",
          T50: "var(--grayscale-50)",
          T40: "var(--grayscale-40)",
          T30: "var(--grayscale-30)",
          T24: "var(--grayscale-24)",
          T20: "var(--grayscale-20)",
          T16: "var(--grayscale-16)",
          T12: "var(--grayscale-12)",
          T8: "var(--grayscale-8)",
          T6: "var(--grayscale-6)",
          T4: "var(--grayscale-4)",
          T2: "var(--grayscale-2)",
        },
        light: {
          T100: "var(--light-100)",
          T90: "var(--light-90)",
          T80: "var(--light-80)",
          T70: "var(--light-70)",
          T60: "var(--light-60)",
          T50: "var(--light-50)",
          T40: "var(--light-40)",
          T30: "var(--light-30)",
          T24: "var(--light-24)",
          T20: "var(--light-20)",
          T16: "var(--light-16)",
          T12: "var(--light-12)",
          T8: "var(--light-8)",
          T4: "var(--light-4)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        grayscale: {
          100: "var(--grayscale-100)",
          90: "var(--grayscale-90)",
          84: "var(--grayscale-84)",
          80: "var(--grayscale-80)",
          70: "var(--grayscale-70)",
          60: "var(--grayscale-60)",
          50: "var(--grayscale-50)",
          40: "var(--grayscale-40)",
          30: "var(--grayscale-30)",
          24: "var(--grayscale-24)",
          20: "var(--grayscale-20)",
          16: "var(--grayscale-16)",
          14: "var(--grayscale-14)",
          12: "var(--grayscale-12)",
          8: "var(--grayscale-8)",
          6: "var(--grayscale-6)",
          4: "var(--grayscale-4)",
        },
        red: {
          DEFAULT: "var(--red)",
          d1: "var(--red-d1)",
          d2: "var(--red-d2)",
          l1: "var(--red-l1)",
          t50: "var(--red-t50)",
          t30: "var(--red-t30)",
          t10: "var(--red-t10)",
          t4: "var(--red-t4)",
        },
        green: {
          DEFAULT: "var(--green)",
          d1: "var(--green-d1)",
          d2: "var(--green-d2)",
          t50: "var(--green-t50)",
          t10: "var(--green-t10)",
          l2: "var(--green-l2)",
        },
        yellow: {
          DEFAULT: "var(--yellow)",
          d1: "var(--yellow-d1)",
          d2: "var(--yellow-d2)",
          t50: "var(--yellow-t50)",
          t20: "var(--yellow-t20)",
        },
        blue: {
          DEFAULT: "var(--blue)",
          d1: "var(--blue-d1)",
        },
        violet: { DEFAULT: "var(--violet)" },
        orange: {
          DEFAULT: "var(--orange)",
          d1: "var(--orange-d1)",
          t20: "var(--orange-t20)",
          t50: "var(--orange-t50)",
        },
      },
      borderRadius: {
        xxl: "calc(var(--radius) + 6px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0px",
      },
      lineHeight: {
        4.5: "18px",
      },
      boxShadow: {
        "blur-sm": "0px 0px 7px 0px rgba(0, 0, 0, 0.16)",
        blur: "0px 12px 40px 0px rgba(0, 0, 0, 0.25)",
        "blur-xl": "0px 12px 36px 0px rgba(0, 0, 0, 0.10)",
        "blur-2xl": "0px 8px 40px 0px rgba(0,0,0,0.14)",
      },
      backdropBlur: {
        5: "20px",
      },
      backgroundImage: {
        "hover-gradient":
          "linear-gradient(0deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.04) 100%), #FFFFFF",
      },
      scale: {
        200: "2",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        xs: "320px",
      },
    },
  },
  plugins: [tailwindAnimate, tailwindScrollbarHide],
};
