"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Rocket,
  Loader2,
  ArrowRight,
  Check,
  Zap,
  GitFork,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { getAllProducts } from "@/lib/data";
import { submitBetaRequest } from "@/lib/actions";
import { TipTapEditor } from "@/components/shared/tiptap-editor";

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
          Submit Request <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </Button>
  );
}

type FormState = { success?: boolean; error?: string } | null;

export function BetaForm() {
  const products = getAllProducts();
  const [state, formAction] = useActionState<FormState, FormData>(
    submitBetaRequest,
    null,
  );
  const [description, setDescription] = useState("");

  if (state?.success) {
    return (
      <div className="mt-12 rounded-xl border bg-card p-8 text-center sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
          <Rocket className="size-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          You&apos;re on the list!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for joining the beta program. We&apos;ll review your request
          and get back to you within 48 hours. Keep an eye on your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-5">
      {/* Form */}
      <div className="rounded-xl border bg-card p-6 sm:p-8 lg:col-span-3">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Request Early Access
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us about yourself and what you&apos;re building.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {state.error}
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Project Details */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">
              Project Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Your company or agency (optional)"
                />
              </div>

              <FieldSet>
                <FieldLegend>Products you&apos;re interested in</FieldLegend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {products.map((product) => (
                    <FieldLabel
                      key={product.slug}
                      htmlFor={`product-${product.slug}`}
                      className="cursor-pointer"
                    >
                      <Field orientation="horizontal" className="!p-3">
                        <Checkbox
                          id={`product-${product.slug}`}
                          name="products"
                          value={product.slug}
                        />
                        <FieldContent>
                          <FieldTitle>{product.name}</FieldTitle>
                          <FieldDescription>
                            {product.tagline}
                          </FieldDescription>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </div>
              </FieldSet>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tell us about your project
                </label>
                <p className="text-xs text-muted-foreground">
                  Describe your use case, what you&apos;re building, and why
                  early access matters to you.
                </p>
                <TipTapEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="I'm building a WordPress plugin that…"
                />
                <input type="hidden" name="description" value={description} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              No spam, ever. We&apos;ll only email you about your beta request.
            </p>
            <SubmitButton />
          </div>
        </form>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Zap className="size-4 text-brand" />
            What you get
          </h3>
          <ul className="mt-3 space-y-2.5">
            {[
              "Early access to new products and features",
              "Direct line to the engineering team",
              "Shape product roadmaps with your feedback",
              "Private GitHub repository access",
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
            <MessageSquare className="size-4 text-brand" />
            How it works
          </h3>
          <ol className="mt-3 space-y-2.5">
            {[
              "Submit your request with details about your project",
              "Our team reviews your application (≈48h)",
              "Get approved and receive your invite",
              "Start testing and sharing feedback",
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

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <GitFork className="size-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Open Source
              </p>
              <p className="text-xs text-muted-foreground">
                All our products are MIT-licensed on GitHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
