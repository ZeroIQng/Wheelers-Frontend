import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Affordable Ride Hailing App in Lagos | Bolt & Uber Alternative",
  description:
    "Wheelers is an affordable ride hailing app in Lagos with fixed prices, upfront fares, and a cleaner alternative to Bolt or Uber.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Affordable Ride Hailing App in Lagos | Bolt & Uber Alternative",
    description:
      "Wheelers is an affordable ride hailing app in Lagos with fixed prices, upfront fares, and a cleaner alternative to Bolt or Uber.",
    url: "/",
  },
  twitter: {
    title: "Affordable Ride Hailing App in Lagos | Bolt & Uber Alternative",
    description:
      "Wheelers is an affordable ride hailing app in Lagos with fixed prices, upfront fares, and a cleaner alternative to Bolt or Uber.",
  },
};

export default function Page() {
  return <HomePageClient />;
}
