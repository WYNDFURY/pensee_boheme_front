/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
        bgcolor: "#FFF9F2",
        primary_green: "#E6EEDC",
        secondary_green: "#ADBA9E",
        accent: "#603E65",
        primary_orange: "#FFEFF1",
        secondary_orange: "#FFECD6",
        primage_pink: "#FFE9EB",
      },
    },
  },
  plugins: [],
};
