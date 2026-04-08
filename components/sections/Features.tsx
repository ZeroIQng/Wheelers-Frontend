const featureRows = [
  [
    {
      id: "01",
      title: "30-Second Match",
      body: "Radar-powered driver discovery connects you to the nearest verified driver in under 30 seconds. Every time.",
    },
    {
      id: "02",
      title: "KYC-Verified Safety",
      body: "Every driver passes identity and document verification before taking their first trip. Safety is non-negotiable.",
    },
    {
      id: "03",
      title: "$WHL Token Rewards",
      body: "Earn governance tokens on every ride. Stake them, vote on the platform's future, or trade them freely.",
    },
  ],
  [
    {
      id: "04",
      title: "Live Navigation",
      body: "Turn-by-turn routing for drivers. Real-time ETA sharing for riders. Everyone stays in the loop.",
    },
    {
      id: "05",
      title: "Emergency SOS",
      body: "One tap shares live location with emergency contacts and dispatches alerts instantly. Peace of mind, always on.",
    },
    {
      id: "06",
      title: "Schedule Rides",
      body: "Book future rides. Set recurring commutes. Wheleers works around your schedule, not the other way around.",
    },
  ],
];

export default function Features() {
  return (
    <section className="feat-dark" id="features">
      <div className="feat-dark-inner section-inner">
        <div className="reveal feat-intro">
          <div className="section-eyebrow">Platform features</div>
          <h2 className="dark-h2">
            Built for
            <br />
            the <em>next era</em>
          </h2>
        </div>

        {featureRows.map((row, index) => (
          <div className={`feat-grid-d reveal ${index === 1 ? "feat-row-2" : ""}`} key={index}>
            {row.map((feature) => (
              <div className="feat-item-d" key={feature.id}>
                <div className="feat-num-d">{feature.id}</div>
                <div className="feat-title-d">{feature.title}</div>
                <p className="feat-body-d">{feature.body}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
