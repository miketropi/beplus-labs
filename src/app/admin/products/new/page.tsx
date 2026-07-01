import { ProductForm } from "../product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">New Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a new product to the catalog.
      </p>
      <div className="mt-6 max-w-2xl">
        <ProductForm />
      </div>
    </div>
  );
}
