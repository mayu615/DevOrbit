/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // custom blue
        secondary: "#64748b", // custom gray
        accent: "#f59e0b", // amber
      },
    },
  },
  plugins: [],
};
