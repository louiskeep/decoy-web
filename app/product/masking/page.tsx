import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Zap, Lock, Database } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Masking - Decoy",
  description: "Reviewable data masking workflows with deterministic strategies, faker-based replacements, and relationship-aware configuration.",
}

const transforms = [
  {
    name: "faker",
    description: "Realistic replacement values such as names, emails, phones, and addresses",
    example: "john.doe@acme.com -> sarah.miller@example.net",
  },
  {
    name: "fpe",
    description: "Format-preserving encryption for values that must keep shape",
    example: "4111-1111-1111-1111 -> 8923-4567-2345-9012",
  },
  {
    name: "hash",
    description: "Deterministic one-way hash for stable joins and compact IDs",
    example: "123-45-6789 -> a7f3b2c9d8...",
  },
  {
    name: "date_shift",
    description: "Shift dates within a configured range",
    example: "1990-05-15 -> 1990-06-02",
  },
  {
    name: "redact",
    description: "Replace values with a fixed marker",
    example: "John Smith -> [REDACTED]",
  },
  {
    name: "bucketize / truncate / shuffle",
    description: "Generalize values, keep prefixes, or preserve distributions with known tradeoffs",
    example: "97401 -> 974",
  },
]

const benefits = [
  {
    icon: Shield,
    title: "Field-level control",
    description: "Choose explicit strategies for emails, SSNs, phone numbers, addresses, dates, IDs, and other sensitive fields.",
  },
  {
    icon: Lock,
    title: "Relationship-aware masking",
    description: "Model lock chains and FK relationships when related columns need to stay joinable.",
  },
  {
    icon: Zap,
    title: "Local and platform runs",
    description: "Run YAML from the CLI, or use the self-hosted platform for team workflows and run history.",
  },
  {
    icon: Database,
    title: "File-first targets",
    description: "Write CSV or Parquet outputs locally or through supported S3, GCS, and SFTP paths.",
  },
]

export default function MaskingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
                  <Shield className="h-3 w-3" />
                  Data Masking
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Mask sensitive fields without hiding the decisions
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Decoy masks existing files using explicit, reviewable strategies. Use deterministic hashing, faker replacements, date shifts, redaction, FPE, and relationship rules where joins need to survive.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/trial">Request a demo</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/docs">Read the docs</Link>
                  </Button>
                </div>
              </div>

              {/* Code example */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                  <span className="text-xs text-muted-foreground font-mono">pipeline.yaml</span>
                </div>
                <pre className="p-4 text-sm font-mono overflow-x-auto code-block">
                  <code className="text-muted-foreground">{`version: "1.0"
mode: mask
input:
  type: csv
  path: data/patients.csv
output:
  type: csv
  path: data/patients_masked.csv
masking_rules:
  - column: email
    type: faker
    faker_type: email
  - column: ssn
    type: hash
    algorithm: sha256
  - column: dob
    type: date_shift
    jitter_days: 30
  - column: notes
    type: redact`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transforms */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built-in masking strategies
              </h2>
              <p className="text-muted-foreground text-lg">
                Each strategy has different privacy, utility, and relationship tradeoffs. Decoy makes those choices explicit in YAML and in the platform UI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transforms.map((transform) => (
                <div key={transform.name} className="rounded-lg border border-border bg-card p-4">
                  <div className="font-mono text-sm text-primary mb-1">{transform.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{transform.description}</div>
                  <div className="text-xs font-mono text-muted-foreground bg-muted rounded px-2 py-1">
                    {transform.example}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/docs" className="text-sm text-primary hover:underline">
                View docs
              </Link>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  )
}
