// One-off: point the vendored docs export's header links at the redesigned pages. Re-run after
// re-vendoring the Fumadocs build.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const replacements = [['href="/features"', 'href="/cli/"'], ['\\"/features\\"', '\\"/cli/\\"'], ['"/features"', '"/cli/"']];
let changed = 0;
function patch(file) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const [from, to] of replacements) text = text.split(from).join(to);
  if (text !== before) { fs.writeFileSync(file, text); changed++; }
}
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|txt)$/.test(e.name)) patch(p);
  }
})(path.join(root, "docs"));
patch(path.join(root, "docs.html"));
console.log(`patched ${changed} file(s)`);
