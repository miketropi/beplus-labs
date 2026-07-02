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
    <div className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Share Your Feedback
          </h1>
          <p className="mt-4 text-muted-foreground">
            Found a bug? Have an idea? We want to hear it. Every piece of
            feedback helps us build better open-source WordPress tools.
          </p>
        </div>

        <FeedbackForm products={products} />
      </div>
    </div>
  );
}
