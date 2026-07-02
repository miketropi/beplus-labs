"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

type Log = {
  id: number;
  productName: string;
  productSlug: string;
  email: string;
  releaseTag: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
};

export function DownloadLogsTable({
  logs,
  products,
}: {
  logs: Log[];
  products: string[];
}) {
  const [product, setProduct] = useState("");
  const [email, setEmail] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (product && log.productName !== product) return false;
      if (email && !log.email.toLowerCase().includes(email.toLowerCase()))
        return false;
      return true;
    });
  }, [logs, product, email]);

  function clear() {
    setProduct("");
    setEmail("");
  }

  const hasFilter = product || email;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="dl-product"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Product
          </label>
          <select
            id="dl-product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="block w-44 rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="dl-email"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Email
          </label>
          <input
            id="dl-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Search email…"
            className="block w-56 rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-bright px-4 py-2 text-sm font-medium text-brand-foreground">
            <Search className="size-3.5" />
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          {hasFilter && (
            <button
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Release
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                IP
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User Agent
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No downloads matched your filters.
                </td>
              </tr>
            )}
            {filtered.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {log.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.productSlug}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{log.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {log.releaseTag}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {log.ip || "—"}
                </td>
                <td className="max-w-[200px] px-4 py-3">
                  <p
                    className="truncate text-muted-foreground"
                    title={log.userAgent || ""}
                  >
                    {log.userAgent || "—"}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {new Date(log.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
