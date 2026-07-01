"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createChangelogEntry,
  updateChangelogEntry,
} from "@/lib/admin-actions";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Save Entry
    </button>
  );
}

type ProductSummary = { slug: string; name: string };
type EntryData = {
  id: number;
  date: Date | string;
  productSlug: string;
  title: string;
  content: string;
  version: string;
  type: string;
};

export function ChangelogForm({
  entry,
  products,
}: {
  entry?: EntryData;
  products: ProductSummary[];
}) {
  const isNew = !entry;
  const [state, formAction] = useActionState(
    async (_prev: any, formData: FormData) => {
      if (isNew) return createChangelogEntry(formData);
      return updateChangelogEntry(entry!.id, formData);
    },
    null,
  );

  const defaultDate = entry
    ? new Date(entry.date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <input
            name="date"
            type="date"
            defaultValue={defaultDate}
            required
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Product</label>
          <select
            name="productSlug"
            defaultValue={entry?.productSlug ?? ""}
            required
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          defaultValue={entry?.title ?? ""}
          required
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <textarea
          name="content"
          rows={4}
          defaultValue={entry?.content ?? ""}
          className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Version</label>
          <input
            name="version"
            defaultValue={entry?.version ?? ""}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select
            name="type"
            defaultValue={entry?.type ?? "feature"}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="feature">Feature</option>
            <option value="fix">Fix</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
