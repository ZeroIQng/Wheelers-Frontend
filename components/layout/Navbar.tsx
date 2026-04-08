"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`main-nav ${solid ? "solid" : ""}`} id="mainNav">
      <Link href="#" className="nav-logo">
        <div className="nav-orb">
          <span>W</span>
        </div>
        <span className="nav-brand">WHELEERS</span>
      </Link>

      <div className="nav-links">
        <Link href="#riders">For Riders</Link>
        <Link href="#drivers">For Drivers</Link>
        <Link href="#token">$WHL Token</Link>
        <Link href="#how">How it works</Link>
      </div>

      <Link href="#cta" className="nav-cta-btn syne">
        Get the App
      </Link>
    </nav>
  );
}
