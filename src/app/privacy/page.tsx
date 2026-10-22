import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Icon } from "@/components/site/icon";
import { Container, Eyebrow } from "@/components/site/primitives";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the contact form on this site handles what you send.",
};

const link = "text-brand underline underline-offset-2 hover:text-brand-hover";

/**
 * States only what the site's code and hosting actually do: the form's fields,
 * delivery through Resend, forwarding by ImprovMX, replies through Brevo, the
 * sender's copy, no database, no cookies or analytics, self-hosted fonts and
 * hosting on Vercel. It names no
 * retention period, because none has been set.
 */
export default function PrivacyPage() {
  return (
    <section aria-labelledby="privacy-title" className="cl-page pb-(--cl-section-space)">
      <Container>
        <Eyebrow>Privacy</Eyebrow>
        <h1 id="privacy-title" className="mt-3 cl-type-page text-text-primary">
          How your details are handled
        </h1>
        <p className="mt-4 cl-type-caption text-text-secondary">Last updated 22 October 2026</p>

        <div className="mt-10 flex max-w-measure flex-col gap-8 cl-type-body text-text-secondary">
          <div>
            <h2 className="cl-type-subheading text-text-primary">What the contact form collects</h2>
            <p className="mt-3">
              Your name, email address, enquiry type and message, and, if you
              give them, your company, timeline and budget. Nothing else is
              collected through the form.
            </p>
          </div>

          <div>
            <h2 className="cl-type-subheading text-text-primary">What happens when you send it</h2>
            <p className="mt-3">
              The form sends your message by email to {site.contactEmail},
              using{" "}
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className={link}>
                Resend<span className="sr-only"> privacy policy (opens in a new tab)</span>
              </a>
              , an email delivery service. Mail to that address is forwarded
              to {site.name}’s inbox by{" "}
              <a href="https://improvmx.com/privacy/" target="_blank" rel="noopener noreferrer" className={link}>
                ImprovMX<span className="sr-only"> privacy policy (opens in a new tab)</span>
              </a>
              , and replies are sent through{" "}
              <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer" className={link}>
                Brevo<span className="sr-only"> privacy policy (opens in a new tab)</span>
              </a>
              . A copy is emailed to the address you entered so you have a
              record of what you sent. This site has no database: messages are
              not stored on the website itself.
            </p>
          </div>

          <div>
            <h2 className="cl-type-subheading text-text-primary">Cookies, analytics and fonts</h2>
            <p className="mt-3">
              The site sets no cookies and runs no analytics or advertising
              scripts. Fonts are served from this site, not from a third
              party. It is hosted on Vercel, which processes standard request
              information, such as your IP address, to deliver pages.
            </p>
          </div>

          <div>
            <h2 className="cl-type-subheading text-text-primary">Questions and deletion</h2>
            <p className="mt-3">
              To ask about a message you sent, or to ask for it to be deleted,
              email{" "}
              <a href={`mailto:${site.contactEmail}`} className={link}>
                {site.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>

        <Link
          href="/contact"
          className="mt-10 inline-flex min-h-11 items-center gap-2 cl-type-ui text-brand no-underline hover:text-brand-hover"
        >
          <Icon icon={ArrowLeft} />
          Back to contact
        </Link>
      </Container>
    </section>
  );
}
