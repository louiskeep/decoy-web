// Residual sentry for the removed STORM concept (marketing + docs site).
//
// Scans every tracked path and file content, plus the built site when dist/
// exists (HTML, JS, the search index, llms.txt), case-insensitively for the
// retired token, then checks an exact manifest of forbidden old commands,
// config keys, schema strings, routes and the removed canary surface (which the
// case-insensitive scan cannot see). Only EXCEPTIONS may keep an old literal.
// `--self-test` runs the scanner against seeded violations in every surface
// class so a clean run is never vacuous; `npm run check` runs both.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const RETIRED = /storm/i;

const FORBIDDEN_TOKENS = [
  "run_storm",
  "storm-post-mask",
  "storm_postmask",
  "storm_run_group_id",
  "decoy_engine.storm",
  "STORM_",
  "DECOY_STORM",
  "/docs/concepts/storm",
  // removed commands (hard rename, no aliases)
  "decoy scan",
  "decoy report integrity",
  "decoy report fidelity",
  "decoy explain storm",
  // removed canary surface (not a retired-name token)
  "canary_check",
  "canary-check",
  "CanaryReport",
  "/canary-check",
];

const FORBIDDEN_PATTERNS = [
  { name: "pipeline schema version 1 example", re: /^version: 1\s*$/m },
  { name: "pipeline schema version 1 in markup", re: /version: 1<\/span>/ },
];

// Exact paths only. Each records its purpose and whether it can reach the
// published site.
const EXCEPTIONS = [
  { path: "scripts/check-residual.mjs", purpose: "sentry definition", reachesPublished: false },
];

export function scan(files) {
  const hits = [];
  for (const f of files) {
    if (EXCEPTIONS.some((e) => e.path === f.path)) continue;
    if (RETIRED.test(f.path)) hits.push(`${f.path}: retired token in path`);
    if (RETIRED.test(f.content)) hits.push(`${f.path}: retired token in content`);
    for (const t of FORBIDDEN_TOKENS) if (f.content.includes(t)) hits.push(`${f.path}: forbidden token ${t}`);
    for (const p of FORBIDDEN_PATTERNS) if (p.re.test(f.content)) hits.push(`${f.path}: ${p.name}`);
  }
  return hits;
}

const BINARY = /\.(png|jpe?g|gif|ico|woff2?|ttf|otf|webp|avif|pdf|svg)$/i;

function readText(abs) {
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return "";
  }
}

function trackedFiles() {
  const out = execFileSync("git", ["-C", root, "ls-files", "-z"], { encoding: "utf8", maxBuffer: 1 << 28 });
  return out
    .split("\0")
    .filter(Boolean)
    .filter((p) => fs.existsSync(path.join(root, p)))
    .map((p) => ({ path: p, content: BINARY.test(p) ? "" : readText(path.join(root, p)) }));
}

function builtFiles() {
  const dist = path.join(root, "dist");
  if (!fs.existsSync(dist)) return [];
  const out = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else out.push({ path: `dist/${path.relative(dist, p)}`, content: BINARY.test(e.name) ? "" : readText(p) });
    }
  })(dist);
  return out;
}

function selfTest() {
  const seeded = {
    path: { path: "docs-src/components/marketing/Storm.tsx", content: "ok" },
    "marketing component": { path: "docs-src/components/marketing/a.tsx", content: 'name: "STORM"' },
    "docs content": { path: "docs-src/content/docs/a.mdx", content: "The STORM tab" },
    "config key": { path: "docs-src/content/docs/b.mdx", content: "`run_storm`: true" },
    "old command": { path: "src/cli.njk", content: "<code>decoy scan</code>" },
    "old report command": { path: "src/_includes/snippets/ci.yml", content: "- run: decoy report integrity x" },
    redirect: { path: "docs-src/public/_redirects", content: "/docs/concepts/storm /docs/x 301" },
    "schema version 1 snippet": { path: "src/_includes/snippets/pipeline.yaml", content: "version: 1\ntables: []\n" },
    "env var": { path: "docs-src/.env.example", content: "DECOY_STORM_X=1" },
    "canary symbol": { path: "docs-src/c.mdx", content: "canary_check" },
    "canary route": { path: "docs-src/d.mdx", content: "GET /canary-check" },
    "built bundle": { path: "dist/_next/static/x.js", content: 'a="storm"' },
    "search index": { path: "dist/api/search", content: '{"title":"Storm"}' },
  };
  let bad = 0;
  for (const [surface, file] of Object.entries(seeded)) {
    if (scan([file]).length === 0) {
      console.error(`self-test: seeded ${surface} violation was NOT detected`);
      bad++;
    }
  }
  if (scan([{ path: "docs-src/content/docs/ok.mdx", content: "decoy pre-scan x.csv\ndecoy post-scan integrity m.csv\nversion: 2\n" }]).length) {
    console.error("self-test: clean content was flagged");
    bad++;
  }
  if (scan([{ path: "scripts/check-residual.mjs", content: "storm" }]).length) {
    console.error("self-test: sentry definition exception not honoured");
    bad++;
  }
  if (scan([{ path: "scripts/other.mjs", content: "storm" }]).length === 0) {
    console.error("self-test: exception leaked to another path");
    bad++;
  }
  return bad;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const bad = selfTest();
  if (process.argv.includes("--self-test")) {
    console.log(bad ? `${bad} self-test failure(s)` : "residual sentry self-test ok");
    process.exit(bad ? 1 : 0);
  }
  if (bad) process.exit(1);
  const hits = scan([...trackedFiles(), ...builtFiles()]);
  for (const h of hits) console.error(h);
  console.log(hits.length ? `${hits.length} residual problem(s)` : "residual ok");
  process.exit(hits.length ? 1 : 0);
}
