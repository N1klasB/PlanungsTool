/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007bff",
          hover: "#0056d2",
        },
        secondary: {
          DEFAULT: "#e2e8f0",
          hover: "#cbd5e1",
        },
        danger: {
          DEFAULT: "#dc2626",
          hover: "#b91c1c",
        },
        info: {
          DEFAULT: "#dbeafe",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
