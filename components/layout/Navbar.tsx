"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <nav className={`main-nav ${solid ? "solid" : ""}`} id="mainNav">
      <div className="nav-row">
        <Link href="#" className="nav-logo" onClick={closeMenu}>
          <div className="nav-orb">
            <span className="clash-display">W</span>
          </div>
          <span className="nav-brand clash-display">WHELEERS</span>
        </Link>

        <div className="nav-links">
          <Link href="#riders">For Riders</Link>
          <Link href="#drivers">For Drivers</Link>
          <Link href="#how">How it works</Link>
        </div>

        <Link href="/waitlist" className="nav-cta-btn syne">
          Join the waitlist
        </Link>

        <button
          className={`nav-menu-btn ${open ? "open" : ""}`}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-nav-menu ${open ? "open" : ""}`}>
        <Link href="#riders" onClick={closeMenu}>
          For Riders
        </Link>
        <Link href="#drivers" onClick={closeMenu}>
          For Drivers
        </Link>
        <Link href="#how" onClick={closeMenu}>
          How it works
        </Link>
      </div>
    </nav>
  );
}
