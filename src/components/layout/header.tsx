"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, ChevronDown } from "lucide-react";
import { getAllProducts, STATUS_LABELS } from "@/lib/data";

const NAV_LINKS = [
  { href: "/changelog", label: "Changelog" },
  { href: "/beta", label: "Beta" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const productsRef = useRef<HTMLDivElement>(null);

  const products = getAllProducts();

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
                "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-brand",
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
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent",
                      pathname === `/products/${p.slug}` && "bg-accent",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.tagline}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
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
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-brand",
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

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" />}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] pt-12">
              <nav className="flex flex-col gap-1">
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
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
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-brand",
                      pathname === link.href ||
                        pathname.startsWith(link.href + "/")
                        ? "text-brand"
                        : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
