"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  transportChoice: string;
  priceImpact: string;
  rideHailingPain: string;
  evTrustTradeoff: string;
  ikejaLekkiPrice: string;
  rideSharingBehavior: string;
  groupRideAcceptance: string;
};

type StatusState =
  | { type: "idle"; message: string }
  | { type: "error"; message: string }
  | { type: "success"; message: string };

type Question = {
  id: keyof Omit<FormState, "name" | "email">;
  title: string;
  prompt: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: "transportChoice",
    title: "1. Transport choice",
    prompt: "Which best describes how you choose transportation?",
    options: [
      "My default is ride-hailing apps",
      "My default is public transport",
      "I choose based on price each time",
    ],
  },
  {
    id: "priceImpact",
    title: "2. Price sensitivity",
    prompt: "How do transport price increases affect your monthly budget?",
    options: [
      "I have to cut other expenses",
      "I feel it but manage",
      "Only major increases affect me",
      "It doesn’t affect me",
    ],
  },
  {
    id: "rideHailingPain",
    title: "3. Current ride-hailing pain",
    prompt: "What is your biggest issue with ride-hailing apps (Bolt, Uber, InDrive)?",
    options: [
      "Too expensive",
      "Prices are unpredictable",
      "Long wait times / driver cancellations",
      "Safety concerns",
      "I don’t use them — too expensive",
    ],
  },
  {
    id: "evTrustTradeoff",
    title: "4. EV adoption, trust and trade-off",
    prompt:
      "Would you use an electric ride service that is 30–40% cheaper with fixed prices, even if it may take 5–10 minutes longer?",
    options: [
      "Yes — I trust EVs and would use it immediately",
      "Yes — but I’d want to try it first",
      "Maybe — depends on how much I save",
      "No — I don’t want to wait longer",
      "No — I don’t trust EVs",
    ],
  },
  {
    id: "ikejaLekkiPrice",
    title: "5. Price expectation",
    prompt: "What would you expect to pay for a trip like Ikeja → Lekki?",
    options: [
      "₦3,000 — ₦5,000",
      "₦5,000 — ₦7,000",
      "₦7,000 — ₦9,000",
      "₦9,000+",
      "Not sure",
    ],
  },
  {
    id: "rideSharingBehavior",
    title: "6. Ride sharing behavior",
    prompt: "Have you ever shared a ride to reduce cost?",
    options: [
      "Yes — regularly",
      "Yes — occasionally",
      "No — but I would if it was easy",
      "No — I prefer riding alone",
    ],
  },
  {
    id: "groupRideAcceptance",
    title: "7. Group ride acceptance + concern",
    prompt:
      "Would you share a ride with a verified stranger (same gender, rated 4.5+) to save up to 60%? What concerns you most?",
    options: [
      "Yes — no concerns",
      "Yes — but concerned about safety",
      "Maybe — depends on situation",
      "No — I don’t want to share rides",
    ],
  },
];

const initialState: FormState = {
  name: "",
  email: "",
  transportChoice: "",
  priceImpact: "",
  rideHailingPain: "",
  evTrustTradeoff: "",
  ikejaLekkiPrice: "",
  rideSharingBehavior: "",
  groupRideAcceptance: "",
};

export default function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus({
          type: "error",
          message: result.message ?? "Something went wrong while submitting the form.",
        });
        return;
      }

      setForm(initialState);
      setStatus({
        type: "success",
        message: result.message ?? "Your response has been received.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <div className="waitlist-form-grid">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>
      </div>

      <div className="question-list">
        {questions.map((question) => (
          <fieldset className="question-card" key={question.id}>
            <legend>{question.title}</legend>
            <p>{question.prompt}</p>

            <div className="option-list">
              {question.options.map((option) => (
                <label className="option-item" key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={form[question.id] === option}
                    onChange={(event) => updateField(question.id, event.target.value)}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="waitlist-submit">
        <button className="btn-glow syne" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Get Early Access"}
        </button>
        {status.message ? (
          <p className={`form-status ${status.type}`}>{status.message}</p>
        ) : null}
      </div>
    </form>
  );
}
