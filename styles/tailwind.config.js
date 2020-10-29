module.exports = {
  purge: {
    content: ["_site/**/*.html"],
    options: {
      whitelist: [],
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: { width: { 72: "18rem", 116: "29rem" }, zIndex: { "-10": "-10" } },
  },
  variants: {
    textColor: [
      "responsive",
      "hover",
      "focus",
      "group-hover",
      "group-focus",
      "active",
    ],
    backgroundColor: [
      "responsive",
      "hover",
      "focus",
      "group-hover",
      "group-focus",
      "active",
    ],
    backgroundOpacity: [
      "responsive",
      "hover",
      "focus",
      "group-hover",
      "group-focus",
      "active",
    ],
  },
  plugins: [],
};
