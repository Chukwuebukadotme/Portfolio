import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { HashRedirect } from "@/components/site/hash-redirect";
import { ThemeProvider } from "@/components/site/theme-provider";
import { site } from "@/lib/content";

import "./globals.css";

/* The design system names Geist and Geist Mono. next/font self-hosts both and
   exposes them as the variables tokens/typography.css reads. */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chukwuebuka.dev"),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description:
    "I design and engineer digital products that make complex work simpler. Product thinking, design and engineering for websites, applications and intelligent systems.",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description:
      "Design engineering, product engineering and AI engineering. UK based.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#050608" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
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
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <HashRedirect />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-1 focus:top-1 focus:z-50 focus:bg-surface-raised focus:px-1 focus:py-0.5 focus:shadow-medium"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
