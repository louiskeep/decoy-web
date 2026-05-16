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
    title: "Encryption at Rest",
    description: "All sensitive configuration (connection strings, seeds, API keys) are encrypted. The paid Web UI adds encrypted audit logs.",
  },
  {
    icon: Eye,
    title: "Source-Available Code",
    description: "The CLI is published under the Business Source License. Your security team can audit every line of code that touches your data.",
  },
  {
    icon: FileCheck,
    title: "Compliance Templates",
    description: "HIPAA, PCI, GDPR, SOX, and other built-in Disguise templates give your team a starting point for policy review. SOC 2 Type 2 in progress.",
  },
  {
    icon: Users,
    title: "RBAC & Audit Logs",
    description: "The paid Web UI includes role-based access control and audit logs. Know who ran what pipeline, when, and on which data.",
  },
  {
    icon: Shield,
    title: "Security Disclosures",
    description: "Report vulnerabilities to security@decoy.dev. We follow responsible disclosure and credit researchers in our changelog.",
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

        {/* Compliance section */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Compliance Status</h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">SOC 2 Type 2</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      In progress. Expected completion: Q2 2026. Covers the paid Web UI platform
                      (the self-hosted CLI doesn&apos;t require SOC 2 since it runs on your infrastructure).
                    </p>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">In Progress</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">HIPAA</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Business Associate Agreements (BAAs) are available by contract.
                      Self-hosted architecture means PHI never leaves your infrastructure.
                    </p>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Available by contract</span>
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
                      Because Decoy runs on your infrastructure in your jurisdiction,
                      no data is transferred to third parties. DPA available on request.
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
