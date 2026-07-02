export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllProducts } from "@/lib/data";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getAllProducts({ publishedOnly: true });

  return (
    <>
      <Header products={products} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
