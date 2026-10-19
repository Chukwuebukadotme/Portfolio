import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * C03. Primary is a cobalt fill, secondary an outlined surface, text a bare
 * cobalt label. Every size keeps a 44px activation area; the small size draws
 * 36px and extends its hit area invisibly. Hover only applies where hover
 * exists (Tailwind v4 gates it on `(hover: hover)`), and focus uses the global
 * 2px/3px ring rather than a component-specific one.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control border border-transparent cl-type-ui",
    "transition-colors duration-(--cl-motion-duration-micro) ease-standard",
    "disabled:cursor-not-allowed disabled:border-border disabled:bg-bg-subtle disabled:text-text-muted",
    "aria-busy:cursor-progress",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-brand-on hover:bg-brand-hover active:bg-brand-active",
        secondary:
          "border-border-control bg-bg-surface text-text-primary hover:bg-bg-subtle active:bg-brand-soft",
        text: "px-0! text-brand hover:text-brand-hover active:text-brand-active",
      },
      size: {
        sm: "min-h-9 px-3 py-2 after:absolute after:-inset-y-1 after:inset-x-0",
        default: "min-h-11 px-4 py-3",
        lg: "min-h-12 px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
