// Generate public/llms.txt from the docs frontmatter so AI clients get a clean,
// current index of the published pages. Runs in prebuild, next to the CLI-mdx
// generator. Skips underscore-prefixed partials and draft: true pages.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DOCS = 'content/docs'
const BASE = 'https://trydecoy.com/docs'

function frontmatter(file) {
  const text = readFileSync(file, 'utf8')
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const fm = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
  }
  return fm
}

function meta(dir) {
  const p = join(dir, 'meta.json')
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}

// A page's URL: /docs path, index -> the folder itself, no extension.
function urlFor(relNoExt) {
  const clean = relNoExt.replace(/\/index$/, '')
  return clean ? `${BASE}/${clean}` : BASE
}

function pageLine(dir, name) {
  for (const ext of ['.mdx', '.md']) {
    const file = join(dir, name + ext)
    if (!existsSync(file)) continue
    const fm = frontmatter(file)
    if (fm.draft === 'true') return null
    const rel = join(dir.slice(DOCS.length + 1), name).replace(/\\/g, '/')
    const title = fm.title || name
    const desc = fm.description ? `: ${fm.description}` : ''
    return `- [${title}](${urlFor(rel)})${desc}`
  }
  return null
}

function section(dir) {
  const m = meta(dir)
  const names = m?.pages ?? readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_'))
    .map((f) => f.replace(/\.mdx?$/, ''))
  const lines = []
  for (const name of names) {
    // A folder entry: recurse as its own section.
    const sub = join(dir, name)
    if (existsSync(sub) && statSync(sub).isDirectory()) {
      lines.push(...sectionWithHeading(sub))
      continue
    }
    const line = pageLine(dir, name)
    if (line) lines.push(line)
  }
  return lines
}

function sectionWithHeading(dir) {
  const m = meta(dir)
  const title = m?.title || dir.split('/').pop()
  return [``, `## ${title}`, ...section(dir)]
}

const rootMeta = meta(DOCS)
const out = [
  '# Decoy',
  '',
  '> Self-hosted data masking and synthetic data generation. Mask sensitive fields, generate synthetic rows, and subset related tables through explicit YAML pipelines you run yourself.',
]
for (const entry of rootMeta.pages) {
  const sub = join(DOCS, entry)
  if (existsSync(sub) && statSync(sub).isDirectory()) {
    out.push(...sectionWithHeading(sub))
  } else {
    const line = pageLine(DOCS, entry)
    if (line) out.push(line)
  }
}

writeFileSync('public/llms.txt', out.join('\n') + '\n')
console.log(`[build-llms-txt] wrote public/llms.txt (${out.length} lines)`)
