import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ConsoleSignature } from "@/components/console-signature";
import { site } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Ross Bendillo — ${site.role} | Rival Peregrine`,
    template: `%s | ${site.short}`,
  },
  description:
    "AI engineer and full-stack developer shipping tested, auditable AI automation and Next.js products, with people in control of every decision. Human-in-the-loop AI, built to ship safely.",
  applicationName: "Ross Bendillo · Rival Peregrine",
  openGraph: { type: "website", siteName: "Ross Bendillo · Rival Peregrine" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0F" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAFB" },
  ],
};

// Runs before first paint so the theme never flashes.
// A saved choice wins; otherwise follow the system, falling back to light.
const themeScript = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="progress" aria-hidden />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <ConsoleSignature />
      </body>
    </html>
  );
}
