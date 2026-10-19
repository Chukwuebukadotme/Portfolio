import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The one functional icon family: Lucide on its 24-unit grid at the nominal
 * 1.75 stroke, scaled whole. 16px for metadata, 20px in controls, 24px for
 * standalone actions. Icons sit beside a label, so they are always hidden
 * from assistive technology; an icon-only control names itself.
 */
export function Icon({
  icon: Glyph,
  size = 20,
  className,
}: {
  icon: LucideIcon;
  size?: 16 | 20 | 24;
  className?: string;
}) {
  return (
    <Glyph
      aria-hidden
      focusable={false}
      size={size}
      strokeWidth={1.75}
      className={cn("shrink-0", className)}
    />
  );
}
