export default function CTASection() {
  return (
    <section className="cta-wrap" id="cta">
      <div className="cta-panel">
        <div className="cta-copy">
          <div className="cta-badge mono">EARLY ACCESS OPEN</div>
          <h2 className="cta-h2">
            Join the waitlist.
            <br />
            Be first on the road.
          </h2>
          <p className="cta-sub">
            Wheleers is building a cleaner ride experience around affordability,
            reliability, and city movement that feels more intentional.
          </p>
        </div>

        <div className="cta-actions" style={{ justifyContent: "center" }}>
          <a href="#" className="btn-white">
            Join the waitlist
          </a>
          <a href="#how" className="btn-white-ghost">
            How it works -&gt;
          </a>
        </div>
      </div>
    </section>
  );
}
