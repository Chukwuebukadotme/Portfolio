"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";

/**
 * C17. The address stays visible as an ordinary mailto link, with a separate
 * Copy email button beside it. Success shows "Copied" for about two seconds
 * and is announced once, without moving focus. If the clipboard refuses, the
 * address is selected for manual copying and nothing claims success.
 */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const addressRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("failed");
      const node = addressRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          ref={addressRef}
          href={`mailto:${email}`}
          className="inline-flex min-h-11 items-center gap-2 break-all cl-type-lead text-brand underline decoration-1 underline-offset-4 hover:text-brand-hover"
        >
          <Icon icon={Mail} />
          {email}
        </a>
        <Button type="button" variant="secondary" size="sm" onClick={copy} className="min-w-32">
          <Icon icon={state === "copied" ? Check : Copy} size={16} />
          {state === "copied" ? "Copied" : "Copy email"}
        </Button>
      </div>
      {state === "failed" ? (
        <p className="mt-2 cl-type-caption text-status-error">
          Copying didn’t work here. The address is selected, so you can copy it yourself.
        </p>
      ) : null}
      <span role="status" className="sr-only">
        {state === "copied" ? "Email address copied" : ""}
      </span>
    </div>
  );
}
