import { site } from "@/lib/content";
import type { ContactInput } from "@/lib/contact-schema";

/**
 * Email bodies for the contact form.
 *
 * Kept apart from the action so the wording can be edited without touching
 * delivery. Both mails ship a plain-text part as well as HTML, because a
 * text/plain alternative measurably helps deliverability and some clients
 * still prefer it.
 */

const esc = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Wraps a body in the minimal shell that renders consistently across clients. */
function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A0F14;">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e3e9ee;border-radius:10px;padding:28px;">
${inner}
<p style="margin:28px 0 0;padding-top:18px;border-top:1px solid #e3e9ee;font-size:12px;color:#66798a;">
Chukwuebuka Onyemelukwe · Design Engineer × AI Engineer · ${site.location}
</p>
</div></body></html>`;
}

function details(input: ContactInput) {
  const rows: [string, string][] = [
    ["Name", input.name],
    ["Email", input.email],
  ];
  if (input.company) rows.push(["Company", input.company]);
  rows.push(["Enquiry type", input.type]);
  if (input.timeline) rows.push(["Timeline", input.timeline]);
  if (input.budget) rows.push(["Budget", input.budget]);
  return rows;
}

/** What lands in Chukwuebuka's inbox. */
export function notification(input: ContactInput) {
  const rows = details(input);

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    input.message,
  ].join("\n");

  const html = shell(
    `<p style="margin:0 0 18px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#66798a;">New enquiry</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 0;color:#66798a;width:130px;vertical-align:top;">${esc(k)}</td><td style="padding:6px 0;">${esc(v)}</td></tr>`,
  )
  .join("")}
</table>
<p style="margin:22px 0 6px;color:#66798a;font-size:14px;">Message</p>
<p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${esc(input.message)}</p>`,
  );

  return { subject: `${input.type}: ${input.name}`, text, html };
}

/** What the sender receives, so they have a record of what they submitted. */
export function confirmation(input: ContactInput) {
  const rows = details(input).filter(([k]) => k !== "Email");

  const text = [
    `Hi ${input.name},`,
    "",
    "Thanks for getting in touch. Your message has reached me and I'll come back to you shortly.",
    "",
    "Here is a copy for your records:",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    input.message,
    "",
    "Chukwuebuka Onyemelukwe",
    site.email,
  ].join("\n");

  const html = shell(
    `<p style="margin:0 0 16px;font-size:16px;">Hi ${esc(input.name)},</p>
<p style="margin:0 0 22px;font-size:15px;line-height:1.6;">Thanks for getting in touch. Your message has reached me and I&rsquo;ll come back to you shortly.</p>
<p style="margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#66798a;">A copy for your records</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 0;color:#66798a;width:130px;vertical-align:top;">${esc(k)}</td><td style="padding:6px 0;">${esc(v)}</td></tr>`,
  )
  .join("")}
</table>
<p style="margin:22px 0 6px;color:#66798a;font-size:14px;">Message</p>
<p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${esc(input.message)}</p>`,
  );

  return {
    subject: "Thanks for getting in touch",
    text,
    html,
  };
}
