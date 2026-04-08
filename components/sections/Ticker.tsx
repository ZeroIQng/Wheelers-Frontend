const tickerItems = [
  ["RIDE", "Decentralized rides in seconds"],
  ["EARN", "Every trip earns $WHL tokens"],
  ["OWN", "Community-owned platform"],
  ["DEFI", "Your wallet, your earnings"],
  ["SAFE", "KYC-verified drivers only"],
  ["FAST", "30-second match guarantee"],
];

export default function Ticker() {
  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        {[...tickerItems, ...tickerItems].map(([label, text], index) => (
          <div className="ticker-item" key={`${label}-${index}`}>
            <span className="t-or">{label}</span>
            <div className="ticker-sep" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
