type DailyData = { date: string; count: number };
type ProductData = { product: string; count: number };

function DailyBarChart({ data }: { data: DailyData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div
      className="flex items-end gap-[2px]"
      style={{ height: 140 }}
    >
      {data.map((d, i) => {
        const pct = (d.count / max) * 100;
        const h = Math.max(pct, d.count > 0 ? 2 : 0);
        return (
          <div
            key={d.date}
            className="group relative flex flex-1 flex-col items-center justify-end min-w-0"
          >
            <div
              className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-1.5 py-0.5 text-[10px] tabular-nums leading-tight text-foreground opacity-0 shadow group-hover:opacity-100 transition-opacity"
            >
              {d.count > 0 ? `${d.date}: ${d.count}` : d.date}
            </div>
            {d.count > 0 && (
              <span className="mb-0.5 text-[10px] font-medium tabular-nums leading-none text-muted-foreground">
                {d.count}
              </span>
            )}
            <div
              className="w-full rounded-t-sm transition-opacity hover:opacity-100"
              style={{
                height: `${h}%`,
                backgroundColor:
                  d.count > 0
                    ? "var(--color-brand-bright)"
                    : "var(--color-muted)",
                opacity: d.count > 0 ? 0.72 : 0.3,
              }}
            />
            <span className="mt-1.5 text-[10px] leading-none text-muted-foreground">
              {i === 0 || i === data.length - 1 || d.date.endsWith("-01")
                ? d.date
                : d.date.slice(-2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ProductBarChart({ data }: { data: ProductData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const items = data.length > 0 ? data : null;

  return (
    <div className="space-y-3">
      {items ? (
        items.map((p) => {
          const w = (p.count / max) * 100;
          return (
            <div key={p.product} className="group flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs font-medium text-foreground">
                {p.product}
              </span>
              <div className="relative flex-1 h-5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-100"
                  style={{
                    width: `${Math.max(w, 3)}%`,
                    backgroundColor: "var(--color-brand-bright)",
                    opacity: 0.72,
                  }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-xs tabular-nums font-medium text-muted-foreground">
                {p.count}
              </span>
            </div>
          );
        })
      ) : (
        <div className="flex items-center gap-3 opacity-40">
          <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">
            —
          </span>
          <div className="relative flex-1 h-5 rounded-full bg-muted overflow-hidden" />
          <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            0
          </span>
        </div>
      )}
    </div>
  );
}

export function DownloadCharts({
  daily,
  product,
}: {
  daily: DailyData[];
  product: ProductData[];
}) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-5">
      <div className="rounded-xl border bg-card p-5 lg:col-span-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">Downloads</h3>
          <span className="text-[11px] text-muted-foreground">last 14 days</span>
        </div>
        <div className="mt-4">
          <DailyBarChart data={daily} />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 lg:col-span-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">By Product</h3>
          <span className="text-[11px] text-muted-foreground">all time</span>
        </div>
        <div className="mt-4">
          <ProductBarChart data={product} />
        </div>
      </div>
    </div>
  );
}
