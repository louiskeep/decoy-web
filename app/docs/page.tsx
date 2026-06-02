import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Book, Database, ExternalLink, FileCode, GitBranch, Shield, Terminal } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - Decoy",
  description:
    "Decoy documentation for CLI YAML workflows, platform capabilities, release status, and public docs planning.",
}

const docsLinks = [
  {
    icon: Book,
    title: "How Decoy Works",
    description: "Plain-language map of engine, platform, CLI, website, and the V1 workflow.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/guides/how-decoy-works.md",
  },
  {
    icon: Database,
    title: "Engine Under The Hood",
    description: "How V2 PipelineConfig validation, plan compilation, mask + generate adapters, and STORM profiling fit together.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/guides/engine-under-the-hood.md",
  },
  {
    icon: FileCode,
    title: "Platform App Under The Hood",
    description: "How the FastAPI and React app wrap the engine for files, scans, jobs, reporting, and admin.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/guides/platform-app-under-the-hood.md",
  },
  {
    icon: Terminal,
    title: "CLI YAML Workflows",
    description: "How to author YAML, run local files, use STORM, and understand CLI boundaries.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/guides/cli-yaml-workflows.md",
  },
  {
    icon: Book,
    title: "Documentation Hub",
    description: "The canonical cross-repo docs index for roadmap, product truth, audits, and guides.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/README.md",
  },
  {
    icon: FileCode,
    title: "API Surface Map",
    description: "What lives in Web UI, API, CLI, and engine/direct YAML for Release 1.0.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/guides/api-surface.md",
  },
  {
    icon: Database,
    title: "Product Capabilities",
    description: "Current shipped behavior, release boundaries, and known capability limits.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/product/capabilities.md",
  },
  {
    icon: Shield,
    title: "CLI V1 Audit",
    description: "What the CLI can do, what it should not claim, and the release support gaps.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/archive/audits-completed/cli-v1-audit.md",
  },
  {
    icon: GitBranch,
    title: "Release Roadmap",
    description: "Sprint-by-sprint V1 release work, gates, blockers, and implementation standards.",
    href: "https://github.com/louiskeep/decoy-platform/blob/main/docs/v2/roadmap.md",
  },
]

const docsStandards = [
  "Git-reviewed Markdown or MDX source",
  "Runnable examples and generated references",
  "Search, stable URLs, redirects, and broken-link checks",
  "Tutorials, how-to guides, reference, and concept docs",
]

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-12 max-w-3xl">
              <p className="mb-3 text-sm font-medium text-primary">Documentation</p>
              <h1 className="mb-5 text-4xl font-bold md:text-5xl">Build, run, and review Decoy workflows.</h1>
              <p className="text-lg text-muted-foreground">
                The public docs site is being shaped around the same release truth as the product. For now,
                canonical docs live in GitHub; the long-term home should be a dedicated docs domain such as
                docs.decoy.dev, with docs.decoy.com redirecting if available.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {docsLinks.map((section) => (
                  <Link
                    key={section.title}
                    href={section.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-md border border-border bg-card p-5 transition-colors hover:border-primary/60"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <h2 className="font-semibold transition-colors group-hover:text-primary">{section.title}</h2>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{section.description}</p>
                  </Link>
                ))}
              </div>

              <aside className="rounded-md border border-border bg-muted/30 p-6">
                <h2 className="mb-3 text-lg font-semibold">Docs site direction</h2>
                <p className="mb-5 text-sm leading-6 text-muted-foreground">
                  V1 docs should move to a dedicated Git-backed docs site with generated references for CLI,
                  YAML, API, connectors, and product limits. Mintlify is the fastest polished path; Starlight,
                  Nextra, or Material for MkDocs are strong owned-stack alternatives.
                </p>
                <ul className="space-y-3">
                  {docsStandards.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link
                    href="https://github.com/louiskeep/decoy-platform/blob/main/docs/guides/public-docs-site-strategy.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read docs strategy
                  </Link>
                </Button>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
