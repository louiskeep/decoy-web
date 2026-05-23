import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Decoy",
  description: "Updates, tutorials, and notes about data masking, synthetic data, and privacy engineering.",
}

const posts = [
  {
    title: "Introducing Decoy: Reviewable masking and synthetic data workflows",
    excerpt: "Why Decoy focuses on explicit YAML, local CLI runs, relationship rules, and self-hosted team workflows.",
    date: "2026-04-15",
    category: "Announcement",
  },
  {
    title: "Format-Preserving Encryption Explained",
    excerpt: "How FPE keeps sensitive values in a compatible shape, and why that matters for downstream systems.",
    date: "2026-04-10",
    category: "Technical",
  },
  {
    title: "Masking vs. Synthetic Data: When to Use Each",
    excerpt: "A practical guide to choosing between masked source data and generated datasets for test environments.",
    date: "2026-04-05",
    category: "Guide",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
              <p className="text-lg text-muted-foreground">
                Updates, tutorials, and practical notes from the Decoy team.
              </p>
            </div>

            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
