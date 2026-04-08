"use client";

import { useEffect, useState } from "react";

const screens = [
  {
    background: "var(--or)",
    title: "WHEEL\nERS",
    caption: "RIDE. EARN. OWN.",
    accent: "Get Started ->",
  },
  {
    background: "linear-gradient(160deg,#d4e6d4,#c8dcc8)",
    title: "WHERE TO?",
    caption: "Search destination...",
    accent: "MAP MODE",
  },
  {
    background: "#0a0a0a",
    title: "FINDING YOUR\nDRIVER",
    caption: "3 drivers nearby...",
    accent: "LIVE MATCH",
  },
];

export default function HeroPhone() {
  const [screenIndex, setScreenIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setScreenIndex((current) => (current + 1) % screens.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const screen = screens[screenIndex];

  return (
    <div className="hero-phone">
      <div className="hero-phone-notch">
        <div className="hero-phone-notch-pill" />
      </div>

      <div className="hero-phone-screen" style={{ background: screen.background }}>
        <div className="hero-phone-frame">
          <div
            style={{
              position: "absolute",
              top: -14,
              left: -14,
              width: 90,
              height: 90,
              background: "rgba(255,255,255,.12)",
              animation: "morph 5s ease-in-out infinite",
            }}
          />

          <svg width="60" height="60" viewBox="0 0 84 84" style={{ marginBottom: 6 }}>
            <path
              d="M42 8C62 8 76 22 78 42C80 62 66 76 44 78C22 80 6 66 6 44C6 22 22 8 42 8Z"
              fill="rgba(255,255,255,.18)"
            />
            <path
              d="M42 16C58 16 68 26 68 42C68 58 58 68 42 68C26 68 16 58 16 42C16 26 26 16 42 16Z"
              fill="rgba(255,255,255,.14)"
            />
            <text
              x="42"
              y="50"
              textAnchor="middle"
              fontFamily="var(--font-syne)"
              fontWeight="800"
              fontSize="24"
              fill="#fff"
            >
              W
            </text>
          </svg>

          <div
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: 24,
              color: screenIndex === 1 ? "#0d0d0d" : "#fff",
              lineHeight: 1,
              textAlign: "center",
              whiteSpace: "pre-line",
            }}
          >
            {screen.title}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 9,
              letterSpacing: 2,
              color: screenIndex === 1 ? "rgba(13,13,13,.5)" : "rgba(255,255,255,.6)",
            }}
          >
            {screen.caption}
          </div>

          <div
            style={{
              marginTop: 20,
              padding: "8px 18px",
              borderRadius: 7,
              background: screenIndex === 2 ? "var(--or)" : "#fff",
              color: screenIndex === 2 ? "#fff" : "var(--or)",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            {screen.accent}
          </div>
        </div>
      </div>
    </div>
  );
}
