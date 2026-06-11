import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f5f0ff",
          100: "#ede5ff",
          200: "#d9ccff",
          300: "#be9fff",
          400: "#a277ff", // Dynergie signature
          500: "#8b52f7",
          600: "#7830e3",
          700: "#6520c0",
          800: "#531c9c",
          900: "#451880",
        },
        lime: {
          brand: "#c5f135", // Dynergie logo background
        },
      },
    },
  },
  plugins: [],
};
export default config;
