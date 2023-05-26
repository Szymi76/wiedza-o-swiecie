const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addComponents({
        ".absolute-center": {
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        },
        ".primary-layout": {
          backgroundColor: "rgba(31, 41, 55, 0.9)",
          borderRadius: "0.5rem",
          padding: "1rem",
          color: "white",
        },
        ".btn": {
          backgroundColor: "white",
          height: "48px",
          padding: ".25rem 2.5rem",
          "@media (max-width: 650px)": {
            padding: "0.75rem 1.75rem",
          },
          borderRadius: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: ".75rem",
          color: "black",
          fontWeight: "700",
          // transition: "scale, transform",
          transitionDuration: "150ms",
          outlineColor: "black",
          textTransform: "uppercase",
          "&:hover": {
            scale: ".96",
            transform: "translateY(3px)",
          },
          "&:focus": {
            scale: ".96",
          },
          "&:active": {
            scale: ".90",
          },
        },
      });
    }),
  ],
};
