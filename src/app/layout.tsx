import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { HashRedirect } from "@/components/site/hash-redirect";
import { site } from "@/lib/content";
import { resumeMeta } from "@/lib/resume";

import "./globals.css";

/* Cobalt Light pairs Space Grotesk for display with Inter for reading and UI.
   next/font self-hosts both under the variables styles/cobalt-light.css binds
   (--font-space-grotesk, --font-inter), loading only the weights the system
   names: display 500/600/700, body 400/500/600. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chukwuebuka.dev"),
  title: {
    default: `${site.name}, ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description:
    "I design and engineer digital products that make complex work simpler. Product thinking, design and engineering for websites, applications and intelligent systems.",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}, ${site.role}`,
    description:
      "Design engineering, product engineering and AI engineering. UK based.",
  },
  robots: { index: true, follow: true },
};

/* One light theme; the browser chrome matches the canvas. */
export const viewport: Viewport = {
  themeColor: "#F5F7FB",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        {/* Marks the document as scripted before first paint, so the scroll
            reveal's hidden start state only applies where something can undo
            it. Without JS the content renders plainly instead of blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-dvh">
        <HashRedirect />
        <a
          href="#main"
          className="fixed left-2 top-2 z-100 -translate-y-[200%] rounded-control bg-bg-surface p-3 cl-type-ui text-brand shadow-raised focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader resumeMeta={resumeMeta()} />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
