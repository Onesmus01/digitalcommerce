/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shop_light_pink: "#fcf0e4",
        shop_dark_green: "#063c28",
        shop_btn_dark_green: "#063d29",
        shop_light_bg: "#f6f6f6",
        shop_light_green: "#3b9c3c",
        shop_orange: "#fb6c08",
        darkColor: "#151515",
        lightColor: "#52525b",
        lightOrange: "#fca99b",
        deal_bg: "#f1f3f8",
      },
    },
  },
  plugins: [],
}