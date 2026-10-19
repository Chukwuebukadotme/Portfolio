"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, TriangleAlert } from "lucide-react";

import { submitContact } from "@/app/contact/actions";
import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";
import { fieldClass, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { enquiryOptions, site } from "@/lib/content";
import type { ContactInput, ContactState } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

/** C16: the button keeps its width while sending and blocks a second send. */
function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" size="lg" disabled={pending} aria-busy={pending} className="min-w-40">
      {pending ? "Sending…" : "Send enquiry"}
    </Button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 cl-type-caption text-status-error">
      <Icon icon={TriangleAlert} size={16} className="mt-0.5" />
      {message}
    </p>
  );
}

const labels: Partial<Record<keyof ContactInput, string>> = {
  name: "Name",
  email: "Email",
  type: "Enquiry type",
  message: "Message",
};

/**
 * C14–C16. Visible labels with required and optional marked in words, a
 * native select, errors tied to their fields and summarised at the top, and a
 * send that reports success only after the delivery service accepts it.
 *
 * With scripts, submission is dispatched from onSubmit rather than through the
 * form's action, which skips React's automatic reset: a failed send leaves
 * every field, the select included, exactly as it was. Without scripts the
 * form posts normally, and each field takes the submitted value the action
 * returns as its default, so nothing is lost there either.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const [type, setType] = useState("");
  const uid = useId();
  const summaryRef = useRef<HTMLDivElement>(null);

  const err = state.errors ?? {};
  const v = state.values ?? {};
  const field = (name: string) => `${uid}-${name}`;
  const described = (name: keyof ContactInput, help?: string) =>
    [help, err[name] ? field(`${name}-error`) : null].filter(Boolean).join(" ") || undefined;

  // Keep the conditional fields in step with a restored selection.
  useEffect(() => {
    if (state.values?.type !== undefined) setType(state.values.type);
  }, [state.values]);

  // Move focus to the summary once, so its list of problems is read first.
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-card border border-status-success bg-status-success-bg p-6 md:p-8">
        <p className="cl-type-subheading text-text-primary">Message sent</p>
        <p className="mt-2 cl-type-body text-text-primary">{state.message}</p>
      </div>
    );
  }

  const fieldErrors = Object.entries(err).filter(([k]) => k in labels) as [keyof ContactInput, string][];

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="flex flex-col gap-6"
      noValidate
    >
      {state.status === "error" ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-card border border-status-error bg-status-error-bg p-5"
        >
          <p className="cl-type-ui text-status-error">{state.message}</p>
          {fieldErrors.length ? (
            <ul className="mt-2 flex flex-col gap-1">
              {fieldErrors.map(([k, m]) => (
                <li key={k} className="cl-type-caption">
                  <a href={`#${field(k)}`} className="text-status-error underline underline-offset-2">
                    {labels[k]}: {m}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 cl-type-caption text-text-primary">
              <a href={`mailto:${site.contactEmail}`} className="text-brand underline underline-offset-2">
                Email {site.contactEmail}
              </a>
            </p>
          )}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={field("name")}>Name (required)</Label>
          <Input
            id={field("name")}
            name="name"
            autoComplete="name"
            required
            defaultValue={v.name}
            aria-invalid={Boolean(err.name)}
            aria-describedby={described("name")}
          />
          <FieldError id={field("name-error")} message={err.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={field("email")}>Email (required)</Label>
          <Input
            id={field("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={v.email}
            aria-invalid={Boolean(err.email)}
            aria-describedby={described("email", field("email-help"))}
          />
          <p id={field("email-help")} className="cl-type-caption text-text-secondary">
            Use the address where you would like a reply.
          </p>
          <FieldError id={field("email-error")} message={err.email} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={field("company")}>Company or organisation (optional)</Label>
        <Input id={field("company")} name="company" autoComplete="organization" defaultValue={v.company} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={field("type")}>Enquiry type (required)</Label>
        <div className="relative">
          <select
            id={field("type")}
            name="type"
            required
            defaultValue={v.type ?? ""}
            onChange={(e) => setType(e.target.value)}
            aria-invalid={Boolean(err.type)}
            aria-describedby={described("type")}
            className={cn(fieldClass, "min-h-11 appearance-none pr-10")}
          >
            <option value="" disabled>
              Choose one
            </option>
            {enquiryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Icon
            icon={ChevronDown}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
        </div>
        <FieldError id={field("type-error")} message={err.type} />
      </div>

      {/* Project enquiries carry scope; hiring enquiries do not. */}
      {type === "Product collaboration" ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={field("timeline")}>Timeline (optional)</Label>
            <Input id={field("timeline")} name="timeline" defaultValue={v.timeline} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={field("budget")}>Budget (optional)</Label>
            <Input id={field("budget")} name="budget" defaultValue={v.budget} />
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor={field("message")}>Message (required)</Label>
        <Textarea
          id={field("message")}
          name="message"
          rows={6}
          required
          defaultValue={v.message}
          aria-invalid={Boolean(err.message)}
          aria-describedby={described("message")}
        />
        <FieldError id={field("message-error")} message={err.message} />
      </div>

      {/* Honeypot: hidden from people and assistive technology alike. */}
      <div aria-hidden className="hidden">
        <label htmlFor={field("website")}>Leave this empty</label>
        <input id={field("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <SubmitButton pending={pending} />
        <p className="cl-type-caption text-text-secondary">
          Your message is emailed to me and is not stored on this site.{" "}
          <Link href="/privacy" className="text-brand underline underline-offset-2 hover:text-brand-hover">
            How your details are handled
          </Link>
        </p>
      </div>
    </form>
  );
}
