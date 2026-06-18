"use client";

import type { DriverQuestionId } from "@/lib/drivers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const MAX_WORDS = 250;

/* ── section‑level types ─────────────────────────────────── */

type QuestionThoughts = Record<DriverQuestionId, string>;

type FormState = {
  name: string;
  email: string;
  phone: string;
  currentlyDriving: string[];
  platforms: string[];
  mostUsedPlatform: string[];
  ownsVehicle: string[];
  vehicleArrangement: string[];
  dailyRides: string[];
  weeklyRevenue: string[];
  weeklyProfit: string[];
  operatingLocation: string[];
  sweetSpotArea: string;
  evEarningsBeliefs: string[];
  leaseWillingness: string[];
  leaseRejectionReason: string[];
  platformPainPoints: string[];
  fairCommission: string[];
  vehicleOwnershipImportance: string[];
  evTransitionSupport: string[];
  additionalComments: string;
  questionThoughts: QuestionThoughts;
  allowContact: boolean;
};

type Question = {
  id: DriverQuestionId;
  number: string;
  title: string;
  prompt: string;
  options: string[];
  thoughtPlaceholder: string;
  multiSelect?: boolean;
  maxSelect?: number;
  tooltip?: string;
  hasOtherOption?: boolean;
  section?: string;
  /** If set, question is only shown when condition is met */
  showWhen?: (form: FormState) => boolean;
  /** If true, this is a free-text-only question (no options) */
  freeTextOnly?: boolean;
};

/* ── survey questions ────────────────────────────────────── */

const questions: Question[] = [
  // Section 1: Driver Profile & Current Status
  {
    id: "currentlyDriving",
    number: "01",
    title: "Current Ride-Hailing Status",
    section: "Driver Profile & Current Status",
    prompt: "Are you currently engaged in ride-hailing?",
    thoughtPlaceholder: "",
    options: ["Yes", "No"],
  },
  {
    id: "platforms",
    number: "02",
    title: "Current Platforms",
    section: "Driver Profile & Current Status",
    prompt:
      "Which platform(s) do you currently drive for? (Select all that apply)",
    thoughtPlaceholder: "",
    multiSelect: true,
    maxSelect: 5,
    hasOtherOption: true,
    options: ["Uber", "Bolt", "InDriver", "LagRide"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "mostUsedPlatform",
    number: "03",
    title: "Most Used Platform",
    section: "Driver Profile & Current Status",
    prompt: "Which platform do you use the most?",
    thoughtPlaceholder: "",
    options: ["Uber", "Bolt", "InDriver", "LagRide"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "ownsVehicle",
    number: "04",
    title: "Vehicle Ownership",
    section: "Driver Profile & Current Status",
    prompt: "Do you own the vehicle you currently drive?",
    thoughtPlaceholder: "",
    options: ["Yes", "No"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "vehicleArrangement",
    number: "05",
    title: "Vehicle Arrangement",
    section: "Driver Profile & Current Status",
    prompt: "What arrangement are you currently using?",
    thoughtPlaceholder: "",
    hasOtherOption: true,
    options: [
      "Daily/weekly vehicle rental (hire purchase)",
      "Monthly lease from fleet owner",
      "Driving for a fleet owner (salary/commission-based)",
    ],
    showWhen: (form) =>
      form.currentlyDriving.includes("Yes") &&
      form.ownsVehicle.includes("No"),
  },

  // Section 2: Financial Performance
  {
    id: "dailyRides",
    number: "06",
    title: "Average Daily Rides",
    section: "Financial Performance",
    prompt: "How many rides do you complete on an average day?",
    thoughtPlaceholder: "",
    options: ["1–5", "6–10", "11–15", "16–20", "20+"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "weeklyRevenue",
    number: "07",
    title: "Weekly Revenue",
    section: "Financial Performance",
    prompt:
      "What is your average weekly revenue? (Total earnings before deducting operational costs such as platform fees, fuel, maintenance, and any lease/rental payments)",
    thoughtPlaceholder: "",
    options: [
      "₦10,000 – ₦25,000",
      "₦25,001 – ₦50,000",
      "₦50,001 – ₦75,000",
      "₦75,001 – ₦100,000",
      "₦100,000+",
    ],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "weeklyProfit",
    number: "08",
    title: "Weekly Profit",
    section: "Financial Performance",
    prompt:
      "What is your average weekly profit? (Revenue minus all operational costs including fuel, maintenance, platform fees, and vehicle rental/lease payments)",
    thoughtPlaceholder: "",
    options: [
      "₦0 – ₦10,000",
      "₦10,001 – ₦25,000",
      "₦25,001 – ₦50,000",
      "₦50,001 – ₦75,000",
      "₦75,000+",
    ],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },

  // Section 3: Location & Operations
  {
    id: "operatingLocation",
    number: "09",
    title: "Operating Location",
    section: "Location & Operations",
    prompt: "Where do you currently stay / operate from?",
    thoughtPlaceholder: "",
    hasOtherOption: true,
    options: ["Lagos Island", "Lagos Mainland", "Abuja", "Port Harcourt"],
  },
  {
    id: "sweetSpotArea",
    number: "10",
    title: "Sweet Spot Area",
    section: "Location & Operations",
    prompt:
      'What is your preferred "sweet spot" area — the location where you find the most profitable and consistent rides?',
    thoughtPlaceholder:
      "Tell us the area or route where you get the best rides...",
    options: [],
    freeTextOnly: true,
  },

  // Section 4: EV Interest & Lease Willingness
  {
    id: "evEarningsBeliefs",
    number: "11",
    title: "EV Earnings Potential",
    section: "EV Interest & Lease Willingness",
    prompt:
      "Do you believe you would earn more if you switched to an electric vehicle (EV)? (Consider: lower fuel costs, reduced maintenance, potential higher demand)",
    thoughtPlaceholder: "",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "leaseWillingness",
    number: "12",
    title: "Lease Willingness",
    section: "EV Interest & Lease Willingness",
    prompt:
      "Would you be willing to take a vehicle lease for 24–36 months, with the option to own the vehicle at the end of the lease period?",
    thoughtPlaceholder: "",
    options: ["Yes", "No", "I need more information"],
    showWhen: (form) =>
      form.evEarningsBeliefs.includes("Yes") ||
      form.evEarningsBeliefs.includes("Not sure"),
  },
  {
    id: "leaseRejectionReason",
    number: "13",
    title: "Lease Concern",
    section: "EV Interest & Lease Willingness",
    prompt: "What is your primary reason for not taking the lease?",
    thoughtPlaceholder: "",
    hasOtherOption: true,
    options: [
      "Lease duration is too long (24–36 months)",
      "Concerns about EV charging infrastructure",
      "Doubt about EV reliability in Nigeria",
      "Cannot afford the weekly/monthly lease payments",
      "Prefer to own a vehicle outright from the start",
      "Worried about maintenance and repair costs for EVs",
    ],
    showWhen: (form) => form.leaseWillingness.includes("No"),
  },

  // Section 5: Platform Experience & Fairness
  {
    id: "platformPainPoints",
    number: "14",
    title: "Platform Pain Points",
    section: "Platform Experience & Fairness",
    prompt:
      "What is your biggest pain point with your current ride-hailing platform(s)? (Select all that apply)",
    thoughtPlaceholder: "",
    multiSelect: true,
    maxSelect: 9,
    hasOtherOption: true,
    options: [
      "High platform commission fees",
      "Unfair pricing / low fares",
      "Lack of driver support / poor customer service",
      "Delayed or inconsistent payouts",
      "Rider misconduct / safety concerns",
      "Vehicle maintenance costs",
      "Fuel price volatility",
      "No benefits or insurance coverage",
    ],
  },
  {
    id: "fairCommission",
    number: "15",
    title: "Fair Commission",
    section: "Platform Experience & Fairness",
    prompt:
      "What platform commission fee do you consider fair and sustainable for you as a driver?",
    thoughtPlaceholder: "",
    hasOtherOption: true,
    options: [
      "10% or less",
      "15%",
      "20%",
      "25%",
      "30% (current industry standard)",
    ],
  },

  // Section 6: Additional Feedback
  {
    id: "vehicleOwnershipImportance",
    number: "16",
    title: "Vehicle Ownership Goal",
    section: "Additional Feedback",
    prompt: "How important is vehicle ownership to you as a long-term goal?",
    thoughtPlaceholder: "",
    options: [
      "Very important — I want to own my vehicle",
      "Somewhat important",
      "Not important — I prefer flexibility",
    ],
  },
  {
    id: "evTransitionSupport",
    number: "17",
    title: "EV Transition Support",
    section: "Additional Feedback",
    prompt:
      "What support would you need from Wheelers to make the EV transition successful? (Select all that apply)",
    thoughtPlaceholder: "",
    multiSelect: true,
    maxSelect: 7,
    hasOtherOption: true,
    options: [
      "Guaranteed charging stations / charging support",
      "Maintenance and repair coverage during lease",
      "Driver training on EV operation",
      "Insurance coverage",
      "Flexible lease payment terms",
      "Guaranteed minimum daily earnings",
    ],
  },
  {
    id: "additionalComments",
    number: "18",
    title: "Additional Comments",
    section: "Additional Feedback",
    prompt: "Any additional comments or suggestions for Wheelers?",
    thoughtPlaceholder: "Share any thoughts, concerns, or ideas with us...",
    options: [],
    freeTextOnly: true,
  },
];

/* ── initial state ───────────────────────────────────────── */

const emptyThoughts: QuestionThoughts = {
  currentlyDriving: "",
  platforms: "",
  mostUsedPlatform: "",
  ownsVehicle: "",
  vehicleArrangement: "",
  dailyRides: "",
  weeklyRevenue: "",
  weeklyProfit: "",
  operatingLocation: "",
  sweetSpotArea: "",
  evEarningsBeliefs: "",
  leaseWillingness: "",
  leaseRejectionReason: "",
  platformPainPoints: "",
  fairCommission: "",
  vehicleOwnershipImportance: "",
  evTransitionSupport: "",
  additionalComments: "",
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  currentlyDriving: [],
  platforms: [],
  mostUsedPlatform: [],
  ownsVehicle: [],
  vehicleArrangement: [],
  dailyRides: [],
  weeklyRevenue: [],
  weeklyProfit: [],
  operatingLocation: [],
  sweetSpotArea: "",
  evEarningsBeliefs: [],
  leaseWillingness: [],
  leaseRejectionReason: [],
  platformPainPoints: [],
  fairCommission: [],
  vehicleOwnershipImportance: [],
  evTransitionSupport: [],
  additionalComments: "",
  questionThoughts: emptyThoughts,
  allowContact: false,
};

/* ── helpers ─────────────────────────────────────────────── */

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

function TooltipIcon({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="tooltip-wrapper">
      <button
        type="button"
        className={`tooltip-trigger ${visible ? "is-open" : ""}`}
        aria-label="More information"
        aria-expanded={visible}
        onClick={() => setVisible((current) => !current)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        ?
      </button>

      {visible && (
        <span className="tooltip-bubble" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}

/* ── component ───────────────────────────────────────────── */

export default function DriversPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [otherValues, setOtherValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const additionalCommentsWords = useMemo(
    () => countWords(form.additionalComments),
    [form.additionalComments],
  );

  /* ── updaters ──────────────────────────────────────────── */

  function updateTextField(field: "name" | "email" | "phone", value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateFreeTextField(
    field: "sweetSpotArea" | "additionalComments",
    value: string,
  ) {
    const limitedValue = limitToWords(value, MAX_WORDS);

    setForm((current) => ({
      ...current,
      [field]: limitedValue,
    }));
  }

  function updateQuestionThought(field: DriverQuestionId, value: string) {
    const limitedValue = limitToWords(value, MAX_WORDS);

    setForm((current) => ({
      ...current,
      questionThoughts: {
        ...current.questionThoughts,
        [field]: limitedValue,
      },
    }));
  }

  function selectOption(
    field: DriverQuestionId,
    option: string,
    multiSelect?: boolean,
    maxSelect?: number,
  ) {
    setForm((current) => {
      if (!multiSelect) {
        return { ...current, [field]: [option] };
      }

      const currentSelections: string[] = current[field] as string[];
      const alreadySelected = currentSelections.includes(option);

      if (alreadySelected) {
        return {
          ...current,
          [field]: currentSelections.filter((item) => item !== option),
        };
      }

      const cap = maxSelect ?? 2;

      if (currentSelections.length >= cap) {
        return current;
      }

      return {
        ...current,
        [field]: [...currentSelections, option],
      };
    });
  }

  function toggleOtherOption(field: DriverQuestionId, multiSelect?: boolean) {
    const otherText = otherValues[field]?.trim();
    const otherOption = otherText ? `Other: ${otherText}` : "Other";

    setForm((current) => {
      const currentSelections: string[] = current[field] as string[];
      const existingOther = currentSelections.find((s) =>
        s.startsWith("Other"),
      );

      if (existingOther) {
        return {
          ...current,
          [field]: currentSelections.filter((s) => !s.startsWith("Other")),
        };
      }

      if (!multiSelect) {
        return { ...current, [field]: [otherOption] };
      }

      return {
        ...current,
        [field]: [...currentSelections, otherOption],
      };
    });
  }

  function updateOtherText(field: DriverQuestionId) {
    const otherText = otherValues[field]?.trim();
    const otherOption = otherText ? `Other: ${otherText}` : "Other";

    setForm((current) => {
      const currentSelections: string[] = current[field] as string[];
      const hasOther = currentSelections.some((s) => s.startsWith("Other"));

      if (!hasOther) return current;

      return {
        ...current,
        [field]: currentSelections.map((s) =>
          s.startsWith("Other") ? otherOption : s,
        ),
      };
    });
  }

  function toggleAllowContact() {
    setForm((current) => ({
      ...current,
      allowContact: !current.allowContact,
    }));
  }

  /* ── visible questions ─────────────────────────────────── */

  const visibleQuestions = questions.filter(
    (q) => !q.showWhen || q.showWhen(form),
  );

  /* ── section grouping for display ──────────────────────── */

  const sections: { label: string; questions: Question[] }[] = [];

  for (const question of visibleQuestions) {
    const sectionLabel = question.section ?? "";
    const last = sections[sections.length - 1];

    if (last && last.label === sectionLabel) {
      last.questions.push(question);
    } else {
      sections.push({ label: sectionLabel, questions: [question] });
    }
  }

  /* ── submit ────────────────────────────────────────────── */

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
        message:
          "Please tick the contact consent checkbox before submitting.",
      });
      return;
    }

    // Validate all visible questions with options are answered
    for (const question of visibleQuestions) {
      if (question.freeTextOnly) continue;

      const selections = form[question.id];

      if (Array.isArray(selections) && selections.length === 0) {
        setStatus({
          type: "error",
          message: `Please complete the ${question.title} section before submitting.`,
        });
        return;
      }
    }

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/drivers", {
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
          message:
            result.message ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setForm(initialForm);
      setOtherValues({});
      setStatus({
        type: "success",
        message:
          result.message ??
          "Thanks for your interest. Welcome to the Wheelers Driver Partnership.",
      });
      router.replace("/");
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  /* ── render ────────────────────────────────────────────── */

  return (
    <main className="waitlist-page">
      <div className="hero-grid-bg" />

      <nav className="waitlist-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-orb">
            <span className="clash-display clash-display--mark">W</span>
          </div>

          <span className="nav-brand clash-display clash-display--brand">
            Wheelers
          </span>
        </Link>

        <Link href="/" className="waitlist-back-btn">
          Back home
        </Link>
      </nav>

      <section className="waitlist-hero section-inner">
        <div className="section-eyebrow">Driver Partnership</div>

        <h1 className="waitlist-title syne clash-display clash-display--waitlist-title">
          Drive the <em>future.</em>
          <br />
          Own your <em>vehicle.</em>
        </h1>

        <p className="waitlist-lead">
          Help us understand how drivers move, earn, and what would make an
          EV lease-to-own partnership work for you. Your answers shape how we
          build a fairer ride-hailing platform.
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
                onChange={(event) =>
                  updateTextField("name", event.target.value)
                }
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
                onChange={(event) =>
                  updateTextField("email", event.target.value)
                }
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
                onChange={(event) =>
                  updateTextField("phone", event.target.value)
                }
                placeholder="+234..."
              />
            </label>
          </div>

          <div className="waitlist-question-stack">
            {sections.map((section) => (
              <div key={section.label}>
                {section.label && (
                  <div className="drivers-section-label">
                    {section.label}
                  </div>
                )}

                {section.questions.map((question) => {
                  const selections: string[] = form[question.id] as string[];
                  const isOtherSelected =
                    Array.isArray(selections) &&
                    selections.some((s) => s.startsWith("Other"));

                  if (question.freeTextOnly) {
                    const freeTextField = question.id as
                      | "sweetSpotArea"
                      | "additionalComments";
                    const freeTextValue =
                      form[freeTextField] as string;
                    const wordCount = countWords(freeTextValue);

                    return (
                      <fieldset
                        className="question-card"
                        key={question.id}
                      >
                        <div className="question-top">
                          <span className="question-number mono">
                            {question.number}
                          </span>

                          <div>
                            <legend className="question-legend">
                              <span>{question.title}</span>

                              {question.tooltip && (
                                <TooltipIcon text={question.tooltip} />
                              )}
                            </legend>

                            <p>{question.prompt}</p>
                          </div>
                        </div>

                        <label className="waitlist-field question-thought-field">
                          <textarea
                            name={question.id}
                            value={freeTextValue}
                            onChange={(event) =>
                              updateFreeTextField(
                                freeTextField,
                                event.target.value,
                              )
                            }
                            placeholder={question.thoughtPlaceholder}
                            rows={4}
                          />

                          <small className="word-counter">
                            {wordCount}/{MAX_WORDS}
                          </small>
                        </label>
                      </fieldset>
                    );
                  }

                  const thoughtValue =
                    form.questionThoughts[question.id];
                  const wordCount = countWords(thoughtValue);

                  return (
                    <fieldset
                      className="question-card"
                      key={question.id}
                    >
                      <div className="question-top">
                        <span className="question-number mono">
                          {question.number}
                        </span>

                        <div>
                          <legend className="question-legend">
                            <span>
                              {requiredLabel(question.title)}
                            </span>

                            {question.tooltip && (
                              <TooltipIcon text={question.tooltip} />
                            )}
                          </legend>

                          <p>{question.prompt}</p>
                        </div>
                      </div>

                      <div className="option-list">
                        {question.options.map(
                          (option, optionIndex) => {
                            const checked = Array.isArray(selections)
                              ? selections.includes(option)
                              : false;
                            const inputId = `${question.id}-${optionIndex}`;
                            const isMulti =
                              question.multiSelect ?? false;

                            const atCap =
                              isMulti &&
                              Array.isArray(selections) &&
                              selections.length >=
                                (question.maxSelect ?? 2) &&
                              !checked;

                            return (
                              <label
                                htmlFor={inputId}
                                className={`option-item ${
                                  checked ? "selected" : ""
                                } ${atCap ? "at-cap" : ""}`}
                                key={option}
                              >
                                <input
                                  id={inputId}
                                  type={
                                    isMulti ? "checkbox" : "radio"
                                  }
                                  name={question.id}
                                  value={option}
                                  checked={checked}
                                  onChange={() =>
                                    selectOption(
                                      question.id,
                                      option,
                                      question.multiSelect,
                                      question.maxSelect,
                                    )
                                  }
                                />

                                <span
                                  className="fake-option-check"
                                  aria-hidden="true"
                                >
                                  <span className="fake-option-check-mark">
                                    ✓
                                  </span>
                                </span>

                                <span>{option}</span>
                              </label>
                            );
                          },
                        )}

                        {question.hasOtherOption && (
                          <>
                            <label
                              className={`option-item ${
                                isOtherSelected ? "selected" : ""
                              }`}
                            >
                              <input
                                type={
                                  question.multiSelect
                                    ? "checkbox"
                                    : "radio"
                                }
                                name={question.id}
                                checked={isOtherSelected}
                                onChange={() =>
                                  toggleOtherOption(
                                    question.id,
                                    question.multiSelect,
                                  )
                                }
                              />

                              <span
                                className="fake-option-check"
                                aria-hidden="true"
                              >
                                <span className="fake-option-check-mark">
                                  ✓
                                </span>
                              </span>

                              <span>Other</span>
                            </label>

                            {isOtherSelected && (
                              <label className="waitlist-field drivers-other-field">
                                <input
                                  type="text"
                                  placeholder="Please specify..."
                                  value={
                                    otherValues[question.id] ?? ""
                                  }
                                  onChange={(event) => {
                                    setOtherValues((current) => ({
                                      ...current,
                                      [question.id]:
                                        event.target.value,
                                    }));
                                  }}
                                  onBlur={() =>
                                    updateOtherText(question.id)
                                  }
                                />
                              </label>
                            )}
                          </>
                        )}
                      </div>

                      {question.thoughtPlaceholder && (
                        <label className="waitlist-field question-thought-field">
                          <textarea
                            name={`${question.id}Thoughts`}
                            value={thoughtValue}
                            onChange={(event) =>
                              updateQuestionThought(
                                question.id,
                                event.target.value,
                              )
                            }
                            placeholder={question.thoughtPlaceholder}
                            rows={4}
                          />

                          <small className="word-counter">
                            {wordCount}/{MAX_WORDS}
                          </small>
                        </label>
                      )}
                    </fieldset>
                  );
                })}
              </div>
            ))}
          </div>

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
              {requiredLabel(
                "I'm okay with Wheelers contacting me about the EV Driver Partnership, including lease details, vehicle availability, and follow-up questions.",
              )}
            </span>
          </label>

          {status.message && (
            <div className={`waitlist-status ${status.type}`}>
              {status.message}
            </div>
          )}

          <div className="waitlist-submit">
            <button
              className="btn-glow syne"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit your interest →"}
            </button>

            <p>
              Your answers help us build a fairer, driver-first EV
              ride-hailing platform in Nigeria.
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
