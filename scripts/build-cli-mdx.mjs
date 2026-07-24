#!/usr/bin/env node
// Splits the vendored, Typer-generated CLI reference into one MDX page per top-level
// command group, plus a composed index page. Runs as `prebuild`/`predev` so the page
// set always reflects the vendored file; output is gitignored (content/docs/cli/*.mdx)
// because it is fully reconstructable from _source/cli-reference.md + _index-intro.mdx.
//
// The heading format of cli-reference.md (# root, ## `decoy <group>`,
// ### `decoy <group> <sub>`) is an implicit cross-repo contract with the decoy repo's
// Typer doc generator. This script fails loudly (non-zero exit) rather than silently
// mis-splitting when that contract breaks, per spec Section 4.2/10: guard the
// contract, do not paper over it.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const outDir = resolve(repoRoot, 'content/docs/cli')
const introPartialPath = resolve(outDir, '_index-intro.mdx')

// Override for the loud-fail verification proof (Section 4.3): point at a scratch
// copy of the vendored file without touching the committed original. Not used in
// normal prebuild/predev/CI runs.
const sourcePath = resolve(
  repoRoot,
  process.env.CLI_MDX_SOURCE || 'content/docs/cli/_source/cli-reference.md'
)

// "Group count below an expected floor" guard (spec Section 4.3). 27 groups exist
// today; the floor is set well below that so ordinary command additions never trip
// it, but a parse that yields a handful of groups (e.g. from a header-format change)
// still fails loudly instead of silently shipping a truncated reference.
const MIN_GROUPS = 20

function fail(message) {
  console.error(`[build-cli-mdx] ${message}`)
  process.exit(1)
}

if (!existsSync(sourcePath)) {
  fail(
    `vendored source not found at ${sourcePath}. Run "node scripts/sync-cli-reference.mjs" first ` +
      '(or set CLI_MDX_SOURCE for a test fixture).'
  )
}

const raw = readFileSync(sourcePath, 'utf8')
const lines = raw.split('\n')

// --- Strip the provenance header written by sync-cli-reference.mjs -------------
// The real content starts at the root heading; anything before it (the HTML
// provenance comment, or nothing if reading a bare Typer-output file) is discarded.
const rootHeadingIndex = lines.findIndex((line) => /^# `decoy`\s*$/.test(line))
if (rootHeadingIndex === -1) {
  fail(
    'could not find the root "# `decoy`" heading. The vendored file is missing, empty, ' +
      'or does not match the expected Typer output format -- refusing to guess.'
  )
}
const contentLines = lines.slice(rootHeadingIndex)

// --- Walk the file, classifying every heading outside fenced code blocks -------
const GROUP_RE = /^## `decoy ([a-zA-Z0-9_-]+)`\s*$/
const SUBCOMMAND_RE = /^### `decoy ([a-zA-Z0-9_-]+) ([a-zA-Z0-9_-]+)`\s*$/

let inFence = false
let sawRootHeading = false
const groupStarts = [] // { name, lineIndex }

contentLines.forEach((line, idx) => {
  const trimmed = line.trim()
  if (trimmed.startsWith('```')) {
    inFence = !inFence
    return
  }
  if (inFence) return
  if (!line.startsWith('#')) return

  const fileLineNo = rootHeadingIndex + idx + 1

  if (/^# /.test(line)) {
    if (idx !== 0) {
      fail(
        `unexpected second top-level "# " heading at line ${fileLineNo}: ${JSON.stringify(line)}. ` +
          'Only the document root may use a level-1 heading.'
      )
    }
    if (!/^# `decoy`\s*$/.test(line)) {
      fail(`root heading at line ${fileLineNo} is not "# \`decoy\`": ${JSON.stringify(line)}`)
    }
    sawRootHeading = true
    return
  }

  if (/^## /.test(line)) {
    const m = line.match(GROUP_RE)
    if (!m) {
      fail(
        `line ${fileLineNo} looks like a command-group heading but does not match the ` +
          `expected "## \`decoy <name>\`" format: ${JSON.stringify(line)}. ` +
          'This is the cross-repo contract with decoy/docs/cli-reference.md; fix the generator ' +
          'or the source, do not special-case the splitter.'
      )
    }
    groupStarts.push({ name: m[1], lineIndex: idx })
    return
  }

  if (/^### /.test(line)) {
    if (!SUBCOMMAND_RE.test(line)) {
      fail(
        `line ${fileLineNo} looks like a subcommand heading but does not match the expected ` +
          `"### \`decoy <group> <sub>\`" format: ${JSON.stringify(line)}.`
      )
    }
    return
  }

  // Any other heading depth (#### and deeper) is outside the contract entirely.
  fail(`line ${fileLineNo} is a heading depth this splitter does not expect: ${JSON.stringify(line)}`)
})

if (!sawRootHeading) {
  fail('root "# `decoy`" heading was never classified; parser state bug.')
}
if (groupStarts.length < MIN_GROUPS) {
  fail(
    `only found ${groupStarts.length} command-group headings, below the expected floor of ` +
      `${MIN_GROUPS}. Refusing to emit a truncated CLI reference -- check that the vendored file ` +
      'synced correctly (node scripts/sync-cli-reference.mjs) and that its heading format is intact.'
  )
}

// --- Slice the file into the root section + one section per group --------------
const rootSectionLines = contentLines.slice(1, groupStarts[0].lineIndex) // drop the `# decoy` line itself
const groupSections = groupStarts.map((g, i) => {
  const end = i + 1 < groupStarts.length ? groupStarts[i + 1].lineIndex : contentLines.length
  return {
    name: g.name,
    // Drop the group's own `## decoy <name>` heading line; it becomes the page's
    // frontmatter title instead of a body heading (fumadocs renders the title as
    // the page H1 already, so keeping it in the body would duplicate it).
    bodyLines: contentLines.slice(g.lineIndex + 1, end),
  }
})

// --- MDX safety: escape stray `<` and literal `{` outside fenced code blocks ---
// Typer's own HTML-entity escaping (&lt;, &#x27;, ...) already covers most prose,
// but leaves some placeholders raw (e.g. literal `<run-id>` in Examples blocks) and
// never touches literal `{` (e.g. `{command, status, schema}` JSON envelopes).
// Left alone, both parse as MDX/JSX syntax and break the build.
function escapeMdxOutsideFences(text) {
  let fenced = false
  return text
    .split('\n')
    .map((line) => {
      if (line.trim().startsWith('```')) {
        fenced = !fenced
        return line
      }
      if (fenced) return line
      return line.replace(/</g, '&lt;').replace(/\{/g, '&#123;')
    })
    .join('\n')
}

// Demote headings that survive into a per-group page: subcommand headings were
// nested two levels under the document root (# > ## group > ### sub). Extracting
// a single group drops the `##` (now the frontmatter title), so `###` subcommand
// headings shift up to `##` to become that page's top-level sections. Heading TEXT
// is left untouched so slug-based anchors keep resolving.
function demoteSubcommandHeadings(text) {
  let fenced = false
  return text
    .split('\n')
    .map((line) => {
      if (line.trim().startsWith('```')) {
        fenced = !fenced
        return line
      }
      if (!fenced && /^### /.test(line)) {
        return line.replace(/^### /, '## ')
      }
      return line
    })
    .join('\n')
}

function decodeEntitiesForPlainText(text) {
  // Frontmatter `description` is consumed as plain text (meta tags, search
  // snippets, nav tooltips) -- unlike the MDX body, entities here should read as
  // the characters they represent, not as literal "&#x27;" text.
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
}

function yamlScalar(value) {
  // Defensive quoting for YAML frontmatter: quote unless the value is safe as a
  // plain scalar (no leading special char, no embedded ": " which YAML reads as a
  // new mapping key, no literal quote/newline).
  const needsQuoting = /^[\s\-?:,[\]{}#&*!|>'"%@`]/.test(value) || /:\s/.test(value) || /["\n]/.test(value)
  if (!needsQuoting) return value
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function firstSentence(paragraphText) {
  const cleaned = decodeEntitiesForPlainText(paragraphText).trim()
  const match = cleaned.match(/^(.*?[.!?])(\s|$)/)
  const sentence = match ? match[1] : cleaned
  return sentence.length > 200 ? `${sentence.slice(0, 197)}...` : sentence
}

function extractDescription(bodyLines) {
  const firstParagraph = []
  for (const line of bodyLines) {
    if (line.trim() === '') {
      if (firstParagraph.length > 0) break
      continue
    }
    if (/^\*\*[A-Za-z ]+\*\*:?\s*$/.test(line.trim())) break // hit "**Usage**:" etc with no prose
    firstParagraph.push(line.trim())
  }
  if (firstParagraph.length === 0) return ''
  return firstSentence(firstParagraph.join(' '))
}

const GENERATED_BANNER =
  '{/* Generated from the decoy CLI. Do not edit directly -- run ' +
  '`node scripts/sync-cli-reference.mjs && node scripts/build-cli-mdx.mjs` to regenerate ' +
  'from decoy/docs/cli-reference.md. */}'

mkdirSync(outDir, { recursive: true })

// --- Clean up stale generated pages (Section 4.3: deleting a command from the
// vendored file must not leave a dangling page behind) ---------------------------
const currentGeneratedNames = new Set(groupStarts.map((g) => `${g.name}.mdx`))
currentGeneratedNames.add('index.mdx')
for (const entry of readdirSync(outDir)) {
  if (!entry.endsWith('.mdx')) continue
  if (entry.startsWith('_')) continue // hand partials (_index-intro.mdx) are never touched
  if (!currentGeneratedNames.has(entry)) {
    rmSync(resolve(outDir, entry))
    console.log(`[build-cli-mdx] removed stale page: content/docs/cli/${entry}`)
  }
}

// --- Emit per-group pages --------------------------------------------------------
for (const group of groupSections) {
  const description = extractDescription(group.bodyLines)
  const body = escapeMdxOutsideFences(demoteSubcommandHeadings(group.bodyLines.join('\n'))).replace(
    /\n{3,}/g,
    '\n\n'
  )

  const frontmatter = [
    '---',
    `title: ${yamlScalar(`decoy ${group.name}`)}`,
    `description: ${yamlScalar(description)}`,
    '---',
    '',
    GENERATED_BANNER,
    '',
  ].join('\n')

  writeFileSync(resolve(outDir, `${group.name}.mdx`), `${frontmatter}\n${body.trim()}\n`)
}

// --- Emit the composed index page ------------------------------------------------
if (!existsSync(introPartialPath)) {
  fail(
    `hand-written intro partial not found at ${introPartialPath}. This file is committed, not ` +
      'generated -- it should not be missing.'
  )
}
const introPartial = readFileSync(introPartialPath, 'utf8').trim()
const rootBody = escapeMdxOutsideFences(rootSectionLines.join('\n')).replace(/\n{3,}/g, '\n\n').trim()

const indexFrontmatter = [
  '---',
  'title: CLI reference',
  'description: Generated, per-command reference for the decoy CLI, kept in sync with the CLI itself.',
  '---',
  '',
  GENERATED_BANNER,
  '',
].join('\n')

// Composed, never interleaved: the hand partial and the generated root section are
// concatenated as two whole blocks so regeneration can never eat a hand edit inside
// the middle of the partial (spec Section 4.2).
const indexBody = [introPartial, '## Command map', rootBody].join('\n\n')

writeFileSync(resolve(outDir, 'index.mdx'), `${indexFrontmatter}\n${indexBody.trim()}\n`)

// --- Emit meta.json: index first, then commands alphabetically -------------------
const metaPages = ['index', ...groupSections.map((g) => g.name).sort((a, b) => a.localeCompare(b))]
writeFileSync(
  resolve(outDir, 'meta.json'),
  `${JSON.stringify({ title: 'CLI reference', pages: metaPages }, null, 2)}\n`
)

console.log(`[build-cli-mdx] emitted index.mdx + ${groupSections.length} command-group pages`)
console.log(`[build-cli-mdx] groups: ${groupSections.map((g) => g.name).join(', ')}`)
