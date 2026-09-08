"use server";

import { site } from "@/lib/content";
import {
  contactSchema,
  type ContactInput,
  type ContactState,
} from "@/lib/contact-schema";

/**
 * Delivery.
 *
 * This is the only thing standing between the form and a real inbox. Add a
 * provider key and send from here; everything upstream — validation, honeypot,
 * error surfacing, the success state — is already wired.
 *
 * With Resend, that is:
 *
 *   const { Resend } = await import("resend");
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({
 *     from: "Portfolio <enquiries@your-verified-domain.com>",
 *     to: site.email,
 *     replyTo: input.email,
 *     subject: `${input.type} — ${input.name}`,
 *     text: body,
 *   });
 *
 * npm i resend, set RESEND_API_KEY in the Vercel project, and verify the
 * sending domain. Until then the enquiry is logged so nothing is silently lost.
 */
async function deliver(input: ContactInput): Promise<void> {
  const body = [
    `From:     ${input.name} <${input.email}>`,
    input.company ? `Company:  ${input.company}` : null,
    `Type:     ${input.type}`,
    input.timeline ? `Timeline: ${input.timeline}` : null,
    input.budget ? `Budget:   ${input.budget}` : null,
    "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!process.env.RESEND_API_KEY) {
    // TODO — remove once a provider is configured.
    console.info(`[contact] enquiry for ${site.email}\n${body}`);
    return;
  }

  throw new Error(
    "RESEND_API_KEY is set but no provider is wired. Complete deliver() in src/app/contact/actions.ts.",
  );
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    type: formData.get("type"),
    message: formData.get("message"),
    timeline: formData.get("timeline"),
    budget: formData.get("budget"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
    };
  }

  // A filled honeypot is a bot. Answer as though it worked; do not deliver.
  if (parsed.data.website) {
    return { status: "success", message: "Thanks — message received." };
  }

  try {
    await deliver(parsed.data);
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return {
      status: "error",
      message: `Something went wrong sending that. Email ${site.email} directly and it will reach me.`,
    };
  }

  return {
    status: "success",
    message: "Thanks — message received. I’ll come back to you shortly.",
  };
}
