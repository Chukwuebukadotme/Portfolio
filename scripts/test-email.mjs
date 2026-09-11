/**
 * One-off check that a Resend API key works.
 *
 * This is the quickstart snippet turned into something safe to keep in a
 * public repository: the key is read from the environment rather than written
 * into the file, so it is never committed.
 *
 *   npm run test:email
 *
 * Before a domain is verified, Resend only accepts `onboarding@resend.dev` as
 * the sender and only delivers to the address that owns the account. That is a
 * free-tier restriction rather than a misconfiguration, so this script defaults
 * to exactly that pair.
 */
import { readFileSync, existsSync } from "node:fs";
import { Resend } from "resend";

// Load .env.local without adding a dependency just for this.
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error(
    "RESEND_API_KEY is not set.\n" +
      "Copy .env.example to .env.local and put your key in it, then run this again.",
  );
  process.exit(1);
}

const to = process.env.CONTACT_TO ?? "chukwuebukaspad@gmail.com";
const from = process.env.TEST_FROM ?? "onboarding@resend.dev";

console.log(`Sending a test message from ${from} to ${to} ...`);

const resend = new Resend(key);
const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "Resend is wired up correctly",
  html:
    "<p>If this arrived, the API key works and the portfolio contact form can send mail.</p>" +
    "<p>Next step is verifying your domain so mail can go to visitors too, not just to you.</p>",
});

if (error) {
  console.error("Resend rejected the send:\n", error);
  process.exit(1);
}

console.log(`Sent. Message id: ${data?.id}`);
console.log("Check the inbox, and the Resend dashboard under Emails.");
