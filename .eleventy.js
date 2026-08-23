const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");
const markdownIt = require("markdown-it")({ html: false });

async function imageShortcode(src, alt, sizes = "100vw", loading = "lazy") {
  if (alt === undefined) {
    throw new Error(`Missing alt text for image: ${src}`);
  }

  let cleanSrc = src.replace(/^\/+/, "");

  let metadata = await Image(path.join("src", cleanSrc), {
    widths: [480, 768, 1200, 1600],
    formats: ["avif", "webp", "jpeg"],
    outputDir: path.join("_site", "assets", "images", "optimized"),
    urlPath: "/assets/images/optimized/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading,
    decoding: "async",
  };

  if (loading === "eager") {
    imageAttributes.fetchpriority = "high";
    delete imageAttributes.loading;
  }

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.png": "favicon.png" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("markdownify", (value) => markdownIt.renderInline(value || ""));

  eleventyConfig.addShortcode("inlineCSS", function (...files) {
    return files
      .map((file) => fs.readFileSync(path.join("src", "assets", "css", file), "utf8"))
      .join("\n");
  });

  eleventyConfig.addWatchTarget("src/assets/css/");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
