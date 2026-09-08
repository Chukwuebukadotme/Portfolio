import type { Metadata } from "next";

import { ContactForm } from "@/components/site/contact-form";
import { Container, Eyebrow, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to permanent roles across the UK in design engineering, product engineering and AI engineering, and to selected product collaborations globally.",
};

export default function ContactPage() {
  return (
    <>
      <Section className="pt-32">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 text-h1 font-extrabold text-text-primary">
            Let’s talk.
          </h1>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border-hairline p-8">
              <h2 className="text-h5 font-semibold text-text-primary">
                Hiring
              </h2>
              <p className="mt-3 text-medium text-text-secondary">
                Building a product, design engineering or AI team? I’m open to
                permanent opportunities across the UK.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <a href={site.resume} target="_blank" rel="noopener">
                    Résumé
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${site.email}`}>Email</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            <div className="border border-border-hairline p-8">
              <h2 className="text-h5 font-semibold text-text-primary">
                Project enquiries
              </h2>
              <p className="mt-3 text-medium text-text-secondary">
                Have a product, website or intelligent system you want to bring
                to life?
              </p>
              <div className="mt-6">
                <Button asChild size="sm">
                  <a href="#send">Start a project</a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_320px]">
            <div id="send" className="scroll-mt-20">
              <h2 className="text-h4 font-bold text-text-primary">
                Send a message
              </h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <aside className="flex flex-col gap-5 border-t border-border-hairline pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <h2 className="ds-eyebrow">Direct</h2>
              <dl className="flex flex-col gap-4 text-medium">
                <div>
                  <dt className="ds-eyebrow">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                <div>
                  <dt className="ds-eyebrow">LinkedIn</dt>
                  <dd className="mt-1">
                    <a
                      href={site.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Profile ↗
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="ds-eyebrow">GitHub</dt>
                  <dd className="mt-1">
                    <a
                      href={site.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chukwuebukadotme ↗
                    </a>
                  </dd>
                </div>
              </dl>
              {/* TODO — the Cal.com handle is still a placeholder, so the
                  booking link is withheld rather than shipped broken. */}
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
