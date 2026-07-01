"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitContactForm } from "@/lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="h-12 w-full bg-brand-bright text-sm font-semibold text-brand-foreground hover:bg-brand-bright/90 disabled:opacity-60 sm:w-auto sm:px-8"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Sending…
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Send className="h-4 w-4" /> Send Message
        </span>
      )}
    </Button>
  );
}

type FormState = { success?: boolean; error?: string } | null;

export function ContactForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    submitContactForm,
    null,
  );

  if (state?.success) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
          <Send className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Message Sent!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-8">
      <h2 className="text-lg font-semibold text-foreground">
        Send us a message
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fill out the form and we&apos;ll get back to you as soon as possible.
      </p>

      <form action={formAction} className="mt-6 space-y-5">
        {state?.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {state.error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            placeholder="What's this about?"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Tell us what's on your mind…"
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
