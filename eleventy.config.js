import fs from "node:fs";
import path from "node:path";

const ICON_DIR = path.join(import.meta.dirname, "src/_includes/icons");

export default function (eleventyConfig) {
  // Static assets copied verbatim. The vendored Fumadocs export (docs/, _next/, api/) lives at the
  // repo root because its absolute /_next and /api/search paths cannot move.
  eleventyConfig.addPassthroughCopy({ docs: "docs", _next: "_next", api: "api" });
  // The export's own index page: served as /docs on clean-URL hosts and as /docs/ by directory.
  eleventyConfig.addPassthroughCopy({ "docs.html": "docs.html" });
  eleventyConfig.addPassthroughCopy({ "docs.html": "docs/index.html" });
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  // GSAP is self-hosted so motion pages make no third-party requests.
  for (const f of ["gsap", "ScrollTrigger", "SplitText"]) {
    eleventyConfig.addPassthroughCopy({ [`node_modules/gsap/dist/${f}.min.js`]: `js/vendor/${f}.min.js` });
  }
  for (const f of ["CNAME", "_headers", "_redirects", "robots.txt", "llms.txt", "sitemap.xml", "decoy-mark.png", "decoy-favicon-32.png"]) {
    eleventyConfig.addPassthroughCopy(`src/${f}`);
  }

  eleventyConfig.ignores.add("legacy/**");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.watchIgnores.add("dist/**");

  // {% icon "name" %} inlines an SVG from src/_includes/icons; keeps icons out of a sprite.
  eleventyConfig.addShortcode("icon", (name, cls = "") => {
    const file = path.join(ICON_DIR, `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Unknown icon: ${name}`);
    const svg = fs.readFileSync(file, "utf8").trim();
    return svg.replace("<svg", `<svg class="icon${cls ? " " + cls : ""}" aria-hidden="true" focusable="false"`);
  });

  // {% snippet "file" %} inlines a verified sample from src/_includes/snippets, HTML-escaped and
  // untouched by the template engine, so samples cannot drift from the files the checker reads.
  const SNIPPET_DIR = path.join(import.meta.dirname, "src/_includes/snippets");
  eleventyConfig.addShortcode("snippet", (name) => {
    const file = path.join(SNIPPET_DIR, name);
    if (!fs.existsSync(file)) throw new Error(`Unknown snippet: ${name}`);
    return fs.readFileSync(file, "utf8").trimEnd().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  });

  eleventyConfig.addFilter("absoluteUrl", (href, base) => new URL(href, base).href);
  eleventyConfig.addFilter("year", () => String(new Date().getFullYear()));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "dist" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
