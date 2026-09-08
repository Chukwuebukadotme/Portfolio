import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales. The design system's type
 * scale (text-h1 … text-tiny) is not a t-shirt size, so out of the box it was
 * classified as a *colour* and silently dropped whenever a size and a colour
 * were combined — `cn("text-h3", "text-text-primary")` returned only the
 * colour. Declaring the scale here keeps size and colour in separate groups.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
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
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
