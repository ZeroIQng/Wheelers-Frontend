import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import "../styles/globals.css";
import "../styles/animations.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wheelers | Ride. Earn. Own.",
    template: "%s | Wheelers",
  },
  description:
    "Wheelers is a ride-hailing platform focused on fixed pricing, electric mobility, and a cleaner booking experience.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wheelers | Ride. Earn. Own.",
    description:
      "Wheelers is a ride-hailing platform focused on fixed pricing, electric mobility, and a cleaner booking experience.",
    url: siteUrl,
    siteName: "Wheelers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheelers | Ride. Earn. Own.",
    description:
      "Wheelers is a ride-hailing platform focused on fixed pricing, electric mobility, and a cleaner booking experience.",
  },
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
