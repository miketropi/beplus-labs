import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Package,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Bug,
  Lightbulb,
  Sparkles,
  Zap,
  TrendingUp,
  Code2,
} from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  bug: "Bug Reports",
  feature: "Feature Requests",
  improvement: "Improvements",
  general: "General",
};

const CATEGORY_ICONS: Record<string, typeof Bug> = {
  bug: Bug,
  feature: Lightbulb,
  improvement: Sparkles,
  general: MessageSquare,
};

const CATEGORY_COLORS: Record<string, string> = {
  bug: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  feature: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  improvement: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  general: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default async function AdminDashboard() {
  let productCount = 0;
  let feedbackCount = 0;
  let unreadCount = 0;
  let statusBreakdown: Record<string, number> = {};
  let categoryBreakdown: Record<string, number> = {};
  let recentFeedback: any[] = [];

  try {
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    productCount = products.length;
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

  try {
    const [feedback, recent] = await Promise.all([
      prisma.feedback.findMany({ select: { read: true, category: true } }),
      prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    feedbackCount = feedback.length;
    unreadCount = feedback.filter((f) => !f.read).length;
    recentFeedback = recent;

    categoryBreakdown = feedback.reduce(
      (acc, f) => {
        if (f.category) acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  } catch {
    // Feedback table not available
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
      label: "Feedback",
      value: feedbackCount,
      sub: unreadCount > 0 ? `${unreadCount} unread` : undefined,
      icon: MessageSquare,
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      href: "/admin/feedback",
    },
    {
      label: "In Development",
      value: statusBreakdown["dev"] || 0,
      icon: Code2,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
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
      href: "/admin/feedback",
      label: "View Feedback",
      desc: "Review submissions",
      icon: MessageSquare,
    },
    {
      href: "/products",
      label: "View Public Site",
      desc: "See live site",
      icon: ExternalLink,
      external: true,
    },
  ];

  const StatCard = ({ stat }: { stat: (typeof stats)[number] }) => {
    const inner = (
      <div className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm">
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
            {stat.sub && (
              <span className="inline-flex items-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-medium text-brand-foreground">
                {stat.sub}
              </span>
            )}
          </div>
        </div>
      </div>
    );

    if (stat.href) {
      return <Link href={stat.href}>{inner}</Link>;
    }
    return inner;
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your products and feedback.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Feedback Breakdown & Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Feedback by Category */}
        <div className="rounded-xl border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Feedback by Category
          </h2>
          {Object.keys(categoryBreakdown).length === 0 ? (
            <p className="text-sm text-muted-foreground">No feedback yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([cat, count]) => {
                const Icon = CATEGORY_ICONS[cat] || MessageSquare;
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg ${CATEGORY_COLORS[cat] || ""}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="text-sm text-foreground">
                        {CATEGORY_LABELS[cat] || cat}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Feedback */}
        <div className="rounded-xl border bg-card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Feedback
            </h2>
            <Link
              href="/admin/feedback"
              className="text-xs font-medium text-brand-bright hover:underline"
            >
              View all
            </Link>
          </div>
          {recentFeedback.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No submissions yet.
            </p>
          ) : (
            <div className="divide-y">
              {recentFeedback.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white ${
                      f.category === "bug"
                        ? "bg-red-500"
                        : f.category === "feature"
                          ? "bg-blue-500"
                          : f.category === "improvement"
                            ? "bg-amber-500"
                            : "bg-green-500"
                    }`}
                  >
                    {f.category === "bug"
                      ? "B"
                      : f.category === "feature"
                        ? "F"
                        : f.category === "improvement"
                          ? "I"
                          : "G"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {f.name}
                      {!f.read && (
                        <span className="ml-2 inline-flex size-2 rounded-full bg-brand align-middle" />
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {f.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {f.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
    </div>
  );
}
