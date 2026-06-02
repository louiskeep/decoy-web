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
      "A Disguise is a bundled field-list template for a common masking context, such as HIPAA, PCI, GDPR, GLBA, CCPA, FERPA, SOX, or general PII. It is a starting point: your team still reviews field mappings, edits strategies, validates YAML, and owns the policy decision.",
  },
  {
    question: "What is STORM?",
    answer:
      "STORM is Decoy's dataset profiling flow. It scans a file, identifies supported detector patterns, records field statistics, and produces a profile you can explore directly to inform which Disguise template and per-column strategies to apply.",
  },
  {
    question: "How do I go from a STORM scan to a working pipeline?",
    answer:
      "Pick a bundled Disguise template (HIPAA, PCI, GDPR, generate, minimal) as a starting point, adjust the per-column strategies based on what STORM surfaced for your data, validate the YAML with decoy validate, then run with decoy run. Engineers stay in the loop: Decoy provides templates and a profile, not an automatic compliance decision.",
  },
  {
    question: "Can I keep relationships intact after masking?",
    answer:
      "Yes, when the relevant fields use deterministic strategies and the relationship is modeled. Decoy supports lock chains for existing related fields, FK generation, self references, many-to-many junctions, composite-key relationships, and primary-key uniqueness checks.",
  },
  {
    question: "What generation strategies are supported?",
    answer:
      "Generation supports faker, sequence, categorical, reference, and formula-based values in the full engine. Graph-mode generation focuses on faker, sequence, categorical, and formula today; some reference and relationship features are engine/direct-YAML capabilities before they are fully exposed in the graph UI.",
  },
  {
    question: "Does my data leave my network?",
    answer:
      "The CLI runs locally. The paid Web UI is self-hosted by the customer. STORM and masking both run where your data lives. Decoy V1 is not offered as a hosted SaaS product.",
  },
  {
    question: "What data sources are supported today?",
    answer:
      "V1 is file-first. The platform supports uploaded files and file/cloud object workflows for CSV and Parquet through local files, S3, Google Cloud Storage, and SFTP. Database source/target operations exist in engine/direct-YAML paths, but database connector UI workflows are deferred beyond V1.",
  },
  {
    question: "Is Decoy open source?",
    answer:
      "The CLI is source-available under the Business Source License (BUSL-1.1). The shared engine is Apache-2.0. The paid platform is self-hosted and commercially licensed.",
  },
  {
    question: "What's Decoy's compliance posture?",
    answer:
      "Decoy V1 is masking, generation, recommendation, and reporting tooling. It is not SOC 2 certified, not HIPAA certified, does not offer a BAA in V1, and is not FedRAMP authorized. Customers retain responsibility for their own compliance posture.",
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
            Practical boundaries for the CLI, platform, Disguises, and release scope.
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
