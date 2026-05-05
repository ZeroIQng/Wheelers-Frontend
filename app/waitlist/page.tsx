import type { Metadata } from "next";
import WaitlistPage from "@/components/sections/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the Electric Ride Hailing Waitlist in Nigeria",
  description:
    "Join the Wheelers waitlist for affordable electric ride hailing in Nigeria with fixed prices, upfront fares, and early access to launch updates.",
  alternates: {
    canonical: "/waitlist",
  },
  openGraph: {
    title: "Join the Electric Ride Hailing Waitlist in Nigeria | Wheelers",
    description:
      "Join the Wheelers waitlist for affordable electric ride hailing in Nigeria with fixed prices, upfront fares, and early access to launch updates.",
    url: "/waitlist",
  },
};

export default function Page() {
  return <WaitlistPage />;
}
