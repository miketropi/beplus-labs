import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChangelogForm } from "../../changelog-form";

export default async function EditChangelogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entryId = parseInt(id, 10);
  if (isNaN(entryId)) notFound();

  let entry: any = null;
  let products: any[] = [];

  try {
    [entry, products] = await Promise.all([
      prisma.changelogEntry.findUnique({ where: { id: entryId } }),
      prisma.product.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch {
    // DB not connected
  }

  if (!entry) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Edit Entry</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update changelog entry.
      </p>
      <div className="mt-6 max-w-2xl">
        <ChangelogForm entry={entry} products={products} />
      </div>
    </div>
  );
}
