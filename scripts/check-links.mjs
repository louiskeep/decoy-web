// Crawl a built site directory and fail on internal links or anchors that do not resolve.
// Usage: node scripts/check-links.mjs dist
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist");
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!["_next", "api"].includes(e.name)) walk(p); }
    else if (e.name.endsWith(".html")) pages.push(p);
  }
})(root);

const ids = new Map();
const htmlOf = new Map();
for (const p of pages) {
  const html = fs.readFileSync(p, "utf8");
  htmlOf.set(p, html);
  ids.set(p, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

function resolve(href) {
  let [p, hash] = href.split("#");
  if (p === "") return { file: null, hash };
  if (!p.startsWith("/")) return null;
  p = p.replace(/\/$/, "/index.html");
  if (!path.extname(p)) {
    // Fumadocs export: /docs/foo -> docs/foo.html; marketing: /cli -> cli/index.html
    const flat = path.join(root, p + ".html");
    const nested = path.join(root, p, "index.html");
    if (fs.existsSync(flat)) return { file: flat, hash };
    return { file: nested, hash };
  }
  return { file: path.join(root, p), hash };
}

let errors = 0;
for (const p of pages) {
  if (p.includes(`${path.sep}docs${path.sep}`) || p.endsWith(`${path.sep}docs.html`)) continue; // vendored
  const html = htmlOf.get(p);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(href)) continue;
    const r = resolve(href);
    if (!r) { console.error(`${path.relative(root, p)}: relative link ${href}`); errors++; continue; }
    if (r.file && !r.file.endsWith(".html")) {
      if (!fs.existsSync(r.file)) { console.error(`${path.relative(root, p)}: missing asset ${href}`); errors++; }
      continue;
    }
    const target = r.file || p;
    if (!fs.existsSync(target)) { console.error(`${path.relative(root, p)}: broken link ${href}`); errors++; continue; }
    if (r.hash && ids.has(target) && !ids.get(target).has(r.hash)) {
      console.error(`${path.relative(root, p)}: missing anchor ${href}`); errors++;
    }
  }
}
console.log(errors ? `${errors} link problem(s)` : `links ok (${pages.length} pages)`);
process.exit(errors ? 1 : 0);
