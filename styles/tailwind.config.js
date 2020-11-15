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
    extend: {
      width: { 7: "1.75rem", 72: "18rem", 116: "29rem", 232: "58rem" },
      height: { 7: "1.75rem" },
      zIndex: { "-10": "-10" },
      inset: { "-6": "-1.5rem", "-12": "-3rem" },
      padding: { 30: "7.5rem", "1/8": "12.5%", "1/4": "25%" },
    },
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
