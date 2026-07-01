import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[80vh] md:min-h-screen">
      <AdminNav />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 px-6 py-8 md:px-8">{children}</main>
        <footer className="border-t px-8 py-3 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BePlus Labs Admin
        </footer>
      </div>
    </div>
  );
}
