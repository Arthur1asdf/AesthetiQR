/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          darkBrown: "#3D3131", // Define your custom color
        },
        fontFamily: {
          bagel: ["Bagel Fat One", "cursive"], // Custom font class
        },
      },
    },
    plugins: [],
  };
  