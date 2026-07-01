"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProduct, updateProduct, deleteProduct } from "@/lib/admin-actions";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Save Product
    </button>
  );
}

type ProductData = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  status: string;
  icon: string;
  coverImage: string;
  category: string;
  github?: string | null;
} | null;

export function ProductForm({ product }: { product?: ProductData }) {
  const isNew = !product;
  const [state, formAction] = useActionState(
    async (_prev: any, formData: FormData) => {
      if (isNew) return createProduct(formData);
      return updateProduct(product!.slug, formData);
    },
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            required
            readOnly={!isNew}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring read-only:opacity-60"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tagline</label>
        <input
          name="tagline"
          defaultValue={product?.tagline ?? ""}
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Features <span className="text-muted-foreground">(one per line)</span>
        </label>
        <textarea
          name="features"
          rows={4}
          defaultValue={product?.features?.join("\n") ?? ""}
          className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={product?.status ?? "dev"}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="dev">In Development</option>
            <option value="beta">Beta</option>
            <option value="launched">Launched</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Icon</label>
          <input
            name="icon"
            defaultValue={product?.icon ?? ""}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <input
            name="category"
            defaultValue={product?.category ?? ""}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image URL</label>
        <input
          name="coverImage"
          defaultValue={product?.coverImage ?? ""}
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          GitHub <span className="text-muted-foreground">(owner/repo)</span>
        </label>
        <input
          name="github"
          defaultValue={product?.github ?? ""}
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        {!isNew && (
          <button
            type="button"
            onClick={async () => {
              if (confirm("Delete this product? This will also delete its changelog entries.")) {
                const { deleteProduct } = await import(
                  "@/lib/admin-actions"
                );
                await deleteProduct(product!.slug);
              }
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
