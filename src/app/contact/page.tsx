import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { CopyEmail } from "@/components/site/copy-email";
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
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.github, label: "GitHub" },
  { href: site.calcom, label: "Book a call on Cal.com" },
] as const;

/**
 * Contact: hiring and project routes kept apart, the direct address, résumé
 * and LinkedIn before the form, then the enquiry form with a short, truthful
 * note on how a message is handled.
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

          <div className="mt-8">
            <CopyEmail email={site.contactEmail} />
          </div>
        </Container>
      </section>

      <section aria-label="Ways to get in touch" className="pt-12 md:pt-16">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-card border border-border bg-bg-surface p-6 md:p-8">
            <h2 className="cl-type-subheading text-text-primary">Hiring</h2>
            <p className="mt-3 cl-type-body text-text-secondary">
              Building a product, design engineering or AI team? I’m open to
              permanent roles across the UK.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-auto md:pt-6">
              <Button asChild variant="secondary">
                <a href={site.resume} target="_blank" rel="noopener">
                  Résumé
                  <span className="cl-type-caption text-text-secondary">{resume}</span>
                  <span className="sr-only">, opens in a new tab</span>
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                  <Icon icon={ArrowUpRight} size={16} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col rounded-card border border-border bg-bg-surface p-6 md:p-8">
            <h2 className="cl-type-subheading text-text-primary">Product collaborations</h2>
            <p className="mt-3 cl-type-body text-text-secondary">
              Have a product, website or intelligent system in mind? Book a
              call, or send the details below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-auto md:pt-6">
              <Button asChild variant="secondary">
                <a href={site.calcom} target="_blank" rel="noopener noreferrer">
                  Book a call
                  <Icon icon={ArrowUpRight} size={16} />
                  <span className="sr-only">on Cal.com (opens in a new tab)</span>
                </a>
              </Button>
              <Button asChild variant="secondary">
                <Link href="#enquiry">
                  Send an enquiry
                  <Icon icon={ArrowRight} size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section id="enquiry" aria-labelledby="enquiry-title" className="cl-section">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--cl-grid-gap)">
          <div className="lg:col-span-7">
            <h2 id="enquiry-title" className="cl-type-section text-text-primary">
              Send an enquiry
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="cl-type-eyebrow uppercase text-text-muted">Elsewhere</h2>
            <ul className="mt-2">
              {external.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 cl-type-ui text-brand no-underline hover:text-brand-hover"
                  >
                    {l.label}
                    <Icon icon={ArrowUpRight} size={16} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>
    </>
  );
}
