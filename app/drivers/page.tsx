import type { Metadata } from "next";
import DriversPage from "@/components/sections/DriversForm";

export const metadata: Metadata = {
  title: "EV Driver Partnership Program — Driver Interest Survey | Wheelers",
  description:
    "Join the Wheelers EV Driver Partnership Program. Lease-to-own electric vehicles with advanced technology, earn more, and eventually own your vehicle in 24–36 months.",
  alternates: {
    canonical: "/drivers",
  },
  openGraph: {
    title: "EV Driver Partnership Program — Driver Interest Survey | Wheelers",
    description:
      "Join the Wheelers EV Driver Partnership Program. Lease-to-own electric vehicles, earn more, and own your vehicle in 24–36 months.",
    url: "/drivers",
  },
};

export default function Page() {
  return <DriversPage />;
}
