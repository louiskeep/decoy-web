import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "CLI",
    price: "$0",
    period: "local use",
    description: "For engineers validating and running pipelines locally or in CI.",
    features: [
      "8 field-list Disguises (HIPAA, PCI, GDPR...)",
      "Local YAML validation and file runs",
      "Local CSV STORM scans",
      "Local FORECAST from saved scan JSON",
      "Templates, demos, and JSON output for scripts",
      "Docs and community-style support",
    ],
    cta: "Read CLI docs",
    ctaLink: "/docs",
    highlighted: false,
  },
  {
    name: "Web UI",
    price: "$499",
    period: "/month",
    description: "For teams that need the self-hosted platform workflow and governance. Billed annually per instance.",
    features: [
      "Everything in CLI",
      "Files, STORM, FORECAST, and visual pipeline builder",
      "Shared pipelines, versions, jobs, and outputs",
      "Runtime secrets, API keys, and admin controls",
      "Schedules, triggers, and review gates",
      "Reporting, evidence, and audit history",
      "Team users and RBAC",
      "Email + business-hours support",
    ],
    cta: "Request a demo",
    ctaLink: "/trial",
    highlighted: true,
    badge: "Self-hosted",
  },
  {
    name: "Enterprise add-on",
    price: "Custom",
    period: "",
    description: "Custom deployment and support terms. Negotiated per contract.",
    features: [
      "Everything in Web UI",
      "Custom Disguises",
      "SSO / SAML by contract",
      "Air-gapped deployment support",
      "Custom support terms by contract",
      "Security review and onboarding support",
      "Additional environments at negotiated rate",
    ],
    cta: "Contact sales",
    ctaLink: "/trial",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="py-20 md:py-28 border-t border-border" id="pricing">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            V1 packaging without usage meters.
          </h2>
          <p className="text-muted-foreground text-lg">
            The CLI is free for local workflows. The paid Web UI is priced per self-hosted instance, billed annually.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-6",
                plan.highlighted
                  ? "border-primary bg-card"
                  : "border-border bg-card"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full"
              >
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            No per-row fees. No per-seat counting. $499/month per Web UI instance, billed annually.
            <br />
            <span className="text-foreground">Multi-environment customers (dev + staging + prod) are quoted per environment.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
