"use client";

import type { WaitlistQuestionId } from "@/lib/waitlist";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const MAX_WORDS = 250;

type QuestionThoughts = Record<WaitlistQuestionId, string>;

type FormState = {
  name: string;
  email: string;
  phone: string;
  transportChoice: string[];
  priceImpact: string[];
  rideHailingPain: string[];
  evTrustTradeoff: string[];
  ikejaLekkiPrice: string[];
  rideSharingBehavior: string[];
  groupRideAcceptance: string[];
  questionThoughts: QuestionThoughts;
  optionalFeedback: string;
  allowContact: boolean;
};

type Question = {
  id: WaitlistQuestionId;
  number: string;
  title: string;
  prompt: string;
  options: string[];
  thoughtPlaceholder: string;
};

const questions: Question[] = [
  {
    id: "transportChoice",
    number: "01",
    title: "Transport Choice",
    prompt: "Which best describes how you choose transportation?",
    thoughtPlaceholder:
      "Tell us why you choose transport this way. What usually affects your decision?",
    options: [
      "My default is ride-hailing apps",
      "My default is public transport",
      "I choose based on price each time",
      "I use ride-hailing mainly when I’m in a hurry or running late",
      "I use ride-hailing mainly for long or unfamiliar trips (e.g., going to the Island)",
    ],
  },
  {
    id: "priceImpact",
    number: "02",
    title: "Price Sensitivity",
    prompt: "How do transport price increases affect your monthly budget?",
    thoughtPlaceholder:
      "Tell us how price changes affect your spending, movement, or plans.",
    options: [
      "I have to cut other expenses",
      "I feel it but manage",
      "Only major increases affect me",
      "It doesn’t affect me",
    ],
  },
  {
    id: "rideHailingPain",
    number: "03",
    title: "Current Ride-Hailing Pain",
    prompt: "What is your biggest issue with ride-hailing apps (Bolt, Uber, InDrive)?",
    thoughtPlaceholder:
      "Tell us what frustrates you most about current ride-hailing apps.",
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
    number: "04",
    title: "EV Adoption, Trust & Trade-off",
    prompt:
      "Would you use an electric ride service that is 30–40% cheaper with fixed prices, even if it may take 5–10 minutes longer?",
    thoughtPlaceholder:
      "Tell us what would make you trust or reject an electric ride service.",
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
    number: "05",
    title: "Price Expectation",
    prompt: "What would you expect to pay for a trip like Ikeja → Lekki?",
    thoughtPlaceholder:
      "Tell us what price would feel fair, cheap, or too expensive for that route.",
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
    number: "06",
    title: "Ride Sharing Behavior",
    prompt: "Have you ever shared a ride to reduce cost?",
    thoughtPlaceholder:
      "Tell us your experience with sharing rides, or why you would/would not do it.",
    options: [
      "Yes — regularly",
      "Yes — occasionally",
      "No — but I would if it was easy",
      "No — I prefer riding alone",
    ],
  },
  {
    id: "groupRideAcceptance",
    number: "07",
    title: "Group Ride Acceptance + Concern",
    prompt:
      "Would you share a ride with a verified stranger (same gender, rated 4.5+) to save up to 60%? What concerns you most?",
    thoughtPlaceholder:
      "Tell us your biggest concern: safety, comfort, timing, privacy, or something else.",
    options: [
      "Yes — no concerns",
      "Yes — but concerned about safety",
      "Maybe — depends on situation",
      "No — I don’t want to share rides",
    ],
  },
];

const emptyThoughts: QuestionThoughts = {
  transportChoice: "",
  priceImpact: "",
  rideHailingPain: "",
  evTrustTradeoff: "",
  ikejaLekkiPrice: "",
  rideSharingBehavior: "",
  groupRideAcceptance: "",
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  transportChoice: [],
  priceImpact: [],
  rideHailingPain: [],
  evTrustTradeoff: [],
  ikejaLekkiPrice: [],
  rideSharingBehavior: [],
  groupRideAcceptance: [],
  questionThoughts: emptyThoughts,
  optionalFeedback: "",
  allowContact: false,
};

function countWords(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function limitToWords(value: string, maxWords: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return value;
  }

  return words.slice(0, maxWords).join(" ");
}

function requiredLabel(text: string) {
  return (
    <>
      {text} <span className="required-mark">*</span>
    </>
  );
}

function findFirstIncompleteSection(form: FormState) {
  return questions.find((question) => form[question.id].length === 0) ?? null;
}

export default function WaitlistPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const optionalFeedbackWords = useMemo(
    () => countWords(form.optionalFeedback),
    [form.optionalFeedback]
  );

  function updateTextField(
    field: "name" | "email" | "phone",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateOptionalFeedback(value: string) {
    const limitedValue = limitToWords(value, MAX_WORDS);

    setForm((current) => ({
      ...current,
      optionalFeedback: limitedValue,
    }));
  }

  function updateQuestionThought(field: WaitlistQuestionId, value: string) {
    const limitedValue = limitToWords(value, MAX_WORDS);

    setForm((current) => ({
      ...current,
      questionThoughts: {
        ...current.questionThoughts,
        [field]: limitedValue,
      },
    }));
  }

  function selectOption(field: WaitlistQuestionId, option: string) {
    setForm((current) => {
      return {
        ...current,
        [field]: [option],
      };
    });
  }

  function toggleAllowContact() {
    setForm((current) => ({
      ...current,
      allowContact: !current.allowContact,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your name and email before submitting.",
      });
      return;
    }

    if (!form.allowContact) {
      setStatus({
        type: "error",
        message: "Please tick the contact consent checkbox before submitting.",
      });
      return;
    }

    const incompleteSection = findFirstIncompleteSection(form);

    if (incompleteSection) {
      setStatus({
        type: "error",
        message: `Please complete the ${incompleteSection.title} section before submitting.`,
      });
      return;
    }

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
          message: result.message ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: result.message ?? "You’re on the waitlist. Welcome to Wheleers.",
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
    <main className="waitlist-page">
      <div className="hero-grid-bg" />

      <nav className="waitlist-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-orb">
            <span className="clash-display">W</span>
          </div>
          <span className="nav-brand clash-display">WHELEERS</span>
        </Link>

        <Link href="/" className="waitlist-back-btn">
          Back home
        </Link>
      </nav>

      <section className="waitlist-hero section-inner">
        <div className="section-eyebrow">Early Access</div>

        <h1 className="waitlist-title syne clash-display">
          Join the waitlist.
          <br />
          Help shape the <em>future ride.</em>
        </h1>

        <p className="waitlist-lead">
          Answer a few quick questions so we can understand how people move,
          what they pay, and what would make a cheaper shared EV ride actually work.
        </p>
      </section>

      <section className="waitlist-form-section section-inner">
        <form className="waitlist-form" onSubmit={handleSubmit}>
          <div className="waitlist-form-grid">
            <label className="waitlist-field">
              <span>{requiredLabel("Name")}</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(event) => updateTextField("name", event.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="waitlist-field">
              <span>{requiredLabel("Email")}</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(event) => updateTextField("email", event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="waitlist-field waitlist-field-full">
              <span>Phone number</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(event) => updateTextField("phone", event.target.value)}
                placeholder="+234..."
              />
            </label>
          </div>

          <div className="waitlist-question-stack">
            {questions.map((question) => {
              const thoughtValue = form.questionThoughts[question.id];
              const wordCount = countWords(thoughtValue);

              return (
                <fieldset className="question-card" key={question.id}>
                  <div className="question-top">
                    <span className="question-number mono">{question.number}</span>

                    <div>
                      <legend>{requiredLabel(question.title)}</legend>
                      <p>{question.prompt}</p>
                    </div>
                  </div>

                  <div className="option-list">
                    {question.options.map((option, optionIndex) => {
                      const checked = form[question.id][0] === option;
                      const inputId = `${question.id}-${optionIndex}`;

                      return (
                        <label
                          htmlFor={inputId}
                          className={`option-item ${checked ? "selected" : ""}`}
                          key={option}
                        >
                          <input
                            id={inputId}
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={checked}
                            onChange={() => selectOption(question.id, option)}
                          />

                          <span className="fake-option-check" aria-hidden="true">
                            <span className="fake-option-check-mark">✓</span>
                          </span>

                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>

                  <label className="waitlist-field question-thought-field">
                    {/* <span>Your thoughts (optional)</span> */}

                    <textarea
                      name={`${question.id}Thoughts`}
                      value={thoughtValue}
                      onChange={(event) =>
                        updateQuestionThought(question.id, event.target.value)
                      }
                      placeholder={question.thoughtPlaceholder}
                      rows={4}
                    />

                    <small className="word-counter">{wordCount}/{MAX_WORDS}</small>
                  </label>
                </fieldset>
              );
            })}
          </div>

          <label className="waitlist-field waitlist-field-full">
            <span>Anything else you want to tell us? (optional)</span>

            <textarea
              name="optionalFeedback"
              value={form.optionalFeedback}
              onChange={(event) => updateOptionalFeedback(event.target.value)}
              placeholder="Tell us what would make you trust or use Wheleers..."
              rows={5}
            />

            <small className="word-counter">
              {optionalFeedbackWords}/{MAX_WORDS}
            </small>
          </label>

          <label className="optional-check">
            <input
              type="checkbox"
              name="allowContact"
              checked={form.allowContact}
              onChange={toggleAllowContact}
              aria-required="true"
            />

            <span className="fake-checkbox" aria-hidden="true" />

            <span>
              {requiredLabel("I’m okay with Wheleers contacting me for early access, testing, or follow-up questions.")}
            </span>
          </label>

          {status.message && (
            <div className={`waitlist-status ${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="waitlist-submit">
            <button className="btn-glow syne" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Join the waitlist →"}
            </button>

            <p>
              Your answers help us build cheaper, safer, and more useful rides
              for Lagos.
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
