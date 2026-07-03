"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, ChevronDown } from "lucide-react";
import type { Product } from "@/lib/data";
import { STATUS_LABELS } from "@/lib/data";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
        fill="currentColor"
      />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/changelog", label: "Changelog" },
  { href: "/feedback", label: "Feedback" },
  { href: "/about", label: "About" },
];

export function Header({ products }: { products: Product[] }) {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const productsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    }
    if (productsOpen) {
      document.addEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [productsOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark"));

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60"
          : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          BePlus <span className="text-brand">Labs</span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {/* Products dropdown */}
          <div ref={productsRef} className="relative">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-2  font-medium transition-colors hover:text-brand",
                pathname.startsWith("/products")
                  ? "text-brand"
                  : "text-muted-foreground",
              )}
            >
              Products
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  productsOpen && "rotate-180",
                )}
              />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border bg-card p-2 shadow-lg">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    onClick={() => setProductsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5  transition-colors hover:bg-accent",
                      pathname === `/products/${p.slug}` && "bg-accent",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {p.tagline}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {STATUS_LABELS[p.status]}
                    </span>
                  </Link>
                ))}
                <div className="mt-1 border-t pt-1">
                  <Link
                    href="/products"
                    onClick={() => setProductsOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-accent"
                  >
                    View all products
                  </Link>
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2  font-medium transition-colors hover:text-brand",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-brand"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            suppressHydrationWarning
          >
            {dark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            aria-label="Join our Discord"
          >
            <DiscordIcon className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" />}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] pt-12">
              <nav className="flex flex-col gap-1">
                <p className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                  Products
                </p>
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-brand",
                      pathname === `/products/${p.slug}`
                        ? "text-brand"
                        : "text-muted-foreground",
                    )}
                  >
                    {p.name}
                  </Link>
                ))}
                <Link
                  href="/products"
                  className="rounded-md px-3 py-2 text-sm font-medium text-brand transition-colors hover:text-brand"
                >
                  All Products
                </Link>
                <div className="my-2 border-t" />
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-md px-3 py-2  font-medium transition-colors hover:text-brand",
                      pathname === link.href ||
                        pathname.startsWith(link.href + "/")
                        ? "text-brand"
                        : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t" />
                <a
                  href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
                >
                  <DiscordIcon className="h-4 w-4" />
                  Discord
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
