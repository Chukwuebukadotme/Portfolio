"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";

/**
 * C17. A Copy email button for an address shown beside it as an ordinary
 * mailto link (the element with `addressId`). Success shows "Copied" for about
 * two seconds and is announced once, without moving focus. If the clipboard
 * refuses, that address is selected for manual copying and nothing claims
 * success.
 */
export function CopyEmailButton({ email, addressId }: { email: string; addressId: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
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
      const node = document.getElementById(addressId);
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
    <span className="inline-flex flex-col items-start gap-1">
      <Button type="button" variant="secondary" size="sm" onClick={copy} className="min-w-32">
        <Icon icon={state === "copied" ? Check : Copy} size={16} />
        {state === "copied" ? "Copied" : "Copy email"}
      </Button>
      {state === "failed" ? (
        <span className="cl-type-caption text-status-error">
          Copying didn’t work here. The address is selected, so you can copy it yourself.
        </span>
      ) : null}
      <span role="status" className="sr-only">
        {state === "copied" ? "Email address copied" : ""}
      </span>
    </span>
  );
}
