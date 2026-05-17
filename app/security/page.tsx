import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { Shield, Lock, Eye, Server, FileCheck, Users } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security - Decoy",
  description: "How Decoy keeps your data safe. Self-hosted architecture, encryption, and compliance posture.",
}

const principles = [
  {
    icon: Server,
    title: "Self-Hosted by Design",
    description: "Decoy runs entirely on your infrastructure. Your data never leaves your network. We have no access to your data.",
  },
  {
    icon: Lock,
    title: "Encrypted Configuration",
    description: "Sensitive configuration (connector credentials, SSO secrets, API keys) is encrypted at rest with a customer-managed key.",
  },
  {
    icon: Eye,
    title: "Source-Available Code",
    description: "The CLI is published under the Business Source License. Your security team can audit every line of code that touches your data.",
  },
  {
    icon: FileCheck,
    title: "Disguise Templates",
    description: "HIPAA, PCI, GDPR, SOX, and other built-in Disguise templates give your team a starting point for policy review. The customer owns the policy decision; Decoy ships the field list.",
  },
  {
    icon: Users,
    title: "RBAC & Audit Logs",
    description: "The paid Web UI includes role-based access control and audit logs. Know who ran what pipeline, when, and on which data.",
  },
  {
    icon: Shield,
    title: "Security Disclosures",
    description: "Report vulnerabilities to the security inbox (address being finalized for V1). We follow responsible disclosure and credit researchers in our changelog.",
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
                <Shield className="h-3 w-3" />
                Security
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Built for regulated industries
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Decoy was designed from day one for teams that take data security seriously.
                Self-hosted architecture means your compliance requirements are met by default.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <principle.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance posture */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Compliance Posture</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Decoy V1 is audit-evidence and masking tooling. Customers retain full responsibility
              for their own compliance posture. The Reports and audit logs Decoy generates can be
              useful inputs to a customer&apos;s compliance audit but do not themselves constitute
              certification.
            </p>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">SOC 2</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Not certified in V1. Customers maintain their own SOC 2 controls; Decoy&apos;s
                      audit logs and evidence Reports may be useful inputs to their auditor.
                    </p>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">Not certified</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">HIPAA</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      No Business Associate Agreement (BAA) offered in V1. The self-hosted architecture
                      keeps PHI on your infrastructure regardless. HIPAA-aware Disguise field lists
                      (Safe Harbor identifiers) ship with the CLI as a starting point for your team&apos;s
                      policy review.
                    </p>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">No BAA in V1</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">GDPR</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Decoy runs on your infrastructure in your jurisdiction; no data is transferred to
                      third parties. GDPR-aware Disguise field lists ship with the CLI. Decoy itself is
                      not GDPR-certified; customers retain controller / processor responsibilities.
                    </p>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Self-Hosted by Design</span>
                  </div>
                </div>
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
