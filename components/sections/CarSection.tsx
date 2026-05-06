type CarSpriteProps = {
  tone: "orange" | "cream" | "dark";
};

function CarSprite({ tone }: CarSpriteProps) {
  const bodyFill =
    tone === "orange" ? "#ff5c00" : tone === "cream" ? "#fff3e7" : "#201611";
  const roofFill = tone === "orange" ? "#ff9252" : tone === "cream" ? "#ffe2cb" : "#3b2a22";
  const stroke = "#0d0d0d";

  return (
    <svg
      aria-hidden="true"
      className="car-sprite-svg"
      viewBox="0 0 210 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="104" cy="77" rx="82" ry="12" fill="rgba(13,13,13,0.14)" />
      <path
        d="M34 58L52 34C58 27 66 22 75 22H126C138 22 148 29 153 39L164 58H34Z"
        fill={bodyFill}
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M63 35C67 31 72 29 77 29H120C128 29 135 34 139 42L144 50H56L63 35Z"
        fill={roofFill}
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M57 50H143" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M76 31V50" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M114 31V50" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <rect x="18" y="54" width="22" height="11" rx="5.5" fill={bodyFill} stroke={stroke} strokeWidth="4" />
      <rect x="165" y="54" width="27" height="11" rx="5.5" fill={bodyFill} stroke={stroke} strokeWidth="4" />
      <circle cx="61" cy="70" r="16" fill="#111" stroke={stroke} strokeWidth="4" />
      <circle cx="61" cy="70" r="6" fill="#f6ede1" stroke={stroke} strokeWidth="4" />
      <circle cx="144" cy="70" r="16" fill="#111" stroke={stroke} strokeWidth="4" />
      <circle cx="144" cy="70" r="6" fill="#f6ede1" stroke={stroke} strokeWidth="4" />
      <path d="M26 59H40" stroke="#fff5eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M168 59H184" stroke="#ffd16d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function CarSection() {
  return (
    <section className="car-section car-section--full" id="carSection">
      <div className="car-stage car-stage--full" aria-hidden="true">
        <div className="car-cityline">
          <span className="tower short" />
          <span className="tower" />
          <span className="tower tall" />
          <span className="tower medium" />
          <span className="tower short" />
          <span className="tower tall" />
          <span className="tower" />
          <span className="tower medium" />
          <span className="tower short" />
          <span className="tower tall" />
        </div>

        {/* <div className="car-stage-badge">
          <span className="mono">Wheelers NETWORK</span>
          <strong>Every ride, every block, always moving.</strong>
        </div> */}

        <div className="car-road-surface road-surface-top">
          <div className="lane-glow" />
          <div className="lane-markers lane-markers-right" />

          <div className="traffic-row row-right row-fast">
            <CarSprite tone="orange" />
          </div>

          <div className="traffic-row row-right row-slow">
            <CarSprite tone="cream" />
          </div>
        </div>

        <div className="car-road-surface road-surface-bottom">
          <div className="lane-glow" />
          <div className="lane-markers lane-markers-left" />

          <div className="traffic-row row-left row-mid">
            <CarSprite tone="dark" />
          </div>

          <div className="traffic-row row-left row-late">
            <CarSprite tone="orange" />
          </div>
        </div>

        <div className="car-pulse-ring ring-one" />
        <div className="car-pulse-ring ring-two" />
      </div>
    </section>
  );
}