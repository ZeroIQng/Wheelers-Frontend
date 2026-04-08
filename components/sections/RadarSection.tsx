export default function RadarSection() {
  return (
    <section className="radar-wrap" id="radar">
      <div className="radar-canvas">
        {[120, 220, 340, 480, 640].map((size) => (
          <div className="radar-static" key={size} style={{ width: size, height: size }} />
        ))}
        {[0, 0.7, 1.4, 2.1, 2.8].map((delay) => (
          <div
            className="radar-ring"
            key={delay}
            style={{ width: 800, height: 800, animationDelay: `${delay}s` }}
          />
        ))}
        <div className="radar-sweep" />
        <div className="radar-blip" style={{ top: "36%", left: "57%" }} />
        <div className="radar-blip" style={{ top: "55%", left: "38%", animationDelay: ".9s" }} />
        <div className="radar-blip" style={{ top: "42%", left: "44%", width: 6, height: 6 }} />
      </div>

      <div className="radar-content reveal">
        <div className="radar-center-dot" />
        <div
          className="mono"
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--or)",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Drivers Near You
        </div>
        <h2 className="section-h2" style={{ color: "var(--ow)", maxWidth: 640 }}>
          Match in <span style={{ color: "var(--or)" }}>30 seconds.</span>
          <br />
          Every single time.
        </h2>
        <p
          style={{
            marginTop: 20,
            maxWidth: 480,
            fontSize: 15,
            color: "#777",
            lineHeight: 1.7,
          }}
        >
          Our radar engine scans thousands of nearby verified drivers in real time, the
          moment you tap, the network moves.
        </p>
      </div>
    </section>
  );
}
