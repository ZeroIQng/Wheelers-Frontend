const featureRows = [
  [
    {
      id: "01",
      title: "Group Ride Booking",
      body: "Split a ride with friends, colleagues, or strangers heading the same way. One booking, multiple seats, shared cost.",
    },
    {
      id: "02",
      title: "Instant Seat Matching",
      body: "Radar finds riders going your direction in real time. Hop into a moving trip or start one — no waiting around.",
    },
    {
      id: "03",
      title: "Shared Fare Splitting",
      body: "Cost splits automatically between all passengers. Everyone pays their share. No awkward money conversations.",
    },
  ],
  [
    {
      id: "04",
      title: "Scheduled Group Rides",
      body: "Plan a ride in advance for your team, event, or daily commute. Everyone gets notified, everyone shows up.",
    },
    {
      id: "05",
      title: "Verified Drivers & Riders",
      body: "Every driver and rider on the platform is identity-verified before their first trip. Safe seats, every time.",
    },
    {
      id: "06",
      title: "Crypto Payments",
      body: "Pay with USDT or local currency. Seamless NGN-to-USDT conversion built in — no bank drama, just ride.",
    },
  ],
];

export default function Features() {
  return (
    <section className="feat-dark" id="features">
      <div className="feat-dark-inner section-inner">
       <div className="feat-intro">
          <div className="section-eyebrow">Platform features</div>
          <h2 className="dark-h2 clash-display">
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
