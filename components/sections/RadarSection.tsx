"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const HUB_DRIVERS: Record<string, { name: string; info: string }[]> = {
  ikeja: [
    { name: "Chukwuemeka O.", info: "2 min away · 4.9★ · 847 trips" },
    { name: "Tunde A.",        info: "4 min away · 4.7★ · 1,102 trips" },
    { name: "Segun B.",        info: "1 min away · 4.8★ · 634 trips" },
    { name: "Emeka J.",        info: "3 min away · 5.0★ · 291 trips" },
  ],
  vi: [
    { name: "Adebayo F.",      info: "1 min away · 4.8★ · 1,203 trips" },
    { name: "Kolade M.",       info: "2 min away · 4.9★ · 988 trips" },
    { name: "Rotimi S.",       info: "3 min away · 4.6★ · 2,041 trips" },
    { name: "Bisi T.",         info: "1 min away · 5.0★ · 417 trips" },
  ],
  lekki: [
    { name: "Precious A.",     info: "3 min away · 5.0★ · 562 trips" },
    { name: "Chisom N.",       info: "2 min away · 4.8★ · 730 trips" },
    { name: "Nnamdi O.",       info: "4 min away · 4.7★ · 1,899 trips" },
    { name: "Amara U.",        info: "1 min away · 4.9★ · 345 trips" },
  ],
  surulere: [
    { name: "Olumide K.",      info: "2 min away · 4.7★ · 991 trips" },
    { name: "Yetunde F.",      info: "5 min away · 4.8★ · 1,560 trips" },
    { name: "Kunle A.",        info: "1 min away · 4.9★ · 673 trips" },
    { name: "Dapo W.",         info: "3 min away · 4.6★ · 2,310 trips" },
  ],
  yaba: [
    { name: "Ngozi I.",        info: "1 min away · 4.9★ · 1,540 trips" },
    { name: "Ifeanyi C.",      info: "2 min away · 5.0★ · 820 trips" },
    { name: "Shade O.",        info: "3 min away · 4.8★ · 1,177 trips" },
    { name: "Victor E.",       info: "1 min away · 4.7★ · 456 trips" },
  ],
};

const HUBS = [
  { id: "ikeja",    cx: 230, cy: 95,  label: "Ikeja",    zone: "Ikeja — Zone A"           },
  { id: "vi",       cx: 260, cy: 195, label: "V/Island", zone: "Victoria Island — Zone B" },
  { id: "lekki",    cx: 200, cy: 265, label: "Lekki",    zone: "Lekki — Zone C"           },
  { id: "surulere", cx: 95,  cy: 240, label: "Surulere", zone: "Surulere — Zone D"        },
  { id: "yaba",     cx: 110, cy: 140, label: "Yaba",     zone: "Yaba — Zone E"            },
] as const;

type HubId = (typeof HUBS)[number]["id"];

interface MatchDriver {
  hub: (typeof HUBS)[number];
  name: string;
  info: string;
}

interface PingRing {
  id: number;
  cx: number;
  cy: number;
  createdAt: number;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RadarSection() {
  const [activeHub, setActiveHub] = useState<HubId | null>(null);
  const [matchDriver, setMatchDriver] = useState<MatchDriver | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [pings, setPings] = useState<PingRing[]>([]);
  const pingIdRef = useRef(0);
  const autoCycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const firePing = useCallback((cx: number, cy: number) => {
    const id = ++pingIdRef.current;
    setPings((prev) => [...prev, { id, cx, cy, createdAt: Date.now() }]);
    setTimeout(() => setPings((prev) => prev.filter((p) => p.id !== id)), 1400);
  }, []);

  const pingHub = useCallback(
    (hubId: HubId) => {
      const hub = HUBS.find((h) => h.id === hubId)!;
      const driver = pickRandom(HUB_DRIVERS[hubId]);

      setActiveHub(hubId);
      setShowCard(false);
      setMatchDriver(null);

      firePing(hub.cx, hub.cy);
      setTimeout(() => firePing(hub.cx, hub.cy), 220);
      setTimeout(() => firePing(hub.cx, hub.cy), 440);

      setTimeout(() => {
        setMatchDriver({ hub, ...driver });
        setShowCard(true);
      }, 900);
    },
    [firePing],
  );

  // Auto-cycle: pick a random hub every 4 s
  useEffect(() => {
    const cycle = () => {
      const hubIds = HUBS.map((h) => h.id) as HubId[];
      pingHub(pickRandom(hubIds));
      autoCycleRef.current = setTimeout(cycle, 4000);
    };
    autoCycleRef.current = setTimeout(cycle, 800);
    return () => {
      if (autoCycleRef.current) clearTimeout(autoCycleRef.current);
    };
  }, [pingHub]);

  const handleHubClick = useCallback(
    (hubId: HubId) => {
      // Reset auto-cycle when user taps manually
      if (autoCycleRef.current) clearTimeout(autoCycleRef.current);
      pingHub(hubId);
      // Resume auto-cycle after 8 s of inactivity
      autoCycleRef.current = setTimeout(function cycle() {
        const hubIds = HUBS.map((h) => h.id) as HubId[];
        pingHub(pickRandom(hubIds));
        autoCycleRef.current = setTimeout(cycle, 4000);
      }, 8000);
    },
    [pingHub],
  );

  return (
    <section className="radar-wrap" id="radar">
      <div className="radar-hatch" />

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

      <div className="radar-content-grid reveal">
        {/* Left copy */}
        <div className="radar-copy">
          <div className="radar-center-dot" />
          <div className="radar-eyebrow mono">Drivers Near You</div>
          <h2 className="section-h2 clash-display clash-display--radar-heading">
            Match in <em>30 seconds.</em>
            <br />
            Every single time.
          </h2>
          <p className="radar-body">
            Tap a zone — our radar pings every verified driver in that hub and locks a
            match before you blink. Lagos-wide coverage, always live.
          </p>
          <div className="radar-badges">
            <span className="radar-badge radar-badge--dark">Live Network</span>
            <span className="radar-badge">Verified Drivers</span>
          </div>
        </div>

        {/* Right: interactive radar map */}
        <div className="radar-map-stage">
          <svg
            className="radar-map-svg"
            viewBox="0 0 340 340"
            aria-label="Wheelers city radar — tap a hub to ping drivers"
          >
            {[60, 110, 155].map((r) => (
              <circle
                key={r}
                cx={170} cy={170} r={r}
                fill="none"
                stroke="rgba(253,246,238,0.2)"
                strokeWidth={1}
                strokeDasharray="4 7"
              />
            ))}

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

            <circle cx={170} cy={170} r={7} fill="#0d0d0d" />
            <circle cx={170} cy={170} r={3} fill="#fdf6ee" />

            {HUBS.map((hub) => {
              const isActive = activeHub === hub.id;
              const isLeft = hub.cx < 170;
              return (
                <g
                  key={hub.id}
                  onClick={() => handleHubClick(hub.id)}
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
            {matchDriver && (
              <>
                <p className="radar-match-zone mono">{matchDriver.hub.zone}</p>
                <p className="radar-match-name clash-display clash-display--driver-name">{matchDriver.name}</p>
                <div className="radar-match-row">
                  <span className="radar-match-dot" />
                  <span className="radar-match-info">{matchDriver.info}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
