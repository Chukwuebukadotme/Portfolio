import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * C14. A 44px field with a control-contrast border, 16px text so mobile
 * browsers do not zoom, and an error state that changes the border alongside
 * the message rather than relying on colour alone.
 */
export const fieldClass = cn(
  "w-full min-w-0 rounded-field border border-border-control bg-bg-surface px-3 py-2.5 text-[1rem] leading-normal text-text-primary",
  "transition-colors duration-(--cl-motion-duration-micro) ease-standard",
  "placeholder:text-text-muted",
  "disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-text-muted",
  "aria-invalid:border-status-error",
);

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldClass, "min-h-11", className)}
      {...props}
    />
  );
}

export { Input };
