const htmlmin = require("html-minifier");
const env = require("env-var");
const myTldjs = require(`tldjs`).fromUserSettings({
  validHosts: ["localhost"],
});

function base_url() {
  return env
    .get("BASE_URL")
    .default("https://live-collegemusic-co-uk.netlify.app")
    .asString();
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });

  eleventyConfig.addPassthroughCopy("static/");

  eleventyConfig.addPassthroughCopy({ "static/favicons/": "/" });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addShortcode("base_url", base_url);

  eleventyConfig.addShortcode("hostname", function () {
    const url = base_url();
    console.log(url);
    const hostname = myTldjs.parse(url).hostname;
    console.log(hostname);
    return hostname;
  });

  eleventyConfig.addShortcode("this_is_dev_server", function () {
    if (!process.env.ELEVENTY_PRODUCTION) {
      return "🚧 ";
    } else {
      return "";
    }
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
  });

  eleventyConfig.addPassthroughCopy({
    "./node_modules/@ryangjchandler/spruce/dist/spruce.umd.js":
      "./js/spruce.umd.js",
  });

  eleventyConfig.addPassthroughCopy({
    "./node_modules/@ryangjchandler/spruce/dist/spruce.umd.js.map":
      "./js/spruce.umd.js.map",
  });

  eleventyConfig.addPassthroughCopy({
    "./site.js": "./js/site.js",
  });

  eleventyConfig.addPassthroughCopy({
    "./assets/js/pwabuilder-sw-register.js": "./pwabuilder-sw-register.js",
  });

  eleventyConfig.addPassthroughCopy({
    "./assets/js/pwabuilder-sw.js": "./pwabuilder-sw.js",
  });
};
