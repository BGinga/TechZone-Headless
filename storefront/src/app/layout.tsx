import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "TechZone",
  description: "Headless storefront",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#E44238",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
