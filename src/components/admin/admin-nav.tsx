"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Download,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

export function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link href="/admin" className="text-sm font-bold tracking-tight">
          BePlus{" "}
          <span className="text-brand-bright">Labs</span>
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
            Admin
          </span>
        </Link>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-background transition-transform md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
            BL
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-foreground">
              BePlus Labs
            </p>
            <p className="text-[10px] leading-tight text-muted-foreground">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom area */}
        <div className="border-t px-3 py-2">
          {/* Theme toggle */}
          <button
            onClick={toggleDark}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {dark ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

          {/* User menu */}
          <div className="relative mt-1">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                A
              </div>
              <span className="flex-1 text-left text-sm">Admin</span>
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  userMenuOpen && "rotate-180",
                )}
              />
            </button>
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border bg-popover p-1 shadow-lg">
                <form action="/api/admin-logout" method="POST">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <LogOut className="size-4" />
                    Log Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
