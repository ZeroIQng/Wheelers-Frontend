"use client";

import { useEffect } from "react";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AppScreensSection from "@/components/sections/AppScreensSection";
import CarSection from "@/components/sections/CarSection";
import CTASection from "@/components/sections/CTASection";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import RadarSection from "@/components/sections/RadarSection";
import Ticker from "@/components/sections/Ticker";
import TokenSection from "@/components/sections/TokenSection";
import WhoSection from "@/components/sections/WhoSection";

export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );

    const nodes = document.querySelectorAll(".reveal");
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-shell">
      <Navbar />
      <Ticker />
      <Hero />
      <CarSection />
      <WhoSection />
      <Features />
      <HowItWorks />
      <div className="transition-band" />
      <AppScreensSection />
      <TokenSection />
      <RadarSection />
      <CTASection />
      <Footer />
    </main>
  );
}
