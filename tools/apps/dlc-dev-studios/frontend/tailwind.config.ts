import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#eab308", // gold
        secondary: "#0f172a", // dark background
      },
    },
  },
  plugins: [],
} satisfies Config
