"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const HUBS = [
  { id: "ikeja",    cx: 230, cy: 95,  label: "Ikeja",     zone: "Ikeja — Zone A",           name: "Chukwuemeka O.", info: "2 min away · 4.9★ · 847 trips"   },
  { id: "vi",       cx: 260, cy: 195, label: "V/Island",  zone: "Victoria Island — Zone B", name: "Adebayo F.",     info: "1 min away · 4.8★ · 1,203 trips" },
  { id: "lekki",    cx: 200, cy: 265, label: "Lekki",     zone: "Lekki — Zone C",           name: "Precious A.",    info: "3 min away · 5.0★ · 562 trips"   },
  { id: "surulere", cx: 95,  cy: 240, label: "Surulere",  zone: "Surulere — Zone D",        name: "Olumide K.",     info: "2 min away · 4.7★ · 991 trips"   },
  { id: "yaba",     cx: 110, cy: 140, label: "Yaba",      zone: "Yaba — Zone E",            name: "Ngozi I.",       info: "1 min away · 4.9★ · 1,540 trips" },
] as const;

type HubId = (typeof HUBS)[number]["id"];

interface PingRing {
  id: number;
  cx: number;
  cy: number;
  createdAt: number;
}

export default function RadarSection() {
  const [activeHub, setActiveHub]   = useState<HubId | null>(null);
  const [matchHub, setMatchHub]     = useState<(typeof HUBS)[number] | null>(null);
  const [showCard, setShowCard]     = useState(false);
  const [pings, setPings]           = useState<PingRing[]>([]);
  const pingIdRef                   = useRef(0);
  const sweepRef                    = useRef<SVGLineElement>(null);
  const sweepGroupRef               = useRef<SVGGElement>(null);

  const firePing = useCallback((cx: number, cy: number) => {
    const id = ++pingIdRef.current;
    setPings((prev) => [...prev, { id, cx, cy, createdAt: Date.now() }]);
    setTimeout(() => setPings((prev) => prev.filter((p) => p.id !== id)), 1400);
  }, []);

  const pingHub = useCallback((hubId: HubId) => {
    const hub = HUBS.find((h) => h.id === hubId)!;
    setActiveHub(hubId);
    setShowCard(false);
    setMatchHub(null);

    // fire 3 staggered rings
    firePing(hub.cx, hub.cy);
    setTimeout(() => firePing(hub.cx, hub.cy), 220);
    setTimeout(() => firePing(hub.cx, hub.cy), 440);

    // show card after pings land
    setTimeout(() => {
      setMatchHub(hub);
      setShowCard(true);
    }, 900);
  }, [firePing]);

  // auto-ping VI on mount
  useEffect(() => {
    const t = setTimeout(() => pingHub("vi"), 800);
    return () => clearTimeout(t);
  }, [pingHub]);

  return (
    <section className="radar-wrap" id="radar">
      <div className="radar-hatch" />

      {/* ── Radar canvas (sweep + static rings) ── */}
      <div className="radar-canvas">
        {[110, 210, 320, 440, 580].map((size) => (
          <div className="radar-static" key={size} style={{ width: size, height: size }} />
        ))}
        {[0, 0.8, 1.6, 2.4].map((delay) => (
          <div
            className="radar-ring"
            key={delay}
            style={{ width: 700, height: 700, animationDelay: `${delay}s` }}
          />
        ))}
        <div className="radar-sweep" />
      </div>

      {/* ── Main content grid ── */}
      <div className="radar-content-grid reveal">
        {/* Left copy */}
        <div className="radar-copy">
          <div className="radar-center-dot" />
          <div className="radar-eyebrow mono">Drivers Near You</div>
          <h2 className="section-h2">
            Match in <em>30 seconds.</em>
            <br />
            Every single time.
          </h2>
          <p className="radar-body">
            Tap a zone — our radar pings every verified driver in that hub and locks
            a match before you blink. Lagos-wide coverage, always live.
          </p>
          <div className="radar-badges">
            <span className="radar-badge radar-badge--dark">Live Network</span>
            <span className="radar-badge">Verified Drivers</span>
            {/* <span className="radar-badge">30s Match</span> */}
          </div>
        </div>

        {/* Right: interactive radar map */}
        <div className="radar-map-stage">
          <svg
            className="radar-map-svg"
            viewBox="0 0 340 340"
            aria-label="Wheleers city radar — tap a hub to ping drivers"
          >
            {/* Static dashed rings */}
            {[60, 110, 155].map((r) => (
              <circle
                key={r} cx={170} cy={170} r={r}
                fill="none"
                stroke="rgba(253,246,238,0.2)"
                strokeWidth={1}
                strokeDasharray="4 7"
              />
            ))}

            {/* Sweep */}
            <g style={{ transformOrigin: "170px 170px", animation: "radar-sweep 4s linear infinite" }}>
              <path
                d="M170,170 L170,15 A155,155 0 0,1 326.9,200"
                fill="rgba(253,246,238,0.06)"
              />
              <line
                x1="170" y1="170" x2="170" y2="15"
                stroke="rgba(253,246,238,0.7)"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </g>

            {/* Ping rings */}
            {pings.map((p) => {
              const age = Date.now() - p.createdAt;
              const progress = Math.min(age / 1000, 1);
              return (
                <circle
                  key={p.id}
                  cx={p.cx} cy={p.cy}
                  r={10 + progress * 80}
                  fill="none"
                  stroke="rgba(253,246,238,0.85)"
                  strokeWidth={1.5}
                  opacity={1 - progress}
                />
              );
            })}

            {/* Centre dot */}
            <circle cx={170} cy={170} r={7} fill="#0d0d0d" />
            <circle cx={170} cy={170} r={3} fill="#fdf6ee" />

            {/* Hub dots */}
            {HUBS.map((hub) => {
              const isActive = activeHub === hub.id;
              const isLeft   = hub.cx < 170;
              return (
                <g
                  key={hub.id}
                  onClick={() => pingHub(hub.id)}
                  style={{ cursor: "pointer" }}
                  className="radar-hub-group"
                >
                  <circle
                    cx={hub.cx} cy={hub.cy} r={16}
                    fill="none"
                    stroke={isActive ? "rgba(253,246,238,0.85)" : "rgba(253,246,238,0.3)"}
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={hub.cx} cy={hub.cy} r={7}
                    fill={isActive ? "#fdf6ee" : "#0d0d0d"}
                  />
                  <text
                    x={isLeft ? hub.cx - 22 : hub.cx + 22}
                    y={hub.cy}
                    dominantBaseline="central"
                    textAnchor={isLeft ? "end" : "start"}
                    fill={isActive ? "#fdf6ee" : "rgba(253,246,238,0.6)"}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {hub.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Match card */}
          <div className={`radar-match-card${showCard ? " radar-match-card--visible" : ""}`}>
            {matchHub && (
              <>
                <p className="radar-match-zone mono">{matchHub.zone}</p>
                <p className="radar-match-name">{matchHub.name}</p>
                <div className="radar-match-row">
                  <span className="radar-match-dot" />
                  <span className="radar-match-info">{matchHub.info}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}