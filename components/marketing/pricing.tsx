import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "CLI",
    price: "$0",
    period: "forever",
    description: "For engineers validating and running pipelines locally or in CI.",
    features: [
      "8 compliance Disguises (HIPAA, PCI, GDPR...)",
      "Local YAML validation and file runs",
      "Local CSV STORM scans",
      "Local FORECAST from saved scan JSON",
      "Templates, demos, and JSON output for scripts",
      "Docs and community-style support",
    ],
    cta: "Install free",
    ctaLink: "#install",
    highlighted: false,
  },
  {
    name: "Web UI",
    price: "$499",
    period: "/month",
    description: "For teams that need the self-hosted platform workflow and governance.",
    features: [
      "Everything in CLI",
      "Files, STORM, FORECAST, and visual pipeline builder",
      "Shared pipelines, versions, jobs, and outputs",
      "Runtime secrets, API keys, and admin controls",
      "Schedules, triggers, and review gates",
      "Reporting, evidence, and audit history",
      "Team users and RBAC",
    ],
    cta: "Start free trial",
    ctaLink: "/trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise add-on",
    price: "Custom",
    period: "",
    description: "For regulated organizations that need custom deployment and support terms.",
    features: [
      "Everything in Web UI",
      "Custom Disguises",
      "SSO / SAML by contract",
      "HIPAA BAA by contract",
      "Air-gapped deployment support",
      "SLA and dedicated support terms",
      "Security review and onboarding support",
    ],
    cta: "Contact sales",
    ctaLink: "/contact",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section className="py-20 md:py-28 border-t border-border" id="pricing">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Flat pricing. No per-row fees.
          </h2>
          <p className="text-muted-foreground text-lg">
            No surprise bills. No six-figure quotes.
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
            No per-row fees on any plan. Web UI includes a 14-day free trial; no credit card required.
            <br />
            <span className="text-foreground">20% off annual billing.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
