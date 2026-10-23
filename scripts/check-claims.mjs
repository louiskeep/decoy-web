// Banned-claim check over built marketing pages (the vendored docs are excluded). The patterns
// mirror BLOCKING_PATTERNS in decoy-platform/scripts/check_docs.py. "Launching soon" is used on
// purpose for the pre-launch banner and is not in this list.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist");
const patterns = [
  [/\bfully supported\b/i, "'fully supported'"],
  [/\bproduction[- ]ready\b/i, "'production-ready'"],
  [/\bcompliance[- ]certified\b/i, "'compliance-certified'"],
  [/\bcompliance[- ]ready\b/i, "'compliance-ready'"],
  [/\bSOC ?2\b.{0,30}\b(certified|achieved|complete|compliant)\b/i, "SOC 2 certified language"],
  [/\b(HIPAA|GDPR|PCI|FedRAMP)[- ]compliant\b/i, "framework-compliant claim"],
  [/\bcertified\s+(FF1|FF3|FPE)\b/i, "certified FPE claim"],
  [/\b(NIST|FIPS)[- ]validated\b/i, "NIST/FIPS-validated claim"],
  [/\bForge\b/, "pre-rename 'Forge' reference"],
  [/\bcoming soon\b/i, "'coming soon'"],
  [/\bDecoy Studio\b/, "'Decoy Studio' (the product is Decoy Platform)"],
  [/\u2014/, "em dash"],
];

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!["docs", "_next", "api", "js", "css"].includes(e.name)) walk(p); }
    else if (e.name.endsWith(".html") && e.name !== "docs.html") pages.push(p);
  }
})(root);

let errors = 0;
for (const p of pages) {
  const text = fs.readFileSync(p, "utf8").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  for (const [re, label] of patterns) {
    const m = text.match(re);
    if (m) { console.error(`${path.relative(root, p)}: ${label}: "${m[0]}"`); errors++; }
  }
}
console.log(errors ? `${errors} claim problem(s)` : `claims ok (${pages.length} pages)`);
process.exit(errors ? 1 : 0);
