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
 *
 * Resolves to whether the sender's copy went out, so the success message only
 * mentions a copy that was actually sent.
 */
async function deliver(input: ContactInput): Promise<boolean> {
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
    return false;
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
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] confirmation threw", error);
    return false;
  }
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // A field the form did not render (timeline and budget appear only for
  // product collaborations) is absent, and absent means empty, not invalid.
  const get = (name: keyof ContactInput) => formData.get(name) ?? undefined;
  const submitted = {
    name: get("name"),
    email: get("email"),
    company: get("company"),
    type: get("type"),
    message: get("message"),
    timeline: get("timeline"),
    budget: get("budget"),
    website: get("website"),
  };
  const parsed = contactSchema.safeParse(submitted);

  // Echoed back on any failure so the form can restore every field.
  const values = Object.fromEntries(
    Object.entries(submitted).map(([k, v]) => [k, typeof v === "string" ? v : ""]),
  ) as ContactState["values"];

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Some fields need attention before this can be sent.",
      errors,
      values,
    };
  }

  // A filled honeypot is a bot. Answer as though it worked; do not deliver.
  if (parsed.data.website) {
    return { status: "success", message: "Your message has been sent." };
  }

  let copied: boolean;
  try {
    copied = await deliver(parsed.data);
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return {
      status: "error",
      message: `That message didn’t send. Everything you wrote is still here, so you can try again, or email ${site.contactEmail} directly.`,
      values,
    };
  }

  // C16: success is reported only once the delivery service has accepted the
  // message, and says no more than that.
  return {
    status: "success",
    message: copied
      ? `Your message has been sent. A copy is on its way to ${parsed.data.email}.`
      : "Your message has been sent.",
  };
}
