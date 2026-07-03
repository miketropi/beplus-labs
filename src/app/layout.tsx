import type { Metadata } from "next";
import { Special_Elite, IBM_Plex_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const specialElite = Special_Elite({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
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
      className={`${specialElite.variable} ${ibmPlexSerif.variable} antialiased`}
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
