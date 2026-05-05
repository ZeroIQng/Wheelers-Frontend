import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Affordable Electric Ride Hailing App in Nigeria",
  description:
    "Wheelers is an affordable electric ride hailing app in Nigeria with fixed prices, upfront fares, and a cleaner alternative for everyday rides.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Affordable Electric Ride Hailing App in Nigeria",
    description:
      "Wheelers is an affordable electric ride hailing app in Nigeria with fixed prices, upfront fares, and a cleaner alternative for everyday rides.",
    url: "/",
  },
  twitter: {
    title: "Affordable Electric Ride Hailing App in Nigeria",
    description:
      "Wheelers is an affordable electric ride hailing app in Nigeria with fixed prices, upfront fares, and a cleaner alternative for everyday rides.",
  },
};

export default function Page() {
  return <HomePageClient />;
}
