"use server";

import { site } from "@/lib/content";
import { confirmation, notification } from "@/app/contact/emails";
import {
  contactSchema,
  type ContactInput,
  type ContactState,
} from "@/lib/contact-schema";

/**
 * Delivery.
 *
 * Two mails go out per submission: the enquiry to the inbox, and a
 * confirmation to whoever sent it so they have a record of what they wrote.
 *
 * The two are not equal in importance. If the notification fails, the enquiry
 * would be lost, so that failure is surfaced and the person is asked to email
 * directly. If only the confirmation fails, the enquiry is safely delivered, so
 * it is logged and the submission still reports success rather than telling
 * someone their message did not arrive when it did.
 *
 * With no API key configured the enquiry is logged instead, which keeps local
 * development working without credentials.
 */
async function deliver(input: ContactInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  const from =
    process.env.CONTACT_FROM ??
    "Chukwuebuka Onyemelukwe <hello@chukwuebukaonyemelukwe.com>";
  const to = process.env.CONTACT_TO ?? site.email;

  const note = notification(input);

  if (!key) {
    console.info(
      `[contact] no RESEND_API_KEY set; enquiry for ${to}\n${note.text}`,
    );
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(key);

  // The enquiry itself. replyTo means replying in the inbox goes to the sender.
  const sent = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: note.subject,
    text: note.text,
    html: note.html,
  });

  if (sent.error) {
    throw new Error(`Resend rejected the notification: ${sent.error.message}`);
  }

  // The receipt. Best effort: the enquiry is already safely delivered.
  try {
    const ack = confirmation(input);
    const reply = await resend.emails.send({
      from,
      to: input.email,
      replyTo: site.email,
      subject: ack.subject,
      text: ack.text,
      html: ack.html,
    });
    if (reply.error) {
      console.error("[contact] confirmation failed", reply.error);
    }
  } catch (error) {
    console.error("[contact] confirmation threw", error);
  }
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
    return { status: "success", message: "Thanks, message received." };
  }

  try {
    await deliver(parsed.data);
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return {
      status: "error",
      message: `Something went wrong sending that. Email ${site.contactEmail} directly and it will reach me.`,
    };
  }

  return {
    status: "success",
    message: "Thanks, message received. I’ll come back to you shortly.",
  };
}
