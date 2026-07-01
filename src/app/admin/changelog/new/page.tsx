import { prisma } from "@/lib/prisma";
import { ChangelogForm } from "../changelog-form";

export default async function NewChangelogPage() {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  } catch {
    // DB not connected
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">New Changelog Entry</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a new changelog entry.
      </p>
      <div className="mt-6 max-w-2xl">
        <ChangelogForm products={products} />
      </div>
    </div>
  );
}
