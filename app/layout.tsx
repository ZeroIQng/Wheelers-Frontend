import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wheleers - Ride. Earn. Own.",
  description:
    "A bold landing page for the Wheleers decentralized ride-hailing platform.",
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
