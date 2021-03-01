module.exports = {
  purge: {
    content: ["_site/**/*.html", "_site/**/*.js"],
    options: {
      safelist: [],
    },
  },
  darkMode: false,
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      black: "#000",
      white: "#fff",

      primary: "#2F1F60",

      gray: {
        100: "#f7fafc",
        200: "#edf2f7",
        300: "#e2e8f0",
        400: "#cbd5e0",
        500: "#a0aec0",
        600: "#718096",
        700: "#4a5568",
        800: "#2d3748",
        900: "#1a202c",
      },
      red: {
        100: "#fff5f5",
        200: "#fed7d7",
        300: "#feb2b2",
        400: "#fc8181",
        500: "#f56565",
        600: "#e53e3e",
        700: "#c53030",
        800: "#9b2c2c",
        900: "#742a2a",
      },
      orange: {
        100: "#fffaf0",
        200: "#feebc8",
        300: "#fbd38d",
        400: "#f6ad55",
        500: "#ed8936",
        600: "#dd6b20",
        700: "#c05621",
        800: "#9c4221",
        900: "#7b341e",
      },
      yellow: {
        100: "#fffff0",
        200: "#fefcbf",
        300: "#faf089",
        400: "#f6e05e",
        500: "#ecc94b",
        600: "#d69e2e",
        700: "#b7791f",
        800: "#975a16",
        900: "#744210",
      },
      green: {
        100: "#f0fff4",
        200: "#c6f6d5",
        300: "#9ae6b4",
        400: "#68d391",
        500: "#48bb78",
        600: "#38a169",
        700: "#2f855a",
        800: "#276749",
        900: "#22543d",
      },
      teal: {
        100: "#e6fffa",
        200: "#b2f5ea",
        300: "#81e6d9",
        400: "#4fd1c5",
        500: "#38b2ac",
        600: "#319795",
        700: "#2c7a7b",
        800: "#285e61",
        900: "#234e52",
      },
      blue: {
        100: "#ebf8ff",
        200: "#bee3f8",
        300: "#90cdf4",
        400: "#63b3ed",
        500: "#4299e1",
        600: "#3182ce",
        700: "#2b6cb0",
        800: "#2c5282",
        900: "#2a4365",
      },
      indigo: {
        100: "#ebf4ff",
        200: "#c3dafe",
        300: "#a3bffa",
        400: "#7f9cf5",
        500: "#667eea",
        600: "#5a67d8",
        700: "#4c51bf",
        800: "#434190",
        900: "#3c366b",
      },
      purple: {
        100: "#faf5ff",
        200: "#e9d8fd",
        300: "#d6bcfa",
        400: "#b794f4",
        500: "#9f7aea",
        600: "#805ad5",
        700: "#6b46c1",
        800: "#553c9a",
        900: "#44337a",
      },
      pink: {
        100: "#fff5f7",
        200: "#fed7e2",
        300: "#fbb6ce",
        400: "#f687b3",
        500: "#ed64a6",
        600: "#d53f8c",
        700: "#b83280",
        800: "#97266d",
        900: "#702459",
      },
    },
    gradientColorStops: (theme) => ({
      ...theme("colors"),
      "gray-translucent": "rgba(18, 21, 96, 0.17)",
    }),
    extend: {
      maxWidth: { "prose-xl": "80ch" },
      width: { 116: "29rem", 232: "58rem" },
      zIndex: { "-10": "-10" },
      padding: {
        27: "6.75rem",
        30: "7.5rem",
        "1/8": "12.5%",
        "1/4": "25%",
        "1/3-vmin": "33vmin",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["group-focus", "active"],
      backgroundColor: ["group-focus", "active"],
      backgroundOpacity: ["group-focus", "active"],
      padding: ["focus"],
      margin: ["focus"],
      ringWidth: ["hover", "focus-visible", "motion-reduce"],
      ringColor: ["hover", "focus-visible", "motion-reduce"],
      inset: ["focus"],
      transform: ["motion-reduce"],
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("tailwind-easing-gradients")({
      variants: ["responsive"],
      // required
      gradients: {
        ex1: ["#a4e", "#03d"], // must be two colors
        ex2: { easing: "ease-in-out", steps: 5, color: ["#4ae", "#0da"] },
        ex3: {
          easing: "cubic-bezier(0.48, 0.3, 0.64, 1)",
          color: ["#4ae", "#0da"],
        },
        ex4: { easing: "steps(4, skip-none)", color: ["#4ae", "#0da"] },
        "song-fade": { easing: "ease-in", color: ["rgba(0,0,0,0)", "#000"] },
        "song-fade-white": {
          easing: "ease-in",
          color: ["rgba(18, 21, 96, 0)", "rgba(18, 21, 96, 0.10)"],
        },
      },
      directions: {
        71.61: "71.61deg",
        hmmmm: "69deg",
        t: "to top",
        b: "to bottom",
        l: "to left",
        r: "to right",
      },
    }),
  ],
};
