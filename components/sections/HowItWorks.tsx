"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    title: "Choose your role",
    body: "Sign up as a rider or driver. Connect your Web3 wallet or use traditional login, your choice, no pressure.",
  },
  {
    title: "Verify your identity",
    body: "Quick KYC in under 3 minutes. Phone verification and ID check keeps the platform safe for everyone.",
  },
  {
    title: "Book or go online",
    body: "Riders set a destination and get matched instantly. Drivers toggle online and jobs come to them.",
  },
  {
    title: "Earn ownership",
    body: "Every trip earns $WHL tokens. Accumulate stake. Vote on the platform. Own a piece of the future.",
  },
];

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentStep((current) => (current + 1) % steps.length);
    }, 3800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hiw-dark" id="how">
      <div className="hiw-dark-inner section-inner">
        <div>
          <div className="reveal" style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">How it works</div>
            <h2 className="dark-h2">
              From signup
              <br />
              to <em>first ride</em>
              <br />
              in minutes
            </h2>
          </div>

          <div className="hiw-steps">
            {steps.map((step, index) => (
              <button
                className={`hiw-step-d ${currentStep === index ? "active" : ""}`}
                key={step.title}
                onClick={() => setCurrentStep(index)}
                type="button"
              >
                <div className="hiw-bar" />
                <div className="hiw-num-d syne">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <div className="hiw-step-title">{step.title}</div>
                  <div className="hiw-step-body">{step.body}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="hiw-visual reveal">
          <div className="hiw-visual-glow" />
          {steps.map((step, index) => (
            <div className={`hiw-panel ${currentStep === index ? "active" : ""}`} key={step.title}>
              <div style={{ width: 240, textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: ".18em", color: "var(--dmuted)", marginBottom: 10 }}>
                  STEP {String(index + 1).padStart(2, "0")}
                </div>
                <div className="syne" style={{ fontSize: 28, lineHeight: 1, marginBottom: 10 }}>
                  {step.title.toUpperCase()}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--dmuted)" }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
