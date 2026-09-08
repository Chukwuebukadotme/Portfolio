"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { enquiryOptions } from "@/lib/content";
import type { ContactState } from "@/lib/contact-schema";

const initial: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send"}
    </Button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-small text-[var(--text-danger)]">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initial);
  const [type, setType] = useState<string>("");
  const uid = useId();

  const err = state.errors ?? {};
  const field = (name: string) => `${uid}-${name}`;

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border border-border-accent bg-surface-raised p-8"
      >
        <p className="ds-eyebrow text-text-accent">Sent</p>
        <p className="mt-3 text-large text-text-primary">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="border border-[var(--text-danger)] px-4 py-3 text-small text-[var(--text-danger)]"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor={field("name")}>Name</Label>
          <Input
            id={field("name")}
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(err.name)}
            aria-describedby={err.name ? field("name-error") : undefined}
          />
          <FieldError id={field("name-error")} message={err.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={field("email")}>Email</Label>
          <Input
            id={field("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(err.email)}
            aria-describedby={err.email ? field("email-error") : undefined}
          />
          <FieldError id={field("email-error")} message={err.email} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={field("company")}>Company / organisation</Label>
        <Input
          id={field("company")}
          name="company"
          autoComplete="organization"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={field("type")}>Enquiry type</Label>
        {/* Radix writes to a hidden input, so the action still reads it. */}
        <Select name="type" value={type} onValueChange={setType} required>
          <SelectTrigger
            id={field("type")}
            aria-invalid={Boolean(err.type)}
            className="w-full"
          >
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {enquiryOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError id={field("type-error")} message={err.type} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={field("message")}>Message</Label>
        <Textarea
          id={field("message")}
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(err.message)}
          aria-describedby={err.message ? field("message-error") : undefined}
        />
        <FieldError id={field("message-error")} message={err.message} />
      </div>

      {/* Project enquiries carry scope; hiring enquiries do not. */}
      {type && type !== "Hiring / Career Opportunity" ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={field("timeline")}>Timeline</Label>
            <Input id={field("timeline")} name="timeline" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={field("budget")}>Budget</Label>
            <Input id={field("budget")} name="budget" />
          </div>
        </div>
      ) : null}

      {/* Honeypot — visually and programmatically hidden from people. */}
      <div aria-hidden className="hidden">
        <label htmlFor={field("website")}>Leave this empty</label>
        <input
          id={field("website")}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
