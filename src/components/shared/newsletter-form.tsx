"use client";

import { useState } from "react";
import { Loader2, Check, ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-brand">
        <Check className="size-4" />
        You&apos;re subscribed!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-9 items-center gap-1 rounded-lg bg-brand-bright px-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-bright/90 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : status === "error" ? (
          "Try again"
        ) : (
          <>
            Subscribe <ArrowRight className="size-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
