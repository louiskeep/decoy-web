#!/usr/bin/env node
// CI truth-governance gate for the public docs tree (spec Section 8:
// docs/superpowers/specs/2026-07-17-cli-docs-nextra.md). Five checks, each
// failing loud with a per-violation message rather than a summary count, so
// a CI log tells you exactly what to fix without re-running locally.
//
// Run as `pnpm check:docs`. Exits non-zero on any violation.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const violations = []

function fail(check, file, message) {
  violations.push({ check, file, message })
}

function walk(dir, { skipDirs = [] } = {}) {
  const out = []
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    if (skipDirs.includes(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full, { skipDirs }))
    } else {
      out.push(full)
    }
  }
  return out
}

function readText(file) {
  return readFileSync(file, 'utf8')
}

function rel(file) {
  return relative(repoRoot, file)
}

// ---------------------------------------------------------------------------
// Check 1: no private-repo URL patterns under app/ or content/
// ---------------------------------------------------------------------------
// Hard constraint (spec Section 0, corrected 2026-07-17): decoy and
// decoy-engine are public GitHub repos (BUSL-1.1 source-available; see
// louiskeep/decoy's own pyproject.toml/CONTRIBUTING.md/release runbook,
// which link and `git clone`/`pip install git+https://...` them directly).
// decoy-platform is private, so no links to it anywhere in the docs tree.
// The legacy forge repos are banned too -- not for privacy (they are
// public) but because they are retired and must never be referenced from
// customer docs. Matched broadly (any github.com/<org>/<repo> naming one
// of these repos) so a renamed link path still trips it.
const PRIVATE_REPO_PATTERNS = [
  /github\.com\/louiskeep\/decoy-platform/i,
  /github\.com\/louiskeep\/forge/i,
  /github\.com\/[a-zA-Z0-9_-]+\/decoy-platform/i,
]

function checkPrivateLinks() {
  const dirs = [resolve(repoRoot, 'app'), resolve(repoRoot, 'content')]
  for (const dir of dirs) {
    for (const file of walk(dir, { skipDirs: ['node_modules'] })) {
      const ext = extname(file)
      if (!['.mdx', '.md', '.tsx', '.ts', '.json'].includes(ext)) continue
      const text = readText(file)
      const lines = text.split('\n')
      lines.forEach((line, idx) => {
        for (const pattern of PRIVATE_REPO_PATTERNS) {
          if (pattern.test(line)) {
            fail(
              'private-link',
              file,
              `line ${idx + 1}: matches a private-repo URL pattern (${pattern}): ${line.trim()}`
            )
          }
        }
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Check 2: no case-insensitive "open source" under content/docs/
// ---------------------------------------------------------------------------
// Hard constraint (spec Section 0): decoy is source-available (BUSL-1.1),
// never "open source", until the Apache-2.0 flip. Allowlist mechanism for a
// deliberate future exception; empty today per spec Section 8.
const OPEN_SOURCE_ALLOWLIST = []

function checkOpenSourceWording() {
  const dir = resolve(repoRoot, 'content/docs')
  for (const file of walk(dir)) {
    const ext = extname(file)
    if (!['.mdx', '.md'].includes(ext)) continue
    const text = readText(file)
    const lines = text.split('\n')
    lines.forEach((line, idx) => {
      const re = /open source/gi
      let match
      while ((match = re.exec(line)) !== null) {
        const context = line.trim()
        if (OPEN_SOURCE_ALLOWLIST.some((allowed) => context.includes(allowed))) continue
        fail(
          'open-source-wording',
          file,
          `line ${idx + 1}: uses "open source" -- decoy is source-available (BUSL-1.1), not open source: ${context}`
        )
      }
    })
  }
}

// ---------------------------------------------------------------------------
// Check 3: no em-dash (U+2014) and no U+2192 arrow under content/docs/
// ---------------------------------------------------------------------------
function checkBannedCharacters() {
  const dir = resolve(repoRoot, 'content/docs')
  const EM_DASH = '—'
  const ARROW = '→'
  for (const file of walk(dir)) {
    const ext = extname(file)
    if (!['.mdx', '.md', '.json'].includes(ext)) continue
    const text = readText(file)
    const lines = text.split('\n')
    lines.forEach((line, idx) => {
      if (line.includes(EM_DASH)) {
        fail('em-dash', file, `line ${idx + 1}: contains an em-dash (U+2014): ${line.trim()}`)
      }
      if (line.includes(ARROW)) {
        fail('arrow', file, `line ${idx + 1}: contains a U+2192 arrow: ${line.trim()}`)
      }
    })
  }
}

// ---------------------------------------------------------------------------
// Check 4: dead internal-link check over content/docs/**
// ---------------------------------------------------------------------------
// Builds the set of real, published page routes (draft:true pages are
// excluded -- the source adapter's dropDrafts plugin removes them from
// storage at build time, so a link to one would 404 in production even
// though the file exists on disk) and flags every /docs/... href that does
// not resolve to one of them.
function parseFrontmatter(text) {
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) return {}
  const end = text.indexOf('\n---', 4)
  if (end === -1) return {}
  const block = text.slice(4, end)
  const data = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/)
    if (!m) continue
    const [, key, rawValue] = m
    data[key] = rawValue.trim()
  }
  return data
}

function isPartialOrSource(relPath) {
  const segments = relPath.split('/')
  if (segments.includes('_source')) return true
  const base = segments[segments.length - 1]
  return base.startsWith('_')
}

function routeForContentFile(relPath) {
  // relPath is relative to content/docs, e.g. "cli/index.mdx" or "start/install.mdx".
  const withoutExt = relPath.replace(/\.mdx?$/, '')
  const segments = withoutExt.split('/')
  if (segments[segments.length - 1] === 'index') segments.pop()
  const route = segments.length === 0 ? '/docs' : `/docs/${segments.join('/')}`
  return route
}

function collectDocsPages() {
  const docsDir = resolve(repoRoot, 'content/docs')
  const pages = new Set()
  const draftPages = new Set()
  const allFiles = walk(docsDir)
  for (const file of allFiles) {
    const ext = extname(file)
    if (!['.mdx', '.md'].includes(ext)) continue
    const relPath = relative(docsDir, file)
    if (isPartialOrSource(relPath)) continue
    const text = readText(file)
    const frontmatter = parseFrontmatter(text)
    const route = routeForContentFile(relPath)
    if (frontmatter.draft === 'true') {
      draftPages.add(route)
    } else {
      pages.add(route)
    }
  }
  return { pages, draftPages }
}

function collectDocsHrefs() {
  const docsDir = resolve(repoRoot, 'content/docs')
  const hrefs = [] // { file, line, href }
  const LINK_RE = /\]\((\/docs[^)\s#]*)(#[^)\s]*)?\)/g
  for (const file of walk(docsDir)) {
    const ext = extname(file)
    if (!['.mdx', '.md'].includes(ext)) continue
    const relPath = relative(docsDir, file)
    if (isPartialOrSource(relPath)) continue
    const text = readText(file)
    const lines = text.split('\n')
    lines.forEach((line, idx) => {
      let match
      const re = new RegExp(LINK_RE)
      while ((match = re.exec(line)) !== null) {
        hrefs.push({ file, lineNo: idx + 1, href: match[1], line: line.trim() })
      }
    })
  }
  return hrefs
}

function checkDeadLinks() {
  const { pages, draftPages } = collectDocsPages()
  const hrefs = collectDocsHrefs()
  for (const { file, lineNo, href, line } of hrefs) {
    // Normalize a trailing slash, if any.
    const normalized = href.length > 1 && href.endsWith('/') ? href.slice(0, -1) : href
    if (pages.has(normalized)) continue
    if (draftPages.has(normalized)) {
      fail(
        'dead-link',
        file,
        `line ${lineNo}: links to ${href}, which is a draft:true page (excluded from the ` +
          `published site) -- unlinkable by design: ${line}`
      )
      continue
    }
    fail('dead-link', file, `line ${lineNo}: links to ${href}, which does not resolve to any page: ${line}`)
  }
}

// ---------------------------------------------------------------------------
// Check 5: generated-pipeline guard is wired as prebuild
// ---------------------------------------------------------------------------
function checkPrebuildWiring() {
  const pkgPath = resolve(repoRoot, 'package.json')
  const pkg = JSON.parse(readText(pkgPath))
  const prebuild = pkg.scripts?.prebuild
  if (!prebuild) {
    fail('prebuild-wiring', pkgPath, 'package.json has no "prebuild" script; the CLI-mdx splitter must run before every build.')
    return
  }
  if (!prebuild.includes('build-cli-mdx.mjs')) {
    fail(
      'prebuild-wiring',
      pkgPath,
      `"prebuild" script does not invoke scripts/build-cli-mdx.mjs (found: ${JSON.stringify(prebuild)}). ` +
        'The generated CLI reference would go stale silently.'
    )
  }
  const splitterPath = resolve(repoRoot, 'scripts/build-cli-mdx.mjs')
  try {
    statSync(splitterPath)
  } catch {
    fail('prebuild-wiring', splitterPath, 'scripts/build-cli-mdx.mjs does not exist.')
  }
}

// ---------------------------------------------------------------------------
// Run all checks
// ---------------------------------------------------------------------------
checkPrivateLinks()
checkOpenSourceWording()
checkBannedCharacters()
checkDeadLinks()
checkPrebuildWiring()

if (violations.length > 0) {
  console.error(`[check-docs-truth] ${violations.length} violation(s):\n`)
  for (const v of violations) {
    console.error(`  [${v.check}] ${rel(v.file)}`)
    console.error(`    ${v.message}\n`)
  }
  process.exit(1)
}

console.log('[check-docs-truth] all checks passed: no private links, no "open source" wording, ')
console.log('[check-docs-truth] no banned characters, no dead internal links, prebuild guard wired.')
