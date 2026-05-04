import { Database, Cloud, FileJson, Snowflake } from "lucide-react"

const integrations = [
  {
    name: "PostgreSQL",
    icon: Database,
    category: "Database",
    available: true,
  },
  {
    name: "MySQL",
    icon: Database,
    category: "Database",
    available: true,
  },
  {
    name: "Snowflake",
    icon: Snowflake,
    category: "Data Warehouse",
    available: true,
  },
  {
    name: "Amazon S3",
    icon: Cloud,
    category: "Storage",
    available: true,
  },
  {
    name: "CSV / Parquet",
    icon: FileJson,
    category: "Files",
    available: true,
  },
  {
    name: "BigQuery",
    icon: Database,
    category: "Data Warehouse",
    available: "soon",
  },
  {
    name: "Databricks",
    icon: Database,
    category: "Data Platform",
    available: "soon",
  },
  {
    name: "MongoDB",
    icon: Database,
    category: "NoSQL",
    available: "soon",
  },
  {
    name: "Redshift",
    icon: Database,
    category: "Data Warehouse",
    available: "soon",
  },
  {
    name: "DynamoDB",
    icon: Database,
    category: "NoSQL",
    available: "soon",
  },
]

export function Integrations() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Connect to your data, wherever it lives
          </h2>
          <p className="text-muted-foreground text-lg">
            First-class support for PostgreSQL, MySQL, S3, and Snowflake. More connectors shipping monthly.
          </p>
        </div>

        {/* Integrations grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="relative flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              {integration.available === "soon" && (
                <span className="absolute top-2 right-2 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <integration.icon className="h-6 w-6 text-foreground" />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{integration.name}</div>
                <div className="text-xs text-muted-foreground">
                  {integration.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Request connector CTA */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Need a connector we don&apos;t have?{" "}
            <a
              href="https://github.com/forgeio/forge/issues/new?template=connector_request.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Request it on GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
