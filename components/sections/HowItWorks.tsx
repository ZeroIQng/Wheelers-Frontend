"use client";

import { useEffect, useState } from "react";
const steps = [
  {
    title: "Choose your role",
    body: "Pick whether you want to ride or drive. One tap, then hit Continue.",
    img: "/hiw-1.png",
  },
  {
    title: "See your city",
    body: "Your home screen loads with a live map, nearby drivers, and your ride history ready to go.",
    img: "/hiw-2.png",
  },
  {
    title: "Find your ride",
    body: "Search your destination, pick a ride type and see the price and ETA upfront.",
    img: "/hiw-3.png",
  },
  {
    title: "Driver matched",
    body: "Get matched with a verified driver and track your ride in real time.",
    img: "/hiw-4.png",
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
          <div style={{ marginBottom: 40 }}>
            <div className="section-eyebrow">How it works</div>
            <h2 className="dark-h2 clash-display">
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
                className={`hiw-step-d ${
                  currentStep === index ? "active" : ""
                }`}
                key={step.title}
                onClick={() => setCurrentStep(index)}
                type="button"
              >
                <div className="hiw-bar" />

                <div className="hiw-num-d syne">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <div className="hiw-step-title">{step.title}</div>
                  <div className="hiw-step-body">{step.body}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="hiw-visual">
          {steps.map((step, index) => (
            <div
              className={`hiw-panel ${currentStep === index ? "active" : ""}`}
              key={step.title}
            >
              <img
                src={step.img}
                alt={step.title}
                className="hiw-phone-img"
                width={320}
                height={652}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
