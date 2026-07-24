#!/usr/bin/env node
// Vendors the Typer-generated CLI reference from the decoy repo into this repo.
// Vendoring (not fetching at build time) keeps Vercel builds hermetic -- the decoy
// repo may be private and is not reachable from a serverless build -- and turns
// reference changes into a reviewable diff of one file instead of N generated
// pages. See docs/superpowers/specs/2026-07-17-cli-docs-nextra.md Section 4.1.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const sourcePath = resolve(repoRoot, process.env.DECOY_CLI_REF || '../decoy/docs/cli-reference.md')
const destPath = resolve(repoRoot, 'content/docs/cli/_source/cli-reference.md')

if (!existsSync(sourcePath)) {
  console.error(`[sync-cli-reference] source file not found: ${sourcePath}`)
  console.error(
    "[sync-cli-reference] set DECOY_CLI_REF to a decoy checkout's docs/cli-reference.md " +
      '(defaults to a sibling ../decoy checkout).'
  )
  process.exit(1)
}

// The commit hash is the audit trail for "what CLI surface does this page describe";
// the decoy repo's own test_cli_surface.py already pins the file to the code, so this
// is the other half of the chain of custody (spec Section 4).
const decoyRepoRoot = resolve(sourcePath, '../..')
let commitHash = 'unknown'
try {
  commitHash = execFileSync('git', ['-C', decoyRepoRoot, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim()
} catch (err) {
  console.warn(
    `[sync-cli-reference] could not resolve the decoy commit hash (${err.message}); ` +
      'writing "unknown" to the provenance header.'
  )
}

const body = readFileSync(sourcePath, 'utf8')

// No timestamp here on purpose: the header should be a pure function of (source repo,
// source commit) so re-running sync with unchanged input produces a byte-identical
// file. A timestamp would make every sync a diff even when nothing changed upstream,
// which defeats the drift guard described in Section 4.1 (byte-identical below the
// header).
const header = [
  '<!--',
  '  GENERATED FILE. Do not hand-edit -- this is a vendored copy.',
  '  Produced by scripts/sync-cli-reference.mjs from a decoy checkout.',
  '  Source repo: decoy',
  `  Source commit: ${commitHash}`,
  '-->',
  '',
  '',
].join('\n')

mkdirSync(dirname(destPath), { recursive: true })
writeFileSync(destPath, header + body)

console.log(`[sync-cli-reference] wrote ${destPath}`)
console.log(`[sync-cli-reference] source: ${sourcePath}`)
console.log(`[sync-cli-reference] commit: ${commitHash}`)
