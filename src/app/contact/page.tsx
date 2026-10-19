import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { CopyEmailButton } from "@/components/site/copy-email";
import { Icon } from "@/components/site/icon";
import { Container, Eyebrow } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/content";
import { resumeMeta } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to permanent roles across the UK in design engineering, product engineering and AI engineering, and to selected product collaborations.",
};

const external = [
  { label: "LinkedIn", href: site.linkedin, text: "Profile" },
  { label: "GitHub", href: site.github, text: "Chukwuebukadotme" },
] as const;

const rowLink =
  "inline-flex min-h-11 items-center gap-1.5 cl-type-body text-brand underline decoration-1 underline-offset-4 hover:text-brand-hover";

/**
 * Contact: every direct contact in one list, with copy on the email row; then
 * the hiring and project routes beside the enquiry form, so choosing a route
 * and writing happen in one view. Email, résumé and LinkedIn all come before
 * the form, and the routes precede it in reading order on every screen.
 */
export default function ContactPage() {
  const resume = resumeMeta();

  return (
    <>
      <section aria-labelledby="contact-title" className="cl-page">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 id="contact-title" className="mt-3 cl-type-page text-text-primary">
            Let’s talk.
          </h1>
          <p className="mt-4 max-w-measure cl-type-lead text-text-secondary">
            {site.availability}. The quickest way to reach me is email.
          </p>

          <dl className="mt-8 max-w-[44rem] border-t border-border">
            <div className="grid gap-x-6 border-b border-border py-3 sm:grid-cols-[8rem_1fr] sm:items-center">
              <dt className="cl-type-ui text-text-secondary">Email</dt>
              <dd className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <a id="contact-email" href={`mailto:${site.contactEmail}`} className={`${rowLink} break-all`}>
                  {site.contactEmail}
                </a>
                <CopyEmailButton email={site.contactEmail} addressId="contact-email" />
              </dd>
            </div>
            {external.map((l) => (
              <div
                key={l.label}
                className="grid gap-x-6 border-b border-border py-3 sm:grid-cols-[8rem_1fr] sm:items-center"
              >
                <dt className="cl-type-ui text-text-secondary">{l.label}</dt>
                <dd>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={rowLink}>
                    {l.text}
                    <Icon icon={ArrowUpRight} size={16} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="enquiry" aria-labelledby="enquiry-title" className="cl-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--cl-grid-gap)">
          <aside aria-label="Ways to get in touch" className="flex flex-col gap-6 lg:col-span-4">
            <div className="rounded-card border border-border bg-bg-surface p-6">
              <h2 className="cl-type-subheading text-text-primary">Hiring</h2>
              <p className="mt-3 cl-type-body text-text-secondary">
                Building a product, design engineering or AI team? I’m open to
                permanent roles across the UK.
              </p>
              <Button asChild variant="secondary" className="mt-5">
                <a href={site.resume} target="_blank" rel="noopener">
                  Résumé
                  <span className="cl-type-caption text-text-secondary">{resume}</span>
                  <span className="sr-only">, opens in a new tab</span>
                </a>
              </Button>
            </div>

            <div className="rounded-card border border-border bg-bg-surface p-6">
              <h2 className="cl-type-subheading text-text-primary">Product collaborations</h2>
              <p className="mt-3 cl-type-body text-text-secondary">
                Have a product, website or intelligent system in mind? Book a
                call, or send the details with the form.
              </p>
              <Button asChild variant="secondary" className="mt-5">
                <a href={site.calcom} target="_blank" rel="noopener noreferrer">
                  Book a call
                  <Icon icon={ArrowUpRight} size={16} />
                  <span className="sr-only">on Cal.com (opens in a new tab)</span>
                </a>
              </Button>
            </div>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <h2 id="enquiry-title" className="cl-type-section text-text-primary">
              Send an enquiry
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
