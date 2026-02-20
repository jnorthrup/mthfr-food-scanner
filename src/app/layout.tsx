import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "MTHFR Food Scanner",
  description: "Scan food products and evaluate ingredient safety for MTHFR methylation health. Identify unsafe ingredients, masking terms, and get personalized safety recommendations.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MTHFR Scan",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    title: "MTHFR Food Scanner",
    description: "Evaluate food safety for MTHFR methylation health",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script data-design-ignore="true" dangerouslySetInnerHTML={{
          __html: `(function() {
            if (window === window.parent || window.__DESIGN_NAV_REPORTER__) return;
            window.__DESIGN_NAV_REPORTER__ = true;
            function report() {
              try { window.parent.postMessage({ type: 'IFRAME_URL_CHANGE', payload: { url: location.origin + location.pathname + location.hash } }, '*'); } catch(e) {}
            }
            report();
            var ps = history.pushState, rs = history.replaceState;
            history.pushState = function() { ps.apply(this, arguments); report(); };
            history.replaceState = function() { rs.apply(this, arguments); report(); };
            window.addEventListener('popstate', report);
            window.addEventListener('hashchange', report);
            window.addEventListener('load', report);
          })();`
        }} />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen">
        <ClientBody>{children}</ClientBody>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
