/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7f0",
          100: "#e7efdc",
          200: "#d2dfbb",
          300: "#b3c78f",
          400: "#93ae64",
          500: "#789149",
          600: "#5f7438",
          700: "#49592d",
          800: "#394626",
          900: "#2d381f"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(24, 39, 75, 0.12)"
      }
    }
  },
  plugins: []
};

