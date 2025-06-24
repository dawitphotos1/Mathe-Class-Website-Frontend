/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust if your file structure differs
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4361ee",
        "primary-light": "#4895ef",
        secondary: "#3f37c9",
        accent: "#f72585",
        dark: "#1b263b",
        light: "#f8f9fa",
        success: "#4cc9f0",
        warning: "#f8961e",
        danger: "#ef233c",
        gray: "#adb5bd",
      },
    },
  },
  plugins: [],
};
