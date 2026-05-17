"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Github, Shield, Database, Radar, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const productItems = [
  {
    title: "Data Masking",
    href: "/product/masking",
    description: "PII-safe copies of production data",
    icon: Shield,
  },
  {
    title: "Synthetic Data",
    href: "/product/synthetic-data",
    description: "Generate realistic test datasets",
    icon: Database,
  },
  {
    title: "STORM + FORECAST",
    href: "/#storm",
    description: "Scan, recommend, file a Report",
    icon: Radar,
  },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">D</span>
          </div>
          <span className="text-xl font-semibold">Decoy</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  {productItems.map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 rounded-md p-3 hover:bg-muted transition-colors"
                        >
                          <item.icon className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">{item.title}</div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {/* Disguises is the wedge — top-level placement per BRAND_GUIDE. */}
              <NavigationMenuLink asChild className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none"
                )}>
                <Link href="/disguises">
                  <ShieldCheck className="h-4 w-4 mr-1.5 text-primary" />
                  Disguises
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none"
                )}>
                <Link href="/pricing">
                  Pricing
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none"
                )}>
                <Link href="/docs">
                  Docs
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none"
                )}>
                <Link href="/blog">
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://github.com/louiskeep/decoy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Button asChild>
            <Link href="/trial">Request a demo</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-muted-foreground">Product</span>
                {productItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 text-foreground hover:text-primary transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/disguises"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-foreground hover:text-primary transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Disguises
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-foreground hover:text-primary transition-colors"
                >
                  Docs
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </div>
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Link
                  href="https://github.com/louiskeep/decoy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
                <Button asChild className="mt-2">
                  <Link href="/trial" onClick={() => setMobileOpen(false)}>
                    Request a demo
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
