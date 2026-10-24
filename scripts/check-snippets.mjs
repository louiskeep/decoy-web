// Every YAML snippet must parse, and every `decoy <command>` shown on the site must be a
// command the CLI actually ships. The command surface is read from the vendored CLI reference
// (docs-src/content/docs/reference/cli/_source/cli-reference.md), which scripts/sync-cli-reference.mjs
// syncs from the decoy repo, so this check tracks the real CLI instead of a hand-kept list.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = path.resolve(import.meta.dirname, "..");
const snippets = path.join(root, "src/_includes/snippets");
const cliReference = path.join(root, "docs-src/content/docs/reference/cli/_source/cli-reference.md");
let errors = 0;

for (const f of fs.readdirSync(snippets)) {
  if (!/\.ya?ml$/.test(f)) continue;
  try { YAML.parse(fs.readFileSync(path.join(snippets, f), "utf8")); }
  catch (e) { console.error(`${f}: invalid YAML: ${e.message}`); errors++; }
}

// Command surface from the vendored reference: "## `decoy <cmd>`" groups and
// "### `decoy <cmd> <sub>`" subcommand headings.
const refText = fs.readFileSync(cliReference, "utf8");
const known = new Set();
const subcommands = {};
for (const m of refText.matchAll(/^## `decoy ([a-z][a-z-]*)`/gm)) known.add(m[1]);
for (const m of refText.matchAll(/^### `decoy ([a-z][a-z-]*) ([a-z][a-z-]*)`/gm)) {
  (subcommands[m[1]] ??= []).push(m[2]);
}
// Sanity floor mirrors build-cli-mdx: a near-empty parse means the reference
// format changed, not that the CLI shrank to nothing.
if (known.size < 12) { console.error(`CLI reference parsed only ${known.size} commands; expected >= 12 -- check the vendored reference`); errors++; }

const sources = [];
for (const f of fs.readdirSync(snippets)) sources.push({ name: `snippets/${f}`, text: fs.readFileSync(path.join(snippets, f), "utf8") });
for (const f of fs.readdirSync(path.join(root, "src")).filter((n) => n.endsWith(".njk"))) {
  const html = fs.readFileSync(path.join(root, "src", f), "utf8");
  const blocks = [...html.matchAll(/<(pre|code)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => m[2]);
  sources.push({ name: f, text: blocks.join("\n") });
}

for (const { name, text } of sources) {
  // The optional second token is a subcommand only when it is a bare word; the
  // negative lookahead keeps a file argument like "scan customers.csv" from
  // being read as a subcommand.
  for (const m of text.matchAll(/\bdecoy ([a-z][a-z-]*)(?: ([a-z][a-z-]*)(?![\w./-]))?/g)) {
    const cmd = m[1];
    if (!known.has(cmd)) { console.error(`${name}: unknown command "decoy ${cmd}"`); errors++; continue; }
    const sub = m[2];
    if (sub && subcommands[cmd] && !subcommands[cmd].includes(sub)) { console.error(`${name}: unknown subcommand "decoy ${cmd} ${sub}"`); errors++; }
  }
}
console.log(errors ? `${errors} snippet problem(s)` : "snippets ok");
process.exit(errors ? 1 : 0);
