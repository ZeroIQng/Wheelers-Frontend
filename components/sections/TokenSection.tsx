export default function TokenSection() {
  return (
    <section className="defi-wrap" id="token">
      <div className="defi-inner">
        <div className="reveal">
          <div className="section-label">Token Economy</div>
          <h2 className="section-h2">
            You don&apos;t just
            <br />
            use it. You <span className="accent">own</span> it.
          </h2>
          <p
            style={{
              marginTop: 18,
              fontSize: 15,
              color: "#555",
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            $WHL is the governance and rewards token of the Wheleers network. Every trip
            mints tokens. Stake to vote. Vote to shape the future of mobility.
          </p>

          <div className="defi-stats">
            {[
              ["Tokens earned per trip", "5-20 $WHL"],
              ["Total supply", "100M $WHL"],
              ["Community treasury", "40%"],
              ["Driver rewards pool", "35%"],
            ].map(([label, value]) => (
              <div className="defi-stat-row" key={label}>
                <span className="defi-stat-label">{label}</span>
                <span className="defi-stat-val">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="defi-visual reveal">
          <div className="token-ring" style={{ width: 180, height: 180 }} />
          <div
            className="token-ring"
            style={{ width: 260, height: 260, animationDirection: "reverse" }}
          />
          <div className="token-ring" style={{ width: 340, height: 340 }} />
          <div className="token-center">
            <div style={{ textAlign: "center" }}>
              <div className="syne" style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                W
              </div>
              <div className="mono" style={{ fontSize: 8, color: "rgba(255,255,255,.7)" }}>
                $WHL
              </div>
            </div>
          </div>
          <div className="token-sat" style={{ top: "10%", left: "62%" }}>
            Staking
          </div>
          <div className="token-sat" style={{ bottom: "18%", right: "2%" }}>
            Governance
          </div>
          <div className="token-sat" style={{ bottom: "8%", left: "4%" }}>
            Payments
          </div>
          <div className="token-sat" style={{ top: "8%", right: "12%" }}>
            Rewards
          </div>
        </div>
      </div>
    </section>
  );
}
