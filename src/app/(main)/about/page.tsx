import type { Metadata } from "next";
import { ArrowRight, Blocks, GitPullRequest, Globe, Shield, ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TEAM = [
  { name: "Mike Tropi", role: "Founder & Lead Developer", initials: "MT", github: "miketropi" },
  { name: "Duc Dung", role: "WordPress Engineer", initials: "DD", github: "ducdung196qtr" },
  { name: "Tom Dev", role: "WordPress Developer", initials: "TD", github: "tomdevvn90" },
];

const VALUES = [
  {
    icon: Blocks,
    title: "WordPress-Native",
    desc: "We build for the block editor first. Full-site editing, theme.json, and native Gutenberg APIs — no page builder hacks.",
  },
  {
    icon: Shield,
    title: "Quality by Default",
    desc: "Every repo ships with TypeScript, PHPStan, PHPUnit, and CI pipelines. Quality gates run on every commit and PR.",
  },
  {
    icon: GitPullRequest,
    title: "Open Source First",
    desc: "All our code is public on GitHub. We welcome contributions, review PRs, and build in the open alongside the community.",
  },
  {
    icon: Globe,
    title: "Modern Stack",
    desc: "Tailwind CSS v4, esbuild, Composer, and Node.js tooling — the same workflows professional teams use every day.",
  },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about BePlus Labs — our mission, team, and the values that drive us to build better WordPress tools.",
};

export default function AboutPage() {
  return (
    <div className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          About BePlus Labs
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          We&apos;re a small team of WordPress developers who believe the ecosystem
          deserves better tooling. Our mission is to build open-source themes,
          plugins, and developer tools that bring modern engineering practices to
          WordPress.
        </p>

        <p className="mt-4 text-muted-foreground">
          BePlus Labs started in 2025 with Nextora — a block theme that treats
          development like professional software engineering. TypeScript instead
          of vanilla JS, PHPStan instead of guesswork, proper CI/CD instead of
          FTP. Today we maintain four open-source projects used by agencies and
          freelancers building WordPress sites every day.
        </p>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-foreground">
            What We Believe
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-lg border p-5">
                <value.icon className="h-6 w-6 text-brand" />
                <h3 className="mt-3 font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-foreground">The Team</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {TEAM.map((member) => (
              <li
                key={member.name}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-brand-muted text-brand-foreground dark:bg-brand-bright/10 dark:text-brand-bright text-sm">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                  {member.github && (
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand"
                    >
                      @{member.github} <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-brand-bright/30 bg-brand-muted p-8 text-center dark:bg-brand-bright/5">
          <h2 className="text-xl font-semibold text-brand-foreground dark:text-brand-bright">
            Want to contribute?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            All our projects are open-source on GitHub. Open an issue, submit a
            PR, or just star the repos — every bit of support helps.
          </p>
          <div className="mt-6">
            <ButtonLink
              size="lg"
              href="/feedback"
              className="h-12 bg-brand-bright px-8 text-sm font-semibold text-brand-foreground hover:bg-brand-bright/90"
            >
              Send Feedback <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
