import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What's the difference between the CLI and Business tier?",
    answer:
      "The CLI is a free, open-source tool for individual engineers. It includes all masking transforms, synthetic generators, and connectors. The Business tier adds a web UI, scheduled runs, team collaboration, audit logs, and RBAC. Think of it as: CLI for building pipelines, Business for running them in production with your team.",
  },
  {
    question: "Does my data leave my network?",
    answer:
      "No. Forge runs entirely on your infrastructure. The CLI runs on your machine, and the Business platform runs in your cloud. The only external call is optional license validation, which sends zero data about your pipelines or datasets. For air-gapped environments, we provide offline license keys.",
  },
  {
    question: "How does format-preserving encryption work?",
    answer:
      "FPE encrypts data while keeping its format intact. A 16-digit credit card number stays a 16-digit number. An email stays an email. This is useful when downstream systems validate formats. FPE is deterministic with a seed, so the same input always produces the same output—critical for maintaining referential integrity across tables.",
  },
  {
    question: "Can I mask data across related tables?",
    answer:
      "Yes. Forge understands foreign key relationships and preserves referential integrity automatically. When you mask a user's email in the users table, their orders still link correctly. You define relationships once in your YAML config, and Forge handles the rest.",
  },
  {
    question: "What databases and file formats are supported?",
    answer:
      "PostgreSQL, MySQL, Snowflake, S3 (CSV, Parquet, JSON), and local files are fully supported today. BigQuery, Databricks, MongoDB, Redshift, and DynamoDB are on the roadmap. You can also request connectors via GitHub issues—we prioritize based on demand.",
  },
  {
    question: "Is Forge open source?",
    answer:
      "The CLI is source-available under the Business Source License (BUSL). You can read, modify, and use the code freely for non-commercial purposes. The license converts to Apache 2.0 after 4 years. This protects us from competitors offering a managed Forge while keeping the code transparent for security-conscious buyers.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most teams run their first masked dataset within 30 minutes of installing Forge. The `forge init` command scaffolds a starter config, and `forge generate schema` auto-detects your tables and suggests transforms. No consultants, no multi-week projects. Just install and run.",
  },
  {
    question: "What compliance certifications do you have?",
    answer:
      "SOC 2 Type 2 certification is in progress (expected Q2 2026). We provide HIPAA BAAs for healthcare customers on Enterprise plans. Our self-hosted architecture means your data governance policies apply—we're just tooling that runs inside your security perimeter.",
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
            Everything you need to know about Forge.
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
