import Link from "next/link";

const cards = [
  {
    id: "01",
    icon: "R",
    title: "FOR RIDERS",
    body:
      "Book in seconds. Every trip earns $WHL tokens, building your stake in the network that moves you. Transparent pricing. No surge surprises.",
    perks: [
      "Instant 30-second driver match",
      // "Earn tokens on every trip",
      "Live GPS tracking throughout",
      "Pay with wallet or card",
    ],
    cta: "Get the app ->",
  },
  {
    id: "02",
    icon: "D",
    title: "FOR DRIVERS",
    body:
      "No middleman taking 30%. Drive when you want, earn what you deserve. Direct wallet payouts. The road is yours, and now so is the platform.",
    perks: [
      "Industry-lowest commission rate",
      "Instant wallet withdrawals",
      // "$WHL token bonuses",
      "Referral income stream",
    ],
    cta: "Start driving ->",
  },
];

export default function WhoSection() {
  return (
    <section className="who-dark" id="riders">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-eyebrow">Who it&apos;s for</div>
          <h2 className="dark-h2">
            Two sides of
            <br />
            the <em>same road</em>
          </h2>
        </div>

        <div className="who-cards" id="drivers">
          {cards.map((card) => (
            <div className="who-d-card reveal" key={card.id}>
              <div className="who-d-num">{card.id}</div>
              <div className="who-d-icon">{card.icon}</div>
              <div className="who-d-title">{card.title}</div>
              <p className="who-d-body">{card.body}</p>

              <div className="who-perks">
                {card.perks.map((perk) => (
                  <div className="who-perk" key={perk}>
                    <div className="perk-dot-d" />
                    {perk}
                  </div>
                ))}
              </div>

              <Link href="#cta" className="who-d-cta">
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
