export default function CTASection() {
  return (
    <section className="cta-wrap" id="cta">
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="mono"
          style={{
            display: "inline-block",
            marginBottom: 20,
            padding: "4px 14px",
            border: "2px solid rgba(255,255,255,.4)",
            borderRadius: 20,
            background: "rgba(255,255,255,.2)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          EARLY ACCESS OPEN
        </div>
        <h2 className="cta-h2">
          Ready to
          <br />
          own the road?
        </h2>
        <p className="cta-sub">
          Join thousands of riders and drivers building the future of transportation.
          Download now, the first month is free.
        </p>
        <div className="cta-actions" style={{ justifyContent: "center" }}>
          <a href="#" className="btn-white">
            Download iOS
          </a>
          <a href="#" className="btn-white">
            Download Android
          </a>
          <a href="#" className="btn-white-ghost">
            Connect Wallet -&gt;
          </a>
        </div>
      </div>
    </section>
  );
}
