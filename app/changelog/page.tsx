import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Changelog - Decoy",
  description: "Release notes and updates for Decoy. See what's new in each version.",
}

const releases = [
  {
    version: "1.0.0",
    date: "2026-04-15",
    title: "Initial Release",
    changes: [
      { type: "feature", text: "Core CLI: decoy run, validate, demo, storm, forecast, init, explain, info, templates" },
      { type: "feature", text: "Masking: 15+ strategies including hash, faker, redact, date_shift, categorical, shuffle, bucketize, fpe, formula, reference" },
      { type: "feature", text: "Format-preserving encryption over configurable character sets (HMAC-keyed Feistel construction)" },
      { type: "feature", text: "Synthetic data generation: faker, sequence, categorical, formula column types" },
      { type: "feature", text: "Cloud connectors: S3, Google Cloud Storage, and SFTP for CSV and Parquet files" },
      { type: "feature", text: "Graph pipeline builder with source, target, mask, generate, filter, sort, limit, derive, dedupe, unite, if-router, flag-gate, sub-pipeline, and sql_run nodes" },
      { type: "feature", text: "STORM dataset profiling: detects 22+ PII types, quasi-identifier groups, k-anonymity, re-identification risk" },
      { type: "feature", text: "FORECAST masking recommendations from STORM profiles with 8 built-in disguise templates (HIPAA, PCI, GDPR, GLBA, CCPA, FERPA, SOX, default)" },
      { type: "feature", text: "Self-hosted Web UI with RBAC (admin, release_manager, developer, user roles), API keys, and audit logs" },
      { type: "feature", text: "Job scheduling, webhook and API triggers, review gates, and pipeline versioning" },
      { type: "feature", text: "YAML-based pipeline configuration with variable substitution, iteration, and sub-pipeline support" },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-04-01",
    title: "Release Candidate",
    changes: [
      { type: "improvement", text: "Performance improvements for large files using Arrow and DuckDB native paths" },
      { type: "improvement", text: "Better error messages with YAML line numbers and field-level validation context" },
      { type: "fix", text: "Fixed memory handling when streaming large datasets" },
      { type: "fix", text: "Fixed edge case in date_shift transform for leap-year boundaries" },
      { type: "fix", text: "Fixed Unicode handling in faker transforms for non-ASCII locales" },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-03-15",
    title: "Beta 3",
    changes: [
      { type: "feature", text: "STORM scan diff: detect added/removed columns, type changes, and new PII signals across scan runs" },
      { type: "feature", text: "FORECAST multi-table pipelines from a STORM run group" },
      { type: "improvement", text: "Progress bars and Rich-formatted output for long-running CLI operations" },
      { type: "improvement", text: "Graph pipeline canvas: node cards, sample previews, and live run logs in the bottom pane" },
    ],
  },
]

const typeColors: Record<string, string> = {
  feature: "text-primary bg-primary/10",
  improvement: "text-blue-400 bg-blue-400/10",
  fix: "text-amber-400 bg-amber-400/10",
  breaking: "text-red-400 bg-red-400/10",
}

const typeLabels: Record<string, string> = {
  feature: "New",
  improvement: "Improved",
  fix: "Fixed",
  breaking: "Breaking",
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Changelog</h1>
              <p className="text-lg text-muted-foreground">
                All notable changes to Decoy are documented here.
              </p>
            </div>

            <div className="space-y-12">
              {releases.map((release) => (
                <article key={release.version} className="relative">
                  {/* Version badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-bold font-mono">{release.version}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(release.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold mb-4">{release.title}</h2>

                  <ul className="space-y-2">
                    {release.changes.map((change, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${typeColors[change.type]}`}
                        >
                          {typeLabels[change.type]}
                        </span>
                        <span className="text-muted-foreground">{change.text}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                Subscribe to our{"\ "}
                <a
                  href="/blog"
                  className="text-primary hover:underline"
                >
                  blog
                </a>
                {"\ "}for detailed release notes and migration guides.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
