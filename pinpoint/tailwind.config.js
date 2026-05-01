/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
            fontFamily: {
                Lexend: ["Lexend", "sans-serif"],
                LexendBold: ["Lexend-Bold", "sans-serif"],
                LexendLight: ["Lexend-Light", "sans-serif"],
                LexendMedium: ["Lexend-Medium", "sans-serif"],
                LexendSemiBold: ["Lexend-SemiBold", "sans-serif"],
                Montserrat: ["Montserrat", "sans-serif"],
                MontserratBold: ["Montserrat-Bold", "sans-serif"],
                MontserratLight: ["Montserrat-Light", "sans-serif"],
                MontserratMedium: ["Montserrat-Medium", "sans-serif"],
                MontserratSemiBold: ["Montserrat-SemiBold", "sans-serif"],
                MontserratItalic: ["Montserrat-Italic", "sans-serif"],
            },
    },
  },
  plugins: [],
}