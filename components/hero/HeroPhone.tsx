"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* ─── keyframe injection ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes blob-float   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(6deg)} }
  @keyframes blob-float2  { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 50%{transform:translateY(-6px) rotate(-8deg) scale(1.05)} }
  @keyframes spin-slow    { to{transform:rotate(360deg)} }
  @keyframes spin-rev     { to{transform:rotate(-360deg)} }
  @keyframes float-x      { 0%,100%{transform:translateX(0) rotate(0deg)} 50%{transform:translateX(8px) rotate(10deg)} }
  @keyframes morph        { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 33%{border-radius:40% 60% 30% 70%/60% 30% 70% 40%} 66%{border-radius:70% 30% 50% 50%/40% 70% 30% 60%} }
  @keyframes dash-scroll  { to{stroke-dashoffset:-20} }
  @keyframes btn-pulse    { 0%,100%{box-shadow:3px 3px 0 #0D0D0D} 50%{box-shadow:4px 4px 0 #0D0D0D,0 0 0 4px rgba(255,255,255,.15)} }
`;

export default function HeroPhone() {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.textContent = CSS;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => { styleRef.current?.remove(); styleRef.current = null; };
  }, []);

  return (
    <div
      style={{
        width: 280,
        height: 540,
        background: "#FF5C00",
        border: "2.5px solid #0D0D0D",
        borderRadius: 32,
        overflow: "hidden",
        position: "relative",
        boxShadow: "5px 5px 0 #0D0D0D",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* ── notch bar ── */}
      <div
        style={{
          background: "#0D0D0D",
          height: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 64, height: 6, background: "#333", borderRadius: 3 }} />
      </div>

      {/* ── splash body ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ── floating blob top-left ── */}
        <svg
          style={{
            position: "absolute",
            top: -18,
            left: -18,
            animation: "blob-float 3.5s ease-in-out infinite",
          }}
          width={130}
          height={130}
          viewBox="0 0 130 130"
        >
          <path
            d="M65 10 C90 10,118 28,120 55 C122 82,100 110,72 118 C44 126,14 108,8 80 C2 52,20 18,65 10Z"
            fill="rgba(255,255,255,.18)"
          />
        </svg>

        {/* ── spinning 8-pointed star bottom-right ── */}
        <svg
          style={{
            position: "absolute",
            bottom: 60,
            right: 18,
            animation: "spin-slow 10s linear infinite",
            opacity: 0.25,
          }}
          width={54}
          height={54}
          viewBox="0 0 54 54"
        >
          <path
            d="M27 4L30.5 22 46 8 33.5 22 52 27 33.5 32 46 46 30.5 32 27 50 23.5 32 8 46 20.5 32 2 27 20.5 22 8 8 23.5 22Z"
            fill="#fff"
          />
        </svg>

        {/* ── spinning hexagon top-right ── */}
        <svg
          style={{
            position: "absolute",
            top: 60,
            right: 20,
            animation: "spin-rev 12s linear infinite",
            opacity: 0.2,
          }}
          width={50}
          height={50}
          viewBox="0 0 50 50"
        >
          <polygon
            points="25,3 47,14 47,36 25,47 3,36 3,14"
            fill="none"
            stroke="#fff"
            strokeWidth={2}
          />
        </svg>

        {/* ── morphing blob bottom-left ── */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 22,
            width: 32,
            height: 32,
            background: "rgba(255,255,255,.22)",
            animation: "morph 4s ease-in-out infinite",
          }}
        />

        {/* ── floating diamond cluster top-left inner ── */}
        <svg
          style={{
            position: "absolute",
            top: 40,
            left: 24,
            opacity: 0.15,
            animation: "float-x 3s ease-in-out infinite",
          }}
          width={36}
          height={36}
          viewBox="0 0 36 36"
        >
          <rect x={12} y={2} width={12} height={12} transform="rotate(45 18 8)" fill="#fff" />
          <rect x={12} y={20} width={10} height={10} transform="rotate(45 17 25)" fill="#fff" opacity={0.6} />
        </svg>

        {/* ── logo blob with W ── */}
        <svg
          style={{ animation: "blob-float 3s ease-in-out infinite", marginBottom: 8 }}
          width={84}
          height={84}
          viewBox="0 0 84 84"
        >
          <path
            d="M42 8 C62 8,76 22,78 42 C80 62,66 76,44 78 C22 80,6 66,6 44 C6 22,22 8,42 8Z"
            fill="rgba(255,255,255,.18)"
          />
          <path
            d="M42 16 C58 16,68 26,68 42 C68 58,58 68,42 68 C26 68,16 58,16 42 C16 26,26 16,42 16Z"
            fill="rgba(255,255,255,.15)"
          />
          <text
            x={42}
            y={52}
            textAnchor="middle"
            fontFamily="'Clash Display', 'Segoe UI', sans-serif"
            fontWeight={800}
            fontSize={30}
            fill="#fff"
          >
            W
          </text>
        </svg>

        {/* ── wordmark ── */}
        <div
          style={{
            fontFamily: "'Clash Display', 'Segoe UI', sans-serif",
            fontWeight: 800,
            fontSize: 40,
            color: "#fff",
            letterSpacing: -1,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          WHEEL
          <br />
          ERS
        </div>

        {/* ── tagline ── */}
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,.7)",
            marginTop: 8,
            letterSpacing: "1.5px",
          }}
        >
          ride. earn. own.
        </div>

        {/* ── CTA button ── */}
        <Link
          href="/waitlist"
          style={{
            marginTop: 28,
            background: "#fff",
            color: "#FF5C00",
            border: "2.5px solid #0D0D0D",
            borderRadius: 10,
            padding: "11px 0",
            width: 180,
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            boxShadow: "3px 3px 0 #0D0D0D",
            animation: "btn-pulse 2.5s ease-in-out infinite",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Join the waitlist ↗
        </Link>

        {/* ── dashed wave decoration ── */}
        <svg
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.18,
          }}
          width={220}
          height={30}
          viewBox="0 0 220 30"
        >
          <path
            d="M10 15 Q55 5 110 15 Q165 25 210 15"
            fill="none"
            stroke="#fff"
            strokeWidth={2}
            strokeDasharray="6 4"
            style={{ animation: "dash-scroll 2s linear infinite" }}
          />
        </svg>
      </div>
    </div>
  );
}
