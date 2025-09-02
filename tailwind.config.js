/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        souldiers: {
          black: "#0a0a0a",
          gold: "#FFD700",
          gray: "#1f1f1f",
          accent: "#FFB81C"
        },
      },
    },
  },
}
