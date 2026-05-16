import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What's a Disguise?",
    answer:
      "A Disguise is a pre-built compliance template (HIPAA, PCI, GDPR, GLBA, CCPA, FERPA, SOX, plus a sensible default) that masks the right fields the right way. Apply with one flag instead of configuring transforms from scratch -- and stay aligned with the regulation as it evolves.",
  },
  {
    question: "What is STORM?",
    answer:
      "STORM is Decoy's dataset analysis event. It scans your data, identifies fields, detects formats, and computes statistical and re-identification risk profiles. STORM finds it; FORECAST explains it; Report files it.",
  },
  {
    question: "Does FORECAST replace a data engineer?",
    answer:
      "No. FORECAST recommends a Disguise and per-field Masks based on STORM's profile. Your engineers approve, edit, and ship the pipeline. Think of it as the senior reviewer who's read every compliance regulation -- not the engineer who writes the pipeline.",
  },
  {
    question: "Can I export Reports for compliance audits?",
    answer:
      "Yes. Every Report can be exported and shared with a compliance officer. Reports include the original STORM scan, the FORECAST recommendation, and a hash of the masked run.",
  },
  {
    question: "Does my data leave my network?",
    answer:
      "No. Decoy runs entirely on your infrastructure -- CLI on your machine, paid Web UI in your VPC. FORECAST never touches raw data: it only reads STORM's statistical profile, so your PHI, PCI, or customer PII stays where it lives. The only optional external call is license validation, which carries zero pipeline or dataset content.",
  },
  {
    question: "How does format-preserving encryption (FPE) work?",
    answer:
      "FPE encrypts a value while keeping its format intact -- a 16-digit card stays a 16-digit number, an email stays an email. It's deterministic with a seed, so the same input always produces the same output. That's how foreign keys and joins keep working after you mask.",
  },
  {
    question: "Can Decoy mask data across related tables?",
    answer:
      "Yes. Decoy understands foreign and composite keys and preserves referential integrity automatically. When you mask a user's email in users, their rows in orders, sessions, and audit_log still join correctly with no extra config.",
  },
  {
    question: "What data sources are supported today?",
    answer:
      "File upload (CSV and Parquet), Amazon S3, Google Cloud Storage, and SFTP work today. Direct database connections -- PostgreSQL, MySQL, Snowflake, and others -- are coming in a future release. BigQuery, Databricks, Redshift, and MongoDB are also on the roadmap. Need a connector we don't have? Open a GitHub issue -- we prioritize by demand.",
  },
  {
    question: "Is Decoy open source?",
    answer:
      "The CLI and engine are source-available under the Business Source License (BUSL-1.1). You can read, modify, and run the code freely for non-commercial use. The license converts to Apache 2.0 after 4 years. The paid platform is also self-hosted -- you run it, we don't see your data.",
  },
  {
    question: "What compliance certifications do you have?",
    answer:
      "SOC 2 Type 2 is in progress (expected Q2 2026). HIPAA BAAs are available by contract. Because Decoy is self-hosted, your existing data governance, encryption, and access controls apply -- we ship tooling that runs inside your security perimeter, not a SaaS that sees your data.",
  },
]

export function FAQ() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about Decoy.
          </p>
        </div>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
