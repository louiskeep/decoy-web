import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "CLI",
    price: "$0",
    period: "forever",
    description: "For individual engineers building and testing locally.",
    features: [
      "All masking transforms",
      "All synthetic generators",
      "All connectors",
      "YAML pipelines",
      "Unlimited local runs",
      "Community support",
    ],
    cta: "Install free",
    ctaLink: "#install",
    highlighted: false,
  },
  {
    name: "Business",
    price: "$499",
    period: "/month",
    description: "For teams who need scheduling, audit logs, and collaboration.",
    features: [
      "Everything in CLI",
      "Web UI & visual builder",
      "Scheduled runs",
      "Team access (up to 25 users)",
      "Audit logs",
      "RBAC",
      "Priority support",
    ],
    cta: "Start free trial",
    ctaLink: "/trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced security and compliance needs.",
    features: [
      "Everything in Business",
      "Unlimited users",
      "SSO / SAML",
      "Air-gapped deployments",
      "HIPAA BAA",
      "Dedicated support",
      "SLA guarantees",
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
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, predictable pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            No per-row fees. No surprise bills. No six-figure quotes.
          </p>
        </div>

        {/* Pricing cards */}
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

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include unlimited data volume. Business tier includes 14-day free trial, no credit card required.
            <br />
            <span className="text-foreground">20% off annual billing.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
