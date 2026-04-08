const miniScreenTitles = ["Splash", "Role Select", "OTP", "Map", "Matching", "Wallet"];

export default function AppScreensSection() {
  return (
    <section className="screens-wrap">
      <div className="screens-inner">
        <div className="reveal">
          <div className="section-label">The App</div>
          <h2 className="section-h2">
            37 screens. <span className="accent">One mission.</span>
          </h2>
          <p style={{ marginTop: 12, color: "#666", fontSize: 15, maxWidth: 560 }}>
            Every pixel crafted to get you moving, from splash to payout, from map to
            wallet.
          </p>
        </div>
      </div>

      <div className="screens-scroll">
        {miniScreenTitles.map((title) => (
          <div className="mini-phone" key={title}>
            <div className="mini-phone-bar">
              <div className="mini-phone-pill" />
            </div>
            <div
              className="mini-screen"
              style={{
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  title === "Map"
                    ? "linear-gradient(160deg,#d4e6d4,#c8dcc8)"
                    : title === "OTP"
                      ? "#0d0d0d"
                      : "var(--ow)",
                color: title === "OTP" ? "var(--ow)" : "var(--bk)",
              }}
            >
              <div className="syne" style={{ fontWeight: 800, textAlign: "center" }}>
                {title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
