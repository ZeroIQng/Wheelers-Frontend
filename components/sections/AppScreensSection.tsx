const flowSteps = [
  { label: "Request", value: "Pickup locked in" },
  { label: "Match", value: "Driver selected fast" },
  { label: "Ride", value: "Trip tracked live" },
  { label: "Earn", value: "Rewards land instantly" },
];

const supportNotes = [
  "Cleaner rider booking flow",
  "Driver status stays visible",
  "Wallet and payout sit inside the same experience",
];

export default function AppScreensSection() {
  return (
    <section className="screens-wrap">
      <div className="screens-inner screens-grid">
        <div className="reveal screens-copy">
          <div className="section-label">The App</div>
          <h2 className="section-h2">
            One clear <span className="accent">phone flow.</span>
          </h2>
          <p className="screens-lead">
            The orange energy stays. The app showcase is now structured around the real
            journey: request a ride, match a driver, track the trip, and collect your
            payout.
          </p>

          <div className="screens-flow">
            {flowSteps.map((step, index) => (
              <div className="screen-flow-card" key={step.label}>
                <span className="screen-flow-index mono">0{index + 1}</span>
                <strong>{step.label}</strong>
                <p>{step.value}</p>
              </div>
            ))}
          </div>

          <div className="screens-notes">
            {supportNotes.map((note) => (
              <div className="screens-note" key={note}>
                <span />
                <p>{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal screens-stage">
          <div className="screen-widget widget-top">
            <span className="mono">Pickup ETA</span>
            <strong>2 min</strong>
          </div>
          <div className="screen-widget widget-bottom">
            <span className="mono">Driver share</span>
            <strong>92%</strong>
          </div>

          <div className="showcase-phone phone-left">
            <div className="showcase-phone-bar">
              <div className="showcase-phone-pill" />
            </div>
            <div className="showcase-screen showcase-screen-soft">
              <div className="showcase-map-card">
                <div className="showcase-map-grid" />
                <div className="showcase-map-pin pin-a" />
                <div className="showcase-map-pin pin-b" />
                <div className="showcase-map-road" />
              </div>
              <div className="showcase-mini-stack">
                <div className="showcase-mini-card">
                  <span className="mono">Pickup</span>
                  <strong>12 Admiralty Way</strong>
                </div>
                <div className="showcase-mini-card">
                  <span className="mono">Destination</span>
                  <strong>Victoria Island Hub</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-phone phone-main">
            <div className="showcase-phone-bar dark">
              <div className="showcase-phone-pill" />
            </div>
            <div className="showcase-screen showcase-screen-main">
              <div className="showcase-app-top">
                <span className="showcase-badge mono">Rider App</span>
                <div className="showcase-avatar">W</div>
              </div>

              <div className="showcase-hero-card">
                <p className="mono">Where to?</p>
                <h3>Book your next Wheeler in seconds</h3>
                <div className="showcase-route-pill">
                  Marina pickup
                  <span />
                  Orange District
                </div>
              </div>

              <div className="showcase-status-card">
                <div>
                  <span className="mono">Now matching</span>
                  <strong>Toyota Camry • KSF 204 XR</strong>
                </div>
                <div className="showcase-status-dot" />
              </div>

              <div className="showcase-progress">
                <div className="showcase-progress-row active">
                  <span />
                  <div>
                    <strong>Driver confirmed</strong>
                    <p>Verified captain is on the way</p>
                  </div>
                </div>
                <div className="showcase-progress-row">
                  <span />
                  <div>
                    <strong>Trip tracking live</strong>
                    <p>Route, fare, and timing stay visible</p>
                  </div>
                </div>
                <div className="showcase-progress-row">
                  <span />
                  <div>
                    <strong>Payout ready</strong>
                    <p>Rewards and wallet update instantly</p>
                  </div>
                </div>
              </div>

              <div className="showcase-cta">Confirm ride</div>
            </div>
          </div>

          <div className="showcase-phone phone-right">
            <div className="showcase-phone-bar">
              <div className="showcase-phone-pill" />
            </div>
            <div className="showcase-screen showcase-screen-dark">
              <span className="showcase-badge mono">Driver Wallet</span>
              <div className="showcase-wallet-total">
                <p>Today&apos;s earnings</p>
                <strong>N12,400</strong>
              </div>
              <div className="showcase-wallet-chart">
                <span style={{ height: "38%" }} />
                <span style={{ height: "54%" }} />
                <span style={{ height: "72%" }} />
                <span style={{ height: "48%" }} />
                <span style={{ height: "84%" }} />
              </div>
              <div className="showcase-wallet-list">
                <div className="showcase-wallet-item">
                  <p>Trips completed</p>
                  <strong>14</strong>
                </div>
                <div className="showcase-wallet-item">
                  <p>Ownership rewards</p>
                  <strong>+4.2%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
