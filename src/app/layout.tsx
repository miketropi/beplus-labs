import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
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
      className={`${inconsolata.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme" strategy="beforeInteractive">
          {`
(function() {
  var theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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
