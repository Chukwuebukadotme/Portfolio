import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock utilities. Cobalt Light's type
 * roles (cl-type-display … cl-type-code) are custom utilities, so they are
 * declared as one group: a later role replaces an earlier one, and a role
 * replaces any separate size, leading, weight or tracking set before it.
 *
 * The h1 … tiny scale belongs to the transitional bridge and goes with it.
 */
const twMerge = extendTailwindMerge<"cl-type">({
  extend: {
    classGroups: {
      "cl-type": [
        {
          "cl-type": [
            "display",
            "page",
            "section",
            "project",
            "subheading",
            "lead",
            "body",
            "ui",
            "caption",
            "eyebrow",
            "code",
          ],
        },
      ],
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "large",
            "medium",
            "regular",
            "small",
            "tiny",
          ],
        },
      ],
    },
    conflictingClassGroups: {
      "cl-type": ["font-size", "leading", "font-weight", "tracking", "font-family"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
