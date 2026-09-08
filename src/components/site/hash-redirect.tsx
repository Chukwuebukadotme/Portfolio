"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The previous site routed on the hash (#/work/budgetview). Those links are
 * already in the wild — CVs, messages, bookmarks — so any hash that looks like
 * a route is translated once, on arrival, into the real path.
 */
export function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#/")) return;

    const path = hash.slice(1);
    // Only follow paths this site actually serves.
    if (!/^\/(work(\/[a-z0-9-]+)?|about|contact)?$/.test(path)) return;

    router.replace(path === "/" ? "/" : path);
  }, [router]);

  return null;
}
