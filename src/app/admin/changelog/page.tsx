import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Trash2, GitCommit } from "lucide-react";
import { deleteChangelogEntry } from "@/lib/admin-actions";

export default async function AdminChangelogPage() {
  let entries: any[] = [];

  try {
    entries = await prisma.changelogEntry.findMany({
      orderBy: { date: "desc" },
      include: { product: { select: { name: true } } },
    });
  } catch {
    // DB not connected
  }

  const typeColor: Record<string, string> = {
    feature: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    fix: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    improvement:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="max-w-6xl">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitCommit className="size-5 text-brand-bright" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Changelog
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Link
          href="/admin/changelog/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand/90"
        >
          <Plus className="size-4" /> New Entry
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Version
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No changelog entries yet.{" "}
                  <Link
                    href="/admin/changelog/new"
                    className="text-brand-bright hover:underline"
                  >
                    Add one
                  </Link>
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(e.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link
                    href={`/admin/changelog/${e.id}/edit`}
                    className="hover:text-brand-bright transition-colors"
                  >
                    {e.product?.name ?? e.productSlug}
                  </Link>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-foreground">
                  {e.title}
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {e.version || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      typeColor[e.type] || ""
                    }`}
                  >
                    {e.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/changelog/${e.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      <Pencil className="size-3" /> Edit
                    </Link>
                    <form action={deleteChangelogEntry.bind(null, e.id)}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        <Trash2 className="size-3" /> Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
