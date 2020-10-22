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
    extend: {},
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
