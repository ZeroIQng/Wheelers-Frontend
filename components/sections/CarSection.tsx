"use client";

import { useEffect, useRef, useState } from "react";

export default function CarSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [unblurred, setUnblurred] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.25) {
            setUnblurred(true);
          } else if (entry.intersectionRatio < 0.1) {
            setUnblurred(false);
          }
        });
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.8, 1] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`car-section ${unblurred ? "unblurred" : ""}`}
      id="carSection"
      ref={sectionRef}
    >
      <div className="car-top-label">WHELEERS - BUILT FOR THE ROAD</div>
      <div className="car-road" />
      <div className="car-lane" />
      <div className="car-silhouette" />

      <div className="car-content">
        <div className="car-label mono">The road belongs to you</div>
        <div className="car-headline">
          BUILT FOR
          <br />
          <em>real</em> SPEED
        </div>
        <p className="car-sub">
          30-second driver match. Zero surge surprises. Every trip earns you ownership of
          the platform you ride.
        </p>
      </div>
    </section>
  );
}
