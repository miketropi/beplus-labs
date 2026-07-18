import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Serif, Google_Sans_Code } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const googleSansCode = Google_Sans_Code({
  variable: "--font-mono-code",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BePlus Labs — WordPress Themes & Plugins",
    template: "%s | BePlus Labs",
  },
  description:
    "Open-source WordPress themes, plugins, and developer tools. Explore our products, join the beta, and stay in the loop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${ibmPlexSerif.variable} ${googleSansCode.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme" strategy="beforeInteractive">
          {`
(function() {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
