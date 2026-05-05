import type { Metadata } from "next";
import WaitlistPage from "@/components/sections/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description:
    "Join the Wheelers waitlist to get early access to fixed-price ride booking and the launch of the platform.",
  alternates: {
    canonical: "/waitlist",
  },
  openGraph: {
    title: "Join the Waitlist | Wheelers",
    description:
      "Join the Wheelers waitlist to get early access to fixed-price ride booking and the launch of the platform.",
    url: "/waitlist",
  },
};

export default function Page() {
  return <WaitlistPage />;
}
