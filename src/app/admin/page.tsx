import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Package,
  Download,
  MessageSquare,
  Code2,
  Zap,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Bug,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { DownloadCharts } from "@/components/admin/download-chart";

const STATUS = {
  dev: { label: "Dev", icon: Code2, dot: "bg-purple-500" },
  beta: { label: "Beta", icon: Zap, dot: "bg-amber-500" },
  launched: { label: "Launched", icon: TrendingUp, dot: "bg-emerald-500" },
} as const;

const CATEGORY: Record<
  string,
  { label: string; icon: typeof Bug; bar: string }
> = {
  bug: { label: "Bugs", icon: Bug, bar: "bg-red-500" },
  feature: { label: "Features", icon: Lightbulb, bar: "bg-blue-500" },
  improvement: { label: "Improvements", icon: Sparkles, bar: "bg-amber-500" },
  general: { label: "General", icon: MessageSquare, bar: "bg-green-500" },
};

const CARD =
  "rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm";

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
  sub,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  accent: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className={CARD}>
      <div className="flex items-center gap-3">
        <div className={accent}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {value}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}

const ICON_STYLE =
  "flex size-10 shrink-0 items-center justify-center rounded-lg";

export default async function AdminDashboard() {
  let productCount = 0;
  let statusBreakdown: Record<string, number> = {};

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
  } catch {}

  let feedbackCount = 0;
  let unreadCount = 0;
  let categoryBreakdown: Record<string, number> = {};
  let recentFeedback: any[] = [];

  try {
    const [fb, recent] = await Promise.all([
      prisma.feedback.findMany({ select: { read: true, category: true } }),
      prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    feedbackCount = fb.length;
    unreadCount = fb.filter((f) => !f.read).length;
    recentFeedback = recent;
    categoryBreakdown = fb.reduce(
      (acc, f) => {
        if (f.category) acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  } catch {}

  let downloadCount = 0;
  let dailyDownloads: { date: string; count: number }[] = [];
  let productDownloads: { product: string; count: number }[] = [];

  try {
    downloadCount = await prisma.downloadLog.count();

    const start = new Date();
    start.setUTCDate(start.getUTCDate() - 13);
    start.setUTCHours(0, 0, 0, 0);

    const downloads = await prisma.downloadLog.findMany({
      select: { createdAt: true, productName: true },
      orderBy: { createdAt: "asc" },
    });

    const dayMap = new Map<string, number>();
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      dayMap.set(d.toISOString().slice(0, 10), 0);
    }
    for (const dl of downloads) {
      const key = dl.createdAt.toISOString().slice(0, 10);
      if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) || 0) + 1);
    }
    dailyDownloads = Array.from(dayMap.entries()).map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));

    const productMap = new Map<string, number>();
    for (const dl of downloads) {
      productMap.set(dl.productName, (productMap.get(dl.productName) || 0) + 1);
    }
    productDownloads = Array.from(productMap.entries())
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count);
  } catch {}

  const linkCard =
    "block rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm";

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor downloads, feedback, and product activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          value={productCount}
          label="Products"
          accent={`${ICON_STYLE} bg-brand/10 text-brand dark:bg-brand-bright/10 dark:text-brand-bright`}
        />

        <Link href="/admin/downloads" className={linkCard}>
          <div className="flex items-center gap-3">
            <div className={`${ICON_STYLE} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`}>
              <Download className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {downloadCount}
              </p>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/feedback" className={linkCard}>
          <div className="flex items-center gap-3">
            <div className={`${ICON_STYLE} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`}>
              <MessageSquare className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {feedbackCount}
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">Feedback</p>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-brand-bright px-1.5 py-px text-[10px] font-semibold tabular-nums text-brand-foreground">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        <div className={CARD}>
          <div className="flex items-start gap-3">
            <div className={`${ICON_STYLE} bg-muted text-muted-foreground`}>
              <TrendingUp className="size-5" />
            </div>
            <div className="flex-1 space-y-1.5">
              {(Object.keys(STATUS) as (keyof typeof STATUS)[]).map((s) => {
                const cfg = STATUS[s];
                const Icon = cfg.icon;
                return (
                  <div
                    key={s}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                      <Icon className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-xs font-medium tabular-nums text-foreground">
                      {statusBreakdown[s] || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Download charts */}
      <DownloadCharts daily={dailyDownloads} product={productDownloads} />

      {/* Feedback breakdown & recent */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className={CARD}>
          <h3 className="text-sm font-semibold text-foreground">
            Feedback Categories
          </h3>
          {Object.keys(categoryBreakdown).length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">
              No feedback yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3.5">
              {Object.entries(categoryBreakdown).map(([cat, count]) => {
                const cfg = CATEGORY[cat] || CATEGORY.general;
                const Icon = cfg.icon;
                const total = Object.values(categoryBreakdown).reduce(
                  (a, b) => a + b,
                  0,
                );
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Icon className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">
                          {cfg.label}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {count}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${cfg.bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={CARD}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Feedback
            </h3>
            <Link
              href="/admin/feedback"
              className="text-xs font-medium text-brand-bright hover:underline"
            >
              View all
            </Link>
          </div>
          {recentFeedback.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">
              No submissions yet.
            </p>
          ) : (
            <div className="mt-5 divide-y">
              {recentFeedback.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                      f.category === "bug"
                        ? "bg-red-500"
                        : f.category === "feature"
                          ? "bg-blue-500"
                          : f.category === "improvement"
                            ? "bg-amber-500"
                            : "bg-green-500"
                    }`}
                  >
                    {(f.category || "g")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {f.name}
                      {!f.read && (
                        <span className="ml-1.5 inline-flex size-1.5 rounded-full bg-brand-bright align-middle" />
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

      {/* Quick actions */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-bright/30 hover:bg-accent"
        >
          <ArrowRight className="size-3" />
          Add Product
        </Link>
        <Link
          href="/admin/downloads"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-bright/30 hover:bg-accent"
        >
          <Download className="size-3" />
          View Downloads
        </Link>
        <Link
          href="/admin/feedback"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-bright/30 hover:bg-accent"
        >
          <MessageSquare className="size-3" />
          View Feedback
        </Link>
        <Link
          href="/products"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand-bright/30 hover:bg-accent"
        >
          <ExternalLink className="size-3" />
          Public Site
        </Link>
      </div>
    </div>
  );
}
