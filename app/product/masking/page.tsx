import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Check, Zap, Lock, Database } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Masking - Forge",
  description: "Create PII-safe copies of production data for dev and test environments. Format-preserving encryption, faker-based transforms, and referential integrity.",
}

const transforms = [
  {
    name: "faker.email",
    description: "Realistic email addresses",
    example: "john.doe@acme.com → sarah.miller@example.net",
  },
  {
    name: "format_preserving_encryption",
    description: "Encrypted but same format",
    example: "4111-1111-1111-1111 → 8923-4567-2345-9012",
  },
  {
    name: "hash.sha256",
    description: "Deterministic one-way hash",
    example: "123-45-6789 → a7f3b2c9d8...",
  },
  {
    name: "date_shift",
    description: "Shift dates by random offset",
    example: "1990-05-15 → 1990-06-02",
  },
  {
    name: "faker.address",
    description: "Realistic street addresses",
    example: "123 Main St → 456 Oak Ave",
  },
  {
    name: "categorical_shuffle",
    description: "Shuffle within column",
    example: "Preserves value distribution",
  },
]

const benefits = [
  {
    icon: Shield,
    title: "PII Protection",
    description: "Automatically detect and mask sensitive data including emails, SSNs, phone numbers, and addresses.",
  },
  {
    icon: Lock,
    title: "Referential Integrity",
    description: "Foreign keys stay valid. User IDs in orders still match users. No broken joins.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Stream large tables without loading everything into memory. Mask millions of rows in minutes.",
  },
  {
    icon: Database,
    title: "Multiple Destinations",
    description: "Write masked data to staging DBs, S3, local files, or Snowflake. Same pipeline, many outputs.",
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
                  Production data, without the risk
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Create realistic dev and test datasets by masking PII in your production data. 
                  Preserve data relationships, statistical properties, and format integrity.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/trial">Start free trial</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/docs/concepts/masking">Read the docs</Link>
                  </Button>
                </div>
              </div>

              {/* Code example */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                  <span className="text-xs text-muted-foreground font-mono">forge.yaml</span>
                </div>
                <pre className="p-4 text-sm font-mono overflow-x-auto code-block">
                  <code className="text-muted-foreground">{`source:
  type: postgres
  connection: \${PROD_DB_URL}
  tables: [users, orders]

destination:
  type: postgres
  connection: \${STAGING_DB_URL}

masks:
  - table: users
    column: email
    transform: faker.email
    preserve_uniqueness: true

  - table: users
    column: ssn
    transform: format_preserving_encryption
    seed: \${MASK_SEED}

  - table: orders
    column: shipping_address
    transform: faker.address

referential_integrity:
  - parent: users.id
    children: [orders.user_id]`}</code>
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
                Built-in masking transforms
              </h2>
              <p className="text-muted-foreground text-lg">
                50+ transforms out of the box. Or write your own in Python.
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
              <Link href="/docs/transforms" className="text-sm text-primary hover:underline">
                View all transforms →
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
