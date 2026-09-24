import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "../lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Provenance — an influence graph for software",
  description:
    "An open proposal for recording the sources that shape software and the artifacts they influence.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Provenance",
    description:
      "Record the sources that shape software and the artifacts they influence.",
    type: "website",
    url: "/",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f8fb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
