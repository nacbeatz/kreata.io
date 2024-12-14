/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        euclid: ["EuclidCircular", "sans-serif"], // Define the custom font
      },
    },
  },
  plugins: [],
}

