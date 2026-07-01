"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Paintbrush,
  Menu,
  Sparkles,
  Search,
  Rocket,
  BarChart3,
  Shield,
  MessageSquare,
  Activity,
  Flag,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  paintbrush: Paintbrush,
  menu: Menu,
  sparkles: Sparkles,
  search: Search,
  rocket: Rocket,
  "bar-chart-3": BarChart3,
  shield: Shield,
  "message-square": MessageSquare,
  activity: Activity,
  flag: Flag,
};

export interface ProductCardProps {
  slug: string;
  name: string;
  tagline: string;
  status: "dev" | "beta" | "launched";
  iconName?: string;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  dev: "border-yellow-400/30 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300",
  beta: "border-brand-bright/30 bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright",
  launched:
    "border-green-400/30 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
};

const STATUS_LABELS: Record<string, string> = {
  dev: "In Dev",
  beta: "Beta",
  launched: "Live",
};

export function ProductCard({
  slug,
  name,
  tagline,
  status,
  iconName,
  className,
}: ProductCardProps) {
  const Icon = iconName ? ICON_MAP[iconName] : null;

  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border bg-card p-6 transition-all hover:border-brand-bright/30 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <span
          className={cn(
            "inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium",
            STATUS_STYLES[status],
          )}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      </div>

      <div className="mt-auto flex items-center gap-1 text-sm font-medium text-brand transition-all group-hover:gap-2">
        Learn more <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
