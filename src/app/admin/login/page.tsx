"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/lib/admin-auth";
import { Loader2, Lock } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-all hover:bg-brand/90 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Signing in…
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
            BL
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-foreground">
            BePlus Labs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin panel sign in
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter admin password"
                  required
                  autoFocus
                  className="flex h-10 w-full rounded-lg border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <SubmitButton />
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BePlus Labs. All rights reserved.
        </p>
      </div>
    </div>
  );
}
