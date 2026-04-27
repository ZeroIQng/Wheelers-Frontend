export default function RadarSection() {
  return (
    <section className="radar-wrap" id="radar">
      {/* Hatch overlay */}
      <div className="radar-hatch" />

      <div className="radar-canvas">
        {/* Static rings */}
        {[110, 210, 320, 440, 580].map((size) => (
          <div className="radar-static" key={size} style={{ width: size, height: size }} />
        ))}

        {/* Pulsing rings */}
        {[0, 0.8, 1.6, 2.4].map((delay) => (
          <div
            className="radar-ring"
            key={delay}
            style={{ width: 700, height: 700, animationDelay: `${delay}s` }}
          />
        ))}

        <div className="radar-sweep" />

        <div className="radar-blip" style={{ top: "34%", left: "58%", width: 10, height: 10 }} />
        <div className="radar-blip" style={{ top: "56%", left: "37%", width: 10, height: 10, animationDelay: ".9s" }} />
        <div className="radar-blip" style={{ top: "44%", left: "45%", width: 7, height: 7 }} />
        <div className="radar-blip" style={{ top: "40%", left: "63%", width: 8, height: 8, animationDelay: "1.3s" }} />
        <div className="radar-blip" style={{ top: "62%", left: "52%", width: 6, height: 6 }} />
      </div>

      <div className="radar-content reveal">
        <div className="radar-center-dot" />

        <div className="radar-eyebrow mono">Drivers Near You</div>

        <h2 className="section-h2">
          Match in{" "}
          <em>30 seconds.</em>
          <br />
          Every single time.
        </h2>

        <p className="radar-body">
          Our radar engine scans thousands of nearby verified drivers in real time — the
          moment you tap, the network moves.
        </p>

        <div className="radar-badges">
          <span className="radar-badge radar-badge--dark">Live Network</span>
          <span className="radar-badge">Verified Drivers</span>
          <span className="radar-badge">30s Match</span>
        </div>
      </div>
    </section>
  );
}
