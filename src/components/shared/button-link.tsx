import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonLinkProps
  extends VariantProps<typeof buttonVariants>,
    Omit<ComponentProps<typeof Link>, "className"> {
  className?: string;
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Link>
  );
}
