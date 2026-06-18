"use client";

import type { DriverQuestionId } from "@/lib/drivers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const MAX_WORDS = 250;

/* ── types ───────────────────────────────────────────────── */

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
  planningToJoin: string[];
  referralContact: string;
  moreInfoNeeded: string[];
  platformPainPoints: string[];
  fairCommission: string;
  vehicleOwnershipImportance: string[];
  evTransitionSupport: string[];
  additionalComments: string;
  questionThoughts: QuestionThoughts;
  allowContact: boolean;
};

type Question = {
  id: DriverQuestionId;
  title: string;
  prompt: string;
  options: string[];
  thoughtPlaceholder: string;
  multiSelect?: boolean;
  maxSelect?: number;
  tooltip?: string;
  hasOtherOption?: boolean;
  section?: string;
  showWhen?: (form: FormState) => boolean;
  freeTextOnly?: boolean;
  /** Sub-question — no number badge, indented under parent */
  isSub?: boolean;
  /** Text input instead of option selection */
  isTextInput?: boolean;
  textInputPlaceholder?: string;
};

/* ── survey questions ────────────────────────────────────── */

const questions: Question[] = [
  // ─── Section 1: Driver Profile & Current Status ───
  {
    id: "currentlyDriving",

    title: "Current Ride-Hailing Status",
    section: "Driver Profile & Current Status",
    prompt: "Are you currently engaged in ride-hailing?",
    thoughtPlaceholder: "",
    options: ["Yes", "No"],
  },
  {
    id: "platforms",

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
    isSub: true,
  },
  {
    id: "mostUsedPlatform",

    title: "Most Used Platform",
    section: "Driver Profile & Current Status",
    prompt: "Which platform do you use the most?",
    thoughtPlaceholder: "",
    options: ["Uber", "Bolt", "InDriver", "LagRide"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
    isSub: true,
  },
  {
    id: "ownsVehicle",

    title: "Vehicle Ownership",
    section: "Driver Profile & Current Status",
    prompt: "Do you own the vehicle you currently drive?",
    thoughtPlaceholder: "",
    options: ["Yes", "No"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
    isSub: true,
  },
  {
    id: "vehicleArrangement",

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
    isSub: true,
  },

  // ─── Section 2: Financial Performance ───
  {
    id: "dailyRides",

    title: "Average Daily Rides",
    section: "Financial Performance",
    prompt: "How many rides do you complete on an average day?",
    thoughtPlaceholder: "",
    options: ["1–5", "6–10", "11–15", "16–20", "20+"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "weeklyRevenue",

    title: "Weekly Revenue",
    section: "Financial Performance",
    prompt:
      "What is your average weekly revenue? (Total earnings before deducting operational costs such as platform fees, fuel, maintenance, and any lease/rental payments)",
    thoughtPlaceholder: "",
    options: [
      "₦100,000 – ₦150,000",
      "₦150,000 – ₦200,000",
      "₦200,000 – ₦250,000",
      "₦250,000 – ₦300,000",
      "₦300,000+",
    ],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "weeklyProfit",

    title: "Weekly Profit",
    section: "Financial Performance",
    prompt:
      "What is your average weekly profit? (Revenue minus all operational costs including fuel, maintenance, platform fees, and vehicle rental/lease payments)",
    thoughtPlaceholder: "",
    options: [
      "₦25,000 – ₦50,000",
      "₦50,000 – ₦100,000",
      "₦100,000 – ₦150,000",
      "₦150,000 – ₦200,000",
      "₦200,000+",
    ],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },

  // ─── Section 3: Location & Operations ───
  {
    id: "operatingLocation",

    title: "Operating Location",
    section: "Location & Operations",
    prompt: "Where do you currently stay / operate from?",
    thoughtPlaceholder: "",
    hasOtherOption: true,
    options: ["Lagos Island", "Lagos Mainland", "Abuja", "Port Harcourt"],
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "sweetSpotArea",

    title: "Sweet Spot Area",
    section: "Location & Operations",
    prompt:
      'What is your preferred "sweet spot" area — the location where you find the most profitable and consistent rides?',
    thoughtPlaceholder:
      "Tell us the area or route where you get the best rides...",
    options: [],
    freeTextOnly: true,
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },

  // ─── Section 4: EV Interest & Lease Willingness ───
  {
    id: "evEarningsBeliefs",

    title: "EV Earnings Potential",
    section: "EV Interest & Lease Willingness",
    prompt:
      "Do you believe you would earn more if you switched to an electric vehicle (EV)? (Consider: lower fuel costs, reduced maintenance, potential higher demand)",
    thoughtPlaceholder: "",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "leaseWillingness",

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
  {
    id: "planningToJoin",

    title: "Planning to Join",
    section: "EV Interest & Lease Willingness",
    prompt: "Are you planning on joining the Wheelers EV Driver Partnership?",
    thoughtPlaceholder: "",
    options: ["Yes", "No", "Not sure — I need more information"],
  },
  {
    id: "referralContact",

    title: "Referral",
    section: "EV Interest & Lease Willingness",
    prompt:
      "Do you have any friends or family who might be interested? Share their name and phone number so we can reach out.",
    thoughtPlaceholder: "e.g. Chidi — 08012345678",
    options: [],
    freeTextOnly: true,
    showWhen: (form) => form.planningToJoin.includes("No"),
    isSub: true,
  },
  {
    id: "moreInfoNeeded",

    title: "What Do You Want to Know?",
    section: "EV Interest & Lease Willingness",
    prompt: "What would you like to know more about?",
    thoughtPlaceholder: "",
    multiSelect: true,
    maxSelect: 6,
    hasOtherOption: true,
    options: [
      "Revenue potential",
      "Profit breakdown",
      "Cost of operations",
      "Vehicle financing / lease terms",
      "Charging infrastructure",
    ],
    showWhen: (form) =>
      form.planningToJoin.includes("Not sure — I need more information"),
    isSub: true,
  },

  // ─── Section 5: Platform Experience & Fairness ───
  {
    id: "platformPainPoints",

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
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },
  {
    id: "fairCommission",

    title: "Fair Commission",
    section: "Platform Experience & Fairness",
    prompt:
      "What platform commission fee (%) do you consider fair and sustainable for you as a driver?",
    thoughtPlaceholder: "",
    options: [],
    isTextInput: true,
    textInputPlaceholder: "e.g. 15",
    showWhen: (form) => form.currentlyDriving.includes("Yes"),
  },

  // ─── Section 6: Additional Feedback ───
  {
    id: "vehicleOwnershipImportance",

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
  planningToJoin: "",
  referralContact: "",
  moreInfoNeeded: "",
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
  planningToJoin: [],
  referralContact: "",
  moreInfoNeeded: [],
  platformPainPoints: [],
  fairCommission: "",
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

/* ── free-text field keys ────────────────────────────────── */

type FreeTextField =
  | "sweetSpotArea"
  | "additionalComments"
  | "referralContact";

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

  function updateFreeTextField(field: FreeTextField, value: string) {
    const limitedValue = limitToWords(value, MAX_WORDS);

    setForm((current) => ({
      ...current,
      [field]: limitedValue,
    }));
  }

  function updateDirectTextField(field: "fairCommission", value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
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

  /* ── visible questions with dynamic numbering ────────── */

  const visibleQuestions = questions.filter(
    (q) => !q.showWhen || q.showWhen(form),
  );

  // Assign sequential numbers (1, 2, 3...) to non-sub questions only
  const numberedQuestions: (Question & { displayNumber: string })[] = [];
  let counter = 1;

  for (const question of visibleQuestions) {
    if (question.isSub) {
      numberedQuestions.push({ ...question, displayNumber: "" });
    } else {
      numberedQuestions.push({ ...question, displayNumber: String(counter) });
      counter++;
    }
  }

  /* ── section grouping for display ──────────────────────── */

  type NumberedQuestion = (typeof numberedQuestions)[number];
  const sections: { label: string; questions: NumberedQuestion[] }[] = [];

  for (const question of numberedQuestions) {
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

    if (!form.phone.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your phone number before submitting.",
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
      if (question.isTextInput) continue;

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
              <span>{requiredLabel("Phone number")}</span>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(event) =>
                  updateTextField("phone", event.target.value)
                }
                placeholder="+234..."
                required
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
                  const selections: string[] = form[
                    question.id
                  ] as string[];
                  const isOtherSelected =
                    Array.isArray(selections) &&
                    selections.some((s) => s.startsWith("Other"));

                  /* ── free text only ─────────────────────── */
                  if (question.freeTextOnly) {
                    const freeTextField =
                      question.id as FreeTextField;
                    const freeTextValue = form[
                      freeTextField
                    ] as string;
                    const wordCount = countWords(freeTextValue);

                    return (
                      <fieldset
                        className={`question-card ${question.isSub ? "question-card--sub" : ""}`}
                        key={question.id}
                      >
                        <div className="question-top">
                          {question.displayNumber && (
                            <span className="question-number mono">
                              {question.displayNumber}
                            </span>
                          )}

                          <div>
                            <legend className="question-legend">
                              <span>{question.title}</span>

                              {question.tooltip && (
                                <TooltipIcon
                                  text={question.tooltip}
                                />
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
                            placeholder={
                              question.thoughtPlaceholder
                            }
                            rows={4}
                          />

                          <small className="word-counter">
                            {wordCount}/{MAX_WORDS}
                          </small>
                        </label>
                      </fieldset>
                    );
                  }

                  /* ── text input (e.g. fair commission %) ── */
                  if (question.isTextInput) {
                    const textValue = form[
                      question.id as keyof FormState
                    ] as string;

                    return (
                      <fieldset
                        className={`question-card ${question.isSub ? "question-card--sub" : ""}`}
                        key={question.id}
                      >
                        <div className="question-top">
                          {question.displayNumber && (
                            <span className="question-number mono">
                              {question.displayNumber}
                            </span>
                          )}

                          <div>
                            <legend className="question-legend">
                              <span>{question.title}</span>

                              {question.tooltip && (
                                <TooltipIcon
                                  text={question.tooltip}
                                />
                              )}
                            </legend>

                            <p>{question.prompt}</p>
                          </div>
                        </div>

                        <label className="waitlist-field">
                          <div className="drivers-percent-input">
                            <input
                              type="number"
                              name={question.id}
                              min="0"
                              max="100"
                              value={textValue}
                              onChange={(event) =>
                                updateDirectTextField(
                                  question.id as "fairCommission",
                                  event.target.value,
                                )
                              }
                              placeholder={
                                question.textInputPlaceholder ??
                                ""
                              }
                            />

                            <span className="drivers-percent-sign">
                              %
                            </span>
                          </div>
                        </label>
                      </fieldset>
                    );
                  }

                  /* ── standard option question ──────────── */
                  const thoughtValue =
                    form.questionThoughts[question.id];
                  const wordCount = countWords(thoughtValue);

                  return (
                    <fieldset
                      className={`question-card ${question.isSub ? "question-card--sub" : ""}`}
                      key={question.id}
                    >
                      <div className="question-top">
                        {question.displayNumber && (
                          <span className="question-number mono">
                            {question.displayNumber}
                          </span>
                        )}

                        <div>
                          <legend className="question-legend">
                            <span>
                              {requiredLabel(question.title)}
                            </span>

                            {question.tooltip && (
                              <TooltipIcon
                                text={question.tooltip}
                              />
                            )}
                          </legend>

                          <p>{question.prompt}</p>
                        </div>
                      </div>

                      <div className="option-list">
                        {question.options.map(
                          (option, optionIndex) => {
                            const checked =
                              Array.isArray(selections)
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
                                    isMulti
                                      ? "checkbox"
                                      : "radio"
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
                                isOtherSelected
                                  ? "selected"
                                  : ""
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
                                    otherValues[
                                      question.id
                                    ] ?? ""
                                  }
                                  onChange={(event) => {
                                    setOtherValues(
                                      (current) => ({
                                        ...current,
                                        [question.id]:
                                          event.target
                                            .value,
                                      }),
                                    );
                                  }}
                                  onBlur={() =>
                                    updateOtherText(
                                      question.id,
                                    )
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
                            placeholder={
                              question.thoughtPlaceholder
                            }
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
