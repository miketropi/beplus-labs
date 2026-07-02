import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MessageSquare, CheckCheck } from "lucide-react";
import { FeedbackActions } from "./feedback-actions";

const CATEGORY_LABELS: Record<string, string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  improvement: "Improvement",
  general: "General",
};

const CATEGORY_COLORS: Record<string, string> = {
  bug: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  feature: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  improvement: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  general: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default async function AdminFeedbackPage() {
  let feedback: any[] = [];

  try {
    feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB not connected
  }

  const unread = feedback.filter((f) => !f.read).length;

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-brand-bright" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Feedback
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {feedback.length} submission{feedback.length !== 1 ? "s" : ""}
            {unread > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-brand-foreground">
                {unread} unread
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {feedback.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No feedback submissions yet.
                </td>
              </tr>
            )}
            {feedback.map((f) => (
              <tr
                key={f.id}
                className={`hover:bg-muted/20 transition-colors ${!f.read ? "bg-brand-muted/30" : ""}`}
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-medium ${
                      f.read
                        ? "bg-muted text-muted-foreground"
                        : "bg-brand text-brand-foreground"
                    }`}
                    title={f.read ? "Read" : "Unread"}
                  >
                    {f.read ? (
                      <CheckCheck className="size-3.5" />
                    ) : (
                      <span className="size-2 rounded-full bg-current" />
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      CATEGORY_COLORS[f.category] || ""
                    }`}
                  >
                    {CATEGORY_LABELS[f.category] || f.category}
                  </span>
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className="truncate text-muted-foreground">
                    {f.productSlug && (
                      <span className="mr-1 inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {f.productSlug}
                      </span>
                    )}
                    {f.message}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {f.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <FeedbackActions item={f} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
