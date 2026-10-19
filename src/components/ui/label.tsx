import * as React from "react";

import { cn } from "@/lib/utils";

/** A persistent, visible label. Fields never rely on a placeholder instead. */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn("cl-type-ui text-text-primary", className)}
      {...props}
    />
  );
}

export { Label };
