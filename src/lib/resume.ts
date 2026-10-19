import { statSync } from "node:fs";
import { join } from "node:path";

import { site } from "@/lib/content";

/**
 * The résumé link's file type and size, e.g. "PDF, 101 KB". Read from the file
 * at build time, so replacing the PDF can never leave a stale size on the page.
 * Server only: it reads the filesystem.
 */
export function resumeMeta(): string {
  const bytes = statSync(join(process.cwd(), "public", site.resume)).size;
  return `PDF, ${Math.max(1, Math.round(bytes / 1024))} KB`;
}
