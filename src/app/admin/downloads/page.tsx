import { prisma } from "@/lib/prisma";
import { Download } from "lucide-react";
import { DownloadLogsTable } from "@/components/admin/download-logs-table";

export default async function AdminDownloadsPage() {
  let products: string[] = [];
  let logs: any[] = [];

  try {
    const raw = await prisma.downloadLog.findMany({
      select: { productName: true },
      distinct: ["productName"],
      orderBy: { productName: "asc" },
    });
    products = raw.map((r) => r.productName);
  } catch {}

  try {
    logs = await prisma.downloadLog.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB not connected
  }

  const serialized = logs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Download className="size-5 text-brand-bright" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Download Logs
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {logs.length} download{logs.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
      </div>

      <DownloadLogsTable logs={serialized} products={products} />
    </div>
  );
}
