import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { Mail, MessageSquare, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the BePlus Labs team. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright">
            <Mail className="h-5 w-5" />
          </div>
          <p className="meta-label mt-4">Contact</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Have a question, suggestion, or just want to say hi? We&apos;d love to
            hear from you.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="space-y-4">
            {[
              {
                icon: MessageSquare,
                title: "Response Time",
                desc: "We typically respond within 24 hours on business days.",
              },
              {
                icon: Mail,
                title: "Email",
                desc: "Prefer to write directly? Reach us at hello@bepluslabs.com.",
              },
              {
                icon: Clock,
                title: "Availability",
                desc: "Mon–Fri, 9:00 AM – 6:00 PM EST.",
              },
            ].map((item) => (
              <div key={item.title} className="card-dia p-4">
                <item.icon className="h-4 w-4 text-brand" />
                <h3 className="mt-2 font-mono text-xs font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
