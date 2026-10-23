// Every YAML snippet must parse, and every `decoy <command>` mentioned on the site must be a
// command the vendored CLI reference documents (docs/reference/cli/<command>).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = path.resolve(import.meta.dirname, "..");
const snippets = path.join(root, "src/_includes/snippets");
const cliDocs = path.join(root, "docs/reference/cli");
let errors = 0;

for (const f of fs.readdirSync(snippets)) {
  if (!/\.ya?ml$/.test(f)) continue;
  try { YAML.parse(fs.readFileSync(path.join(snippets, f), "utf8")); }
  catch (e) { console.error(`${f}: invalid YAML: ${e.message}`); errors++; }
}

const known = new Set(fs.readdirSync(cliDocs).filter((n) => fs.statSync(path.join(cliDocs, n)).isDirectory()));
// Sub-commands the reference documents under their parent page.
const subcommands = { storm: ["analyze", "integrity", "fields", "show", "diff", "test"], validate: ["config", "distribution"], evidence: ["show", "verify"], report: ["render", "summarize", "compare", "show", "diff"], templates: ["list", "show"], vault: ["info"], strategies: ["list", "inspect"], providers: ["list", "inspect"] };

// Only code contexts are checked: snippet files whole, and <pre>/<code> blocks in templates.
const sources = [];
for (const f of fs.readdirSync(snippets)) sources.push({ name: `snippets/${f}`, text: fs.readFileSync(path.join(snippets, f), "utf8") });
for (const f of fs.readdirSync(path.join(root, "src")).filter((n) => n.endsWith(".njk"))) {
  const html = fs.readFileSync(path.join(root, "src", f), "utf8");
  const blocks = [...html.matchAll(/<(pre|code)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => m[2]);
  sources.push({ name: f, text: blocks.join("\n") });
}

for (const { name, text } of sources) {
  for (const m of text.matchAll(/\bdecoy (?:[a-z][a-z-]*)(?: [a-z][a-z-]*)?/g)) {
    const parts = m[0].split(" ").slice(1);
    const cmd = parts[0];
    if (!known.has(cmd)) { console.error(`${name}: unknown command "decoy ${cmd}"`); errors++; continue; }
    const sub = parts[1];
    if (sub && subcommands[cmd] && !subcommands[cmd].includes(sub)) { console.error(`${name}: unknown subcommand "decoy ${cmd} ${sub}"`); errors++; }
  }
}
console.log(errors ? `${errors} snippet problem(s)` : "snippets ok");
process.exit(errors ? 1 : 0);
