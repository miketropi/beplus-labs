import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: any = null;

  try {
    product = await prisma.product.findUnique({ where: { slug } });
  } catch {
    // DB not connected
  }

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit product details.
      </p>
      <div className="mt-6 max-w-2xl">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
