import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="text-center">
        <p className="text-8xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <ButtonLink href="/" className="bg-brand-bright text-brand-foreground hover:bg-brand-bright/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
