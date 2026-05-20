import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { AlertCircle, Database, Server, Shield, LifeBuoy, CreditCard, ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "V1 Limits - Decoy",
  description: "What Decoy V1 is, and what it is not. Honest connector, compliance, scale, deployment, support, and pricing limits.",
}

const limits = [
  {
    icon: Database,
    title: "Connectors",
    items: [
      "File upload: CSV, Parquet, fixed-width",
      "Cloud object storage: Amazon S3, Google Cloud Storage, SFTP",
      "No SQL connectors in V1 (PostgreSQL, MySQL, Snowflake, BigQuery, Databricks, Redshift, MongoDB)",
      "No streaming or event-bus connectors (Kafka, Kinesis)",
      "No NoSQL or graph databases",
    ],
    note: "Need a connector not listed here? Open a GitHub issue. We prioritize by demand.",
  },
  {
    icon: Shield,
    title: "Compliance",
    items: [
      "Decoy is masking and audit-evidence tooling. It is not a compliance certification.",
      "Not SOC 2 certified. Not HIPAA certified. Not FedRAMP authorized.",
      "No Business Associate Agreement (BAA) offered in V1.",
      "Not PCI-DSS certified.",
      "Customers retain full responsibility for their own compliance posture.",
      "Decoy audit logs and evidence reports may be useful inputs to your auditor, but do not themselves constitute certification.",
    ],
    note: null,
  },
  {
    icon: AlertCircle,
    title: "Scale",
    items: [
      "Designed for file batches up to approximately 1 GB per run.",
      "Larger files will work but are not benchmarked or supported for V1.",
      "No distributed execution or worker cluster in V1.",
      "Single-instance Web UI only.",
    ],
    note: "Multi-GB and high-throughput use cases are on the V2 roadmap.",
  },
  {
    icon: Server,
    title: "Deployment",
    items: [
      "Self-hosted only. No SaaS option.",
      "Docker Compose deployment. No Helm chart in V1.",
      "No Kubernetes-native deployment.",
      "No KMS or Vault provider integration in V1 (env + file key model).",
      "No in-app self-upgrade. Operator follows the documented runbook.",
      "No automated backup tool. Customers use their own backup infrastructure against the documented backup set.",
    ],
    note: null,
  },
  {
    icon: LifeBuoy,
    title: "Support",
    items: [
      "Email + business hours. Best-effort response.",
      "No SLA in V1.",
      "No 24/7 on-call.",
      "Enterprise customers negotiate custom support terms by contract.",
    ],
    note: null,
  },
  {
    icon: CreditCard,
    title: "License and Pricing",
    items: [
      "Annual flat fee per instance. No per-row fees. No per-seat counting.",
      "CLI is free forever under the Business Source License (BUSL-1.1).",
      "The Web UI is a paid self-hosted product, not an open-source release.",
      "Multi-environment customers (dev + staging + prod) are quoted per environment.",
    ],
    note: null,
  },
]

export default function LimitsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                What Decoy is, and what it is not
              </h1>
              <p className="text-lg text-muted-foreground">
                V1 is a self-hosted batch masking and profiling product for file and cloud data.
                These are the limits that define the V1 boundary. Customers should review this
                page before signing up.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {limits.map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-semibold text-lg">{section.title}</h2>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {section.note && (
                    <p className="text-xs text-muted-foreground border-t border-border pt-3">
                      {section.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What is next */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="text-2xl font-bold mb-3">What is next</h2>
              <p className="text-muted-foreground mb-6">
                V2 priorities include SQL connectors, Kubernetes deployment, KMS and Vault
                integration, larger-batch support, and formal compliance certifications.
                The product roadmap is driven by pilot feedback.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Changelog <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com/louiskeep/decoy/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Request a feature on GitHub <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  )
}
