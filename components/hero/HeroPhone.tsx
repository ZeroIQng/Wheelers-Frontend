"use client";

import { type FormEvent, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  calculateRidePrice,
  type RidePriceBreakdown,
} from "@/lib/ride-pricing";

/* ─── constants ─── */
const DEFAULT_FROM = "Admiralty Way, Lekki";
const DEFAULT_TO = "Ozumba Mbadiwe, Victoria Island";
const DEFAULT_DISTANCE_KM = 18;

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value).replace("NGN", "₦");
}

type QuoteResponse = {
  from?: string;
  to?: string;
  quote?: RidePriceBreakdown;
  message?: string;
};

/* ─── keyframes injected once ─── */
const SPLASH_CSS = `
  @keyframes whl-blob-float  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(6deg)} }
  @keyframes whl-blob-float2 { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 50%{transform:translateY(-6px) rotate(-8deg) scale(1.05)} }
  @keyframes whl-spin-slow   { to{transform:rotate(360deg)} }
  @keyframes whl-spin-rev    { to{transform:rotate(-360deg)} }
  @keyframes whl-float-x     { 0%,100%{transform:translateX(0) rotate(0deg)} 50%{transform:translateX(8px) rotate(10deg)} }
  @keyframes whl-morph       { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 33%{border-radius:40% 60% 30% 70%/60% 30% 70% 40%} 66%{border-radius:70% 30% 50% 50%/40% 70% 30% 60%} }
  @keyframes whl-dash-scroll { to{stroke-dashoffset:-20} }
  @keyframes whl-btn-pulse   { 0%,100%{box-shadow:3px 3px 0 #0D0D0D} 50%{box-shadow:4px 4px 0 #0D0D0D,0 0 0 4px rgba(255,255,255,.15)} }
  @keyframes whl-burst {
    0%   { transform: scale(1);    opacity: 1; border-radius: 20px; }
    10%  { transform: scale(0.88); opacity: 1; }
    100% { transform: scale(9) rotate(8deg); opacity: 0; border-radius: 50%; }
  }
  @keyframes whl-quote-in {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
`;

/* ─── state machine ─── */
type Phase = "splash" | "bursting" | "quote";

export default function HeroPhone() {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [phase, setPhase] = useState<Phase>("splash");

  /* quote state */
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [resolvedFrom, setResolvedFrom] = useState(DEFAULT_FROM);
  const [resolvedTo, setResolvedTo] = useState(DEFAULT_TO);
  const [quote, setQuote] = useState<RidePriceBreakdown>(() =>
    calculateRidePrice(DEFAULT_DISTANCE_KM),
  );
  const [feedback, setFeedback] = useState("Demo fare loaded.");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  /* inject keyframes once */
  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.textContent = SPLASH_CSS;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => {
      styleRef.current?.remove();
      styleRef.current = null;
    };
  }, []);

  /* trigger burst after 900 ms */
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("bursting"), 900);
    // remove splash from DOM after animation completes (0.55s)
    const t2 = window.setTimeout(() => setPhase("quote"), 900 + 550);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  /* quote fetch */
  async function loadQuote() {
    try {
      const response = await fetch("/api/ride-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      const payload = (await response.json()) as QuoteResponse;
      if (!response.ok || !payload.quote) {
        throw new Error(payload.message ?? "Quote could not be loaded.");
      }
      setResolvedFrom(payload.from ?? from.trim());
      setResolvedTo(payload.to ?? to.trim());
      setQuote(payload.quote);
      setFeedback(`Route locked at ${payload.quote.distanceKm.toFixed(2)} km.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quote could not be loaded.");
      setFeedback("Showing the last available estimate.");
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFeedback("Checking route and fixed fare...");
    startTransition(() => void loadQuote());
  }

  return (
    <div className="hero-phone">
      {/* ── notch ── */}
      <div className="hero-phone-notch">
        <div className="hero-phone-notch-pill" />
      </div>

      {/* ── screen ── */}
      <div
        className="hero-phone-screen"
        style={{ position: "relative", overflow: "hidden", padding: 0 }}
      >
        {/* ═══════════════════════════════════════
            SPLASH — rendered only during splash/bursting phases
            Sits as absolute overlay, z-index above quote UI
        ════════════════════════════════════════ */}
        {phase !== "quote" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              background: "#FF5C00",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transformOrigin: "center center",
              /* burst animation fires when phase === "bursting" */
              animation:
                phase === "bursting"
                  ? "whl-burst 0.55s cubic-bezier(0.22,0,0.58,1) forwards"
                  : "none",
            }}
          >
            {/* floating blob top-left */}
            <svg
              style={{
                position: "absolute",
                top: -18,
                left: -18,
                animation: "whl-blob-float 3.5s ease-in-out infinite",
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

            {/* spinning star bottom-right */}
            <svg
              style={{
                position: "absolute",
                bottom: 60,
                right: 18,
                animation: "whl-spin-slow 10s linear infinite",
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

            {/* spinning hexagon top-right */}
            <svg
              style={{
                position: "absolute",
                top: 60,
                right: 20,
                animation: "whl-spin-rev 12s linear infinite",
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

            {/* morphing blob bottom-left */}
            <div
              style={{
                position: "absolute",
                bottom: 28,
                left: 22,
                width: 32,
                height: 32,
                background: "rgba(255,255,255,.22)",
                animation: "whl-morph 4s ease-in-out infinite",
              }}
            />

            {/* diamond cluster top-left */}
            <svg
              style={{
                position: "absolute",
                top: 40,
                left: 24,
                opacity: 0.15,
                animation: "whl-float-x 3s ease-in-out infinite",
              }}
              width={36}
              height={36}
              viewBox="0 0 36 36"
            >
              <rect x={12} y={2} width={12} height={12} transform="rotate(45 18 8)" fill="#fff" />
              <rect x={12} y={20} width={10} height={10} transform="rotate(45 17 25)" fill="#fff" opacity={0.6} />
            </svg>

            {/* logo blob with W */}
            <svg
              style={{ animation: "whl-blob-float 3s ease-in-out infinite", marginBottom: 8 }}
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
                y={50}
                textAnchor="middle"
                fontFamily="'Syne', 'Segoe UI', sans-serif"
                fontWeight={800}
                fontSize={25}
                fill="#fff"
              >
                W
              </text>
            </svg>

            {/* wordmark */}
            <div
              style={{
                fontFamily: "'Syne', 'Segoe UI', sans-serif",
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

            {/* tagline */}
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

            {/* CTA button — only shows during splash, not bursting */}
            {phase === "splash" && (
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
                  animation: "whl-btn-pulse 2.5s ease-in-out infinite",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                Join the waitlist ↗
              </Link>
            )}

            {/* dashed wave */}
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
                style={{ animation: "whl-dash-scroll 2s linear infinite" }}
              />
            </svg>
          </div>
        )}

        {/* ═══════════════════════════════════════
            QUOTE UI — always in DOM, revealed after splash removed
        ════════════════════════════════════════ */}
        <div
          className="hero-phone-screen--quote"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: 12,
            height: "100%",
            color: "var(--bk)",
            animation: phase === "quote" ? "whl-quote-in 0.4s ease forwards" : "none",
            opacity: phase === "quote" ? 1 : 0,
          }}
        >
          {/* ambient glows */}
          <div className="hero-phone-ambient ambient-top" />
          <div className="hero-phone-ambient ambient-bottom" />

          <div className="hero-phone-status">
            <span>08:24</span>
            <span>{isPending ? "Calculating fare" : "Fixed fare preview"}</span>
          </div>

          <div className="hero-phone-quote-map">
            <div className="hero-phone-map-grid" />
            <div className="hero-phone-map-route" />
            <div className="hero-phone-map-pin pin-start" />
            <div className="hero-phone-map-pin pin-end" />
            <div className="hero-phone-map-fare">
              <span className="mono">Trip price</span>
              <strong>{formatCurrency(quote.tripPrice)}</strong>
            </div>
          </div>

          <form className="hero-phone-form" onSubmit={handleSubmit}>
            <label className="hero-phone-field">
              <span>From</span>
              <input
                autoComplete="street-address"
                name="from"
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Pickup location"
                value={from}
              />
            </label>
            <label className="hero-phone-field">
              <span>To</span>
              <input
                autoComplete="street-address"
                name="to"
                onChange={(e) => setTo(e.target.value)}
                placeholder="Destination"
                value={to}
              />
            </label>
            <button className="hero-phone-submit" disabled={isPending} type="submit">
              {isPending ? "Getting price..." : "See price"}
            </button>
          </form>

          <div className="hero-phone-route-card">
            <div className="hero-phone-route-stop active">
              <span />
              <div>
                <p>Pickup</p>
                <strong>{resolvedFrom}</strong>
              </div>
            </div>
            <div className="hero-phone-route-line" />
            <div className="hero-phone-route-stop">
              <span />
              <div>
                <p>Dropoff</p>
                <strong>{resolvedTo}</strong>
              </div>
            </div>
          </div>

          <div className="hero-phone-metrics">
            <div className="hero-phone-metric">
              <p>Distance</p>
              <strong>{quote.distanceKm.toFixed(2)} km</strong>
            </div>
            <div className="hero-phone-metric">
              <p>Price / km</p>
              <strong>{formatCurrency(quote.pricePerKm)}</strong>
            </div>
            <div className="hero-phone-metric">
              <p>Break even</p>
              <strong>{formatCurrency(quote.breakEvenPerKm)}</strong>
            </div>
            <div className="hero-phone-metric">
              <p>Trip profit</p>
              <strong>{formatCurrency(quote.tripProfit)}</strong>
            </div>
          </div>

          <div className="hero-phone-bottom-card">
            <div className="hero-phone-bottom-top">
              <div>
                <p>Energy cost</p>
                <strong>{formatCurrency(quote.energyCost)}</strong>
              </div>
              <div className="hero-phone-live-dot" />
            </div>
            <div className="hero-phone-feedback">{feedback}</div>
            {error ? <div className="hero-phone-error">{error}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}