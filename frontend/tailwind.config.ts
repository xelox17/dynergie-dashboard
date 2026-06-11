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
        // Dynergie brand green — basé sur #7BC67E (vert signature)
        brand: {
          50:  "#f1faf1",
          100: "#dff3e0",
          200: "#bde7bf",
          300: "#92d595",
          400: "#7bc67e", // couleur principale Dynergie
          500: "#58b05c",
          600: "#3f9643",
          700: "#2e7a32",
          800: "#1f6023",
          900: "#154a18",
        },
      },
    },
  },
  plugins: [],
};
export default config;
