"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  MessageSquare,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/data";
import { submitFeedback } from "@/lib/actions";

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
          Send Feedback <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </Button>
  );
}

type FormState = { success?: boolean; error?: string } | null;

export function FeedbackForm({ products }: { products: Product[] }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    submitFeedback,
    null,
  );


  if (state?.success) {
    return (
      <div className="mt-12 rounded-xl border bg-card p-8 text-center sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
          <MessageSquare className="size-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Thanks for your feedback!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We review every submission and your input helps us build better products.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-5">
      <div className="rounded-xl border bg-card p-6 sm:p-8 lg:col-span-3">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Share Your Thoughts
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Found a bug? Have a feature idea? We&apos;d love to hear from you.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {state.error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
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
            <label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a category</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement Suggestion</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="productSlug" className="text-sm font-medium">
              Related Product <span className="text-muted-foreground">(optional)</span>
            </label>
            <select
              id="productSlug"
              name="productSlug"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">No specific product</option>
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Your Feedback <span className="text-destructive">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Describe your feedback, suggestion, or issue in detail…"
              rows={6}
              required
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              We read every submission. No spam, ever.
            </p>
            <SubmitButton />
          </div>
        </form>
      </div>

      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquare className="size-4 text-brand" />
            What to share
          </h3>
          <ul className="mt-3 space-y-2.5">
            {[
              "Bug reports with steps to reproduce",
              "Feature ideas for new or existing products",
              "Usability improvements and suggestions",
              "General thoughts on the product suite",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Check className="size-4 text-brand" />
            What happens next
          </h3>
          <ol className="mt-3 space-y-2.5">
            {[
              "We review every submission",
              "Relevant feedback gets added to our roadmap",
              "You may hear back for clarification",
              "Your input directly shapes our products",
            ].map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-muted text-[11px] font-semibold text-brand-foreground dark:bg-brand-bright/20 dark:text-brand-bright">
                  {step.charAt(0)}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
