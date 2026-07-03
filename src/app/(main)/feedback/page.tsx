import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { FeedbackForm } from "./feedback-form";
import { getAllProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share your feedback with BePlus Labs. Report bugs, suggest features, or tell us how we can improve our WordPress products.",
};

export default async function FeedbackPage() {
  const products = await getAllProducts();

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="meta-label mt-4">Feedback</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Share Your Feedback
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Found a bug? Have an idea? We want to hear it. Every piece of
            feedback helps us build better open-source WordPress tools.
          </p>
        </div>

        <FeedbackForm products={products} />
      </div>
    </div>
  );
}
