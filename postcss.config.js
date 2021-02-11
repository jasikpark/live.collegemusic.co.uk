module.exports = {
  plugins: [
    require(`tailwindcss`)(`./assets/css/tailwind.config.js`),
    require(`autoprefixer`),
    ...(process.env.NODE_ENV === "production"
      ? [
          require("cssnano")({
            preset: "default",
          }),
        ]
      : []),
    require(`postcss-focus-visible`),
  ],
};
