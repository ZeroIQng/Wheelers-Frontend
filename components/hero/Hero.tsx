import Link from "next/link";
import HeroPhone from "./HeroPhone";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid-bg" />

      <div className="hero-inner">
        <div>
          <div className="hero-tag">
            <div className="hero-tag-dot" />
            Web3 Ride-Hailing Platform
          </div>

          <h1 className="hero-h1">
            RIDE.
            <br />
            EARN.
            <br />
            <em>Own</em>
            <br />
            <span className="hollow">A PIECE.</span>
          </h1>

          <p className="hero-sub">
            The first decentralized ride-hailing platform where every trip earns you{" "}
            <strong>real ownership.</strong> Not a passenger, a stakeholder.
          </p>

          <div className="hero-actions">
            <Link href="#cta" className="btn-glow syne">
              Get Started Free -&gt;
            </Link>
            <Link href="#how" className="btn-outline-light">
              How it works
            </Link>
          </div>

          <div className="hero-stat-row">
            <div className="hero-stat-d">
              <strong>
                50K<span className="t-or">+</span>
              </strong>
              <p>Riders onboard</p>
            </div>
            <div className="hero-stat-d">
              <strong>
                8K<span className="t-or">+</span>
              </strong>
              <p>Active drivers</p>
            </div>
            <div className="hero-stat-d">
              <strong>
                $2.1<span className="t-or">M</span>
              </strong>
              <p>Earnings paid out</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-glow-orb" />
          <div className="hero-device-stage">
            <div className="hero-glass-card right">
              <div className="hero-card-head">
                <div className="hero-card-dot" />
                <span className="hero-card-caption mono">DRIVER FOUND</span>
              </div>
              <div className="hero-card-title syne">2 min away</div>
              <div className="hero-card-body">Top rated | Toyota Camry</div>
            </div>

            <div className="hero-glass-card left">
              <div className="hero-card-caption mono">EARNED TODAY</div>
              <div className="hero-card-value syne">+N12,400</div>
              <div className="hero-card-body">Driver rewards settle in-app</div>
            </div>

            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}
