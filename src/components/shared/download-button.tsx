"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Loader2, Check, ExternalLink } from "lucide-react";

type Props = {
  downloadUrl: string;
  releaseTag: string;
  productSlug: string;
  productName: string;
};

export function DownloadButton({
  downloadUrl,
  releaseTag,
  productSlug,
  productName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const close = useCallback(() => {
    if (status === "loading") return;
    setOpen(false);
    setStatus("idle");
    setErrorMsg("");
  }, [status]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/download-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || email.split("@")[0],
          productSlug,
          productName,
          releaseTag,
          downloadUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-bright px-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-bright/80"
      >
        <Download className="size-3.5" />
        Download {releaseTag}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="relative w-full max-w-md rounded-xl bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              {status === "success" ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-brand/10">
                    <Check className="size-6 text-brand" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    Check your email
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We sent the download link for <strong>{productName}</strong>{" "}
                    to <strong>{email}</strong>.
                  </p>
                  <a
                    href={downloadUrl}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-bright px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-bright/80"
                  >
                    <ExternalLink className="size-3.5" />
                    Direct download link
                  </a>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-foreground">
                    Download {productName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you the download link.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                      <label
                        htmlFor="download-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Name <span className="text-muted-foreground">(optional)</span>
                      </label>
                      <input
                        id="download-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="download-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="download-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1 block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-sm text-red-500">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-bright px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-bright/80 disabled:opacity-60"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Download className="size-4" />
                          Send download link
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
