import { insertWaitlistSubmission } from "@/lib/waitlist-db";

export const runtime = "nodejs";

const requiredSelectionFields = [
  "transportChoice",
  "priceImpact",
  "rideHailingPain",
  "evTrustTradeoff",
  "ikejaLekkiPrice",
  "rideSharingBehavior",
  "groupRideAcceptance",
] as const;

type QuestionId = (typeof requiredSelectionFields)[number];

type WaitlistPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  transportChoice?: unknown;
  priceImpact?: unknown;
  rideHailingPain?: unknown;
  evTrustTradeoff?: unknown;
  ikejaLekkiPrice?: unknown;
  rideSharingBehavior?: unknown;
  groupRideAcceptance?: unknown;
  questionThoughts?: unknown;
  optionalFeedback?: unknown;
  allowContact?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => isNonEmptyString(item))
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readRequiredTextField(payload: WaitlistPayload, field: "name" | "email") {
  const value = payload[field];

  if (!isNonEmptyString(value)) {
    return null;
  }

  return value.trim();
}

function readOptionalTextField(
  payload: WaitlistPayload,
  field: "phone" | "optionalFeedback",
) {
  const value = payload[field];

  if (!isNonEmptyString(value)) {
    return "";
  }

  return value.trim();
}

function readSelectionField(payload: WaitlistPayload, field: QuestionId) {
  const value = payload[field];

  if (!isNonEmptyStringArray(value)) {
    return null;
  }

  return value.map((item) => item.trim());
}

function readQuestionThoughts(payload: WaitlistPayload) {
  const rawThoughts = payload.questionThoughts;
  const thoughts: Record<QuestionId, string> = {
    transportChoice: "",
    priceImpact: "",
    rideHailingPain: "",
    evTrustTradeoff: "",
    ikejaLekkiPrice: "",
    rideSharingBehavior: "",
    groupRideAcceptance: "",
  };

  if (!rawThoughts || typeof rawThoughts !== "object" || Array.isArray(rawThoughts)) {
    return thoughts;
  }

  const thoughtRecord = rawThoughts as Record<string, unknown>;

  for (const field of requiredSelectionFields) {
    const value = thoughtRecord[field];
    thoughts[field] = isString(value) ? value.trim() : "";
  }

  return thoughts;
}

export async function POST(request: Request) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const name = readRequiredTextField(payload, "name");
  const emailValue = readRequiredTextField(payload, "email");

  if (!name || !emailValue) {
    return Response.json(
      { message: "Please enter your name and email before submitting." },
      { status: 400 },
    );
  }

  const email = emailValue.toLowerCase();

  if (!isValidEmail(email)) {
    return Response.json({ message: "Please enter a valid email." }, { status: 400 });
  }

  const selections = Object.fromEntries(
    requiredSelectionFields.map((field) => [field, readSelectionField(payload, field)]),
  ) as Record<QuestionId, string[] | null>;

  for (const field of requiredSelectionFields) {
    if (!selections[field]) {
      return Response.json(
        { message: `Please complete the ${field} field.` },
        { status: 400 },
      );
    }
  }

  if (payload.allowContact !== true) {
    return Response.json(
      { message: "Please tick the contact consent checkbox before submitting." },
      { status: 400 },
    );
  }

  const phone = readOptionalTextField(payload, "phone");
  const optionalFeedback = readOptionalTextField(payload, "optionalFeedback");
  const questionThoughts = readQuestionThoughts(payload);

  try {
    await insertWaitlistSubmission({
      name,
      email,
      phone,
      transportChoice: selections.transportChoice as string[],
      priceImpact: selections.priceImpact as string[],
      rideHailingPain: selections.rideHailingPain as string[],
      evTrustTradeoff: selections.evTrustTradeoff as string[],
      ikejaLekkiPrice: selections.ikejaLekkiPrice as string[],
      rideSharingBehavior: selections.rideSharingBehavior as string[],
      groupRideAcceptance: selections.groupRideAcceptance as string[],
      questionThoughts,
      optionalFeedback,
      allowContact: true,
    });
  } catch (error) {
    console.error("waitlist insert failed", error);

    return Response.json(
      { message: "Your response could not be saved right now." },
      { status: 500 },
    );
  }

  return Response.json({ message: "Thanks. Your response has been recorded." });
}
