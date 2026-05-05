import Link from "next/link";
import HeroPhone from "./HeroPhone";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid-bg" />

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-tag">
            <div className="hero-tag-dot" />
            Web3 Ride-Hailing Platform
          </div>

          <h1 className="hero-h1">
            <span className="clash-display clash-display--hero-line">RIDE.</span>
            <br />
            <span className="clash-display clash-display--hero-line">EARN.</span>
            <br />
            <em>Own</em>
            <br />
            <span className="hollow">A PIECE.</span>
          </h1>

          <div className="hero-actions">
            <Link href="/waitlist" className="btn-glow syne">
              Join the waitlist →
            </Link>
            <Link href="#how" className="btn-outline-light">
              How it works
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-glow-orb" />
          <div className="hero-device-stage">
            <div className="hero-glass-card right">
              <div className="hero-glass-card-inner">
                <div className="hero-card-head">
                  <div className="hero-card-dot" />
                  <span className="hero-card-caption">Driver found</span>
                </div>
                <div className="hero-card-title">2 min away</div>
                <div className="hero-card-body">Top rated · Toyota Camry</div>
              </div>
            </div>

            <div className="hero-glass-card left">
              <div className="hero-glass-card-inner">
                <div className="hero-card-head">
                  <span className="hero-card-caption">Earned today</span>
                </div>
                <div className="hero-card-value">+₦12,400</div>
                <div className="hero-card-body">Driver rewards settle in-app</div>
                <div className="hero-card-chip">↑ 18% vs yesterday</div>
              </div>
            </div>

            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}
