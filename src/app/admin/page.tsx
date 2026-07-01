import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Package,
  GitCommit,
  Plus,
  ArrowRight,
  ExternalLink,
  Layers,
  Zap,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboard() {
  let productCount = 0;
  let changelogCount = 0;
  let recentEntries: any[] = [];
  let statusBreakdown: Record<string, number> = {};

  try {
    const [products, entries] = await Promise.all([
      prisma.product.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.changelogEntry.findMany({
        orderBy: { date: "desc" },
        take: 5,
        include: { product: { select: { name: true } } },
      }),
    ]);

    productCount = products.length;
    changelogCount = entries.length;
    recentEntries = entries;

    statusBreakdown = products.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  } catch {
    // DB not connected
  }

  const stats = [
    {
      label: "Total Products",
      value: productCount,
      icon: Package,
      color:
        "bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-bright",
    },
    {
      label: "Recent Updates",
      value: changelogCount,
      icon: GitCommit,
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "In Beta",
      value: statusBreakdown["beta"] || 0,
      icon: Zap,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      label: "Launched",
      value: statusBreakdown["launched"] || 0,
      icon: TrendingUp,
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
  ];

  const actions = [
    {
      href: "/admin/products/new",
      label: "New Product",
      desc: "Add a product",
      icon: Plus,
    },
    {
      href: "/admin/changelog/new",
      label: "New Changelog Entry",
      desc: "Log an update",
      icon: Layers,
    },
    {
      href: "/products",
      label: "View Public Site",
      desc: "See live site",
      icon: ExternalLink,
      external: true,
    },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your products and content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex size-11 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:border-brand/30 hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <action.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.desc}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentEntries.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Changelog Activity
            </h2>
            <Link
              href="/admin/changelog"
              className="text-xs font-medium text-brand-bright hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y rounded-xl border">
            {recentEntries.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/20"
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white ${
                    entry.type === "feature"
                      ? "bg-emerald-500"
                      : entry.type === "fix"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                >
                  {entry.type === "feature"
                    ? "F"
                    : entry.type === "fix"
                      ? "X"
                      : "I"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {entry.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.product?.name ?? entry.productSlug} &middot;{" "}
                    {entry.version}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
