"use client";

import { useEffect } from "react";
import Hero from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CarSection from "@/components/sections/CarSection";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import RadarSection from "@/components/sections/RadarSection";
import Ticker from "@/components/sections/Ticker";
import WhoSection from "@/components/sections/WhoSection";

export default function HomePageClient() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.05 },
    );

    const nodes = document.querySelectorAll(".reveal");
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-shell">
      <div className="hyge-banner">
        <p className="hyge-banner-text">
          Wheelers is a product of <strong>HYGE Innovations</strong>
        </p>
      </div>
      <Navbar />
      <Ticker />
      <Hero />
      <CarSection />
      <WhoSection />
      <Features />
      <HowItWorks />
      <div className="transition-band" />
      <RadarSection />
      <Footer />
    </main>
  );
}
