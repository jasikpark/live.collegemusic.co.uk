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
  variants: {},
  plugins: [],
};
