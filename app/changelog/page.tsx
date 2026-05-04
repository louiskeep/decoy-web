import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Changelog - Forge",
  description: "Release notes and updates for Forge. See what's new in each version.",
}

const releases = [
  {
    version: "1.0.0",
    date: "2026-04-15",
    title: "Initial Release",
    changes: [
      { type: "feature", text: "Core CLI with masking and synthetic data generation" },
      { type: "feature", text: "PostgreSQL and MySQL connectors" },
      { type: "feature", text: "S3 connector for CSV and Parquet files" },
      { type: "feature", text: "Snowflake connector (read and write)" },
      { type: "feature", text: "50+ built-in masking transforms" },
      { type: "feature", text: "Format-preserving encryption" },
      { type: "feature", text: "YAML-based pipeline configuration" },
      { type: "feature", text: "Referential integrity preservation" },
      { type: "feature", text: "forge init, forge run, forge demo commands" },
      { type: "feature", text: "Business tier with web UI and scheduling" },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-04-01",
    title: "Release Candidate",
    changes: [
      { type: "improvement", text: "Performance improvements for large tables (10x faster)" },
      { type: "improvement", text: "Better error messages with YAML line numbers" },
      { type: "fix", text: "Fixed memory leak when streaming large datasets" },
      { type: "fix", text: "Fixed edge case in date_shift transform" },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-03-15",
    title: "Beta 3",
    changes: [
      { type: "feature", text: "Added Snowflake connector" },
      { type: "feature", text: "Added forge generate schema command for auto-config" },
      { type: "improvement", text: "Progress bars for long-running operations" },
      { type: "fix", text: "Fixed Unicode handling in faker transforms" },
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
                All notable changes to Forge are documented here.
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
                Subscribe to our{" "}
                <a
                  href="/blog"
                  className="text-primary hover:underline"
                >
                  blog
                </a>
                {" "}for detailed release notes and migration guides.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
