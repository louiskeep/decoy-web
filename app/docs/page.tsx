import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Book, Terminal, FileCode, Database, Sparkles, Layers } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - Decoy",
  description: "Learn how to use Decoy for data masking and synthetic data generation. Guides, API reference, and recipes.",
}

const sections = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Install Decoy and run your first masking pipeline in 5 minutes.",
    href: "/docs/getting-started",
  },
  {
    icon: Terminal,
    title: "CLI Reference",
    description: "Complete reference for all Decoy CLI commands and flags.",
    href: "/docs/cli-reference",
  },
  {
    icon: FileCode,
    title: "YAML Reference",
    description: "Full schema documentation for decoy.yaml pipeline files.",
    href: "/docs/yaml-reference",
  },
  {
    icon: Database,
    title: "Connectors",
    description: "Configure PostgreSQL, MySQL, S3, Snowflake, and more.",
    href: "/docs/connectors",
  },
  {
    icon: Sparkles,
    title: "Transforms",
    description: "50+ built-in transforms for masking and generating data.",
    href: "/docs/transforms",
  },
  {
    icon: Layers,
    title: "Recipes",
    description: "Copy-paste examples for common masking and generation tasks.",
    href: "/docs/recipes",
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Decoy. From installation to advanced transforms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Can&apos;t find what you&apos;re looking for?
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <Link href="https://github.com/forgeio/forge/discussions" target="_blank">
                    Ask on GitHub
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/discord">Join Discord</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
