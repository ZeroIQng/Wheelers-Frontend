import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

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
  optionalFeedback?: unknown;
  allowContact?: unknown;
};

const requiredTextFields = [
  "name",
  "email",
] as const;

const requiredSelectionFields = [
  "transportChoice",
  "priceImpact",
  "rideHailingPain",
  "evTrustTradeoff",
  "ikejaLekkiPrice",
  "rideSharingBehavior",
  "groupRideAcceptance",
] as const;

const storagePath =
  process.env.WAITLIST_STORAGE_PATH ?? path.join("/tmp", "wheelers-waitlist.ndjson");

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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

function readField(payload: WaitlistPayload, field: (typeof requiredTextFields)[number]) {
  const value = payload[field];

  if (!isNonEmptyString(value)) {
    return null;
  }

  return value.trim();
}

function readSelectionField(
  payload: WaitlistPayload,
  field: (typeof requiredSelectionFields)[number],
) {
  const value = payload[field];

  if (!isNonEmptyStringArray(value)) {
    return null;
  }

  return value.map((item) => item.trim());
}

function readOptionalField(payload: WaitlistPayload, field: "phone" | "optionalFeedback") {
  const value = payload[field];

  if (!isNonEmptyString(value)) {
    return "";
  }

  return value.trim();
}

function readBooleanField(payload: WaitlistPayload, field: "allowContact") {
  return payload[field] === true;
}

export async function POST(request: Request) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  for (const field of requiredTextFields) {
    if (!isNonEmptyString(payload[field])) {
      return Response.json(
        { message: `Please complete the ${field} field.` },
        { status: 400 },
      );
    }
  }

  for (const field of requiredSelectionFields) {
    if (!isNonEmptyStringArray(payload[field])) {
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

  const name = readField(payload, "name");
  const emailValue = readField(payload, "email");
  const phone = readOptionalField(payload, "phone");
  const transportChoice = readSelectionField(payload, "transportChoice");
  const priceImpact = readSelectionField(payload, "priceImpact");
  const rideHailingPain = readSelectionField(payload, "rideHailingPain");
  const evTrustTradeoff = readSelectionField(payload, "evTrustTradeoff");
  const ikejaLekkiPrice = readSelectionField(payload, "ikejaLekkiPrice");
  const rideSharingBehavior = readSelectionField(payload, "rideSharingBehavior");
  const groupRideAcceptance = readSelectionField(payload, "groupRideAcceptance");
  const optionalFeedback = readOptionalField(payload, "optionalFeedback");
  const allowContact = readBooleanField(payload, "allowContact");

  if (
    !name ||
    !emailValue ||
    !transportChoice ||
    !priceImpact ||
    !rideHailingPain ||
    !evTrustTradeoff ||
    !ikejaLekkiPrice ||
    !rideSharingBehavior ||
    !groupRideAcceptance
  ) {
    return Response.json({ message: "Please complete the form." }, { status: 400 });
  }

  const email = emailValue.toLowerCase();

  if (!isValidEmail(email)) {
    return Response.json({ message: "Please enter a valid email." }, { status: 400 });
  }

  const submission = {
    name,
    email,
    phone,
    transportChoice,
    priceImpact,
    rideHailingPain,
    evTrustTradeoff,
    ikejaLekkiPrice,
    rideSharingBehavior,
    groupRideAcceptance,
    optionalFeedback,
    allowContact,
    submittedAt: new Date().toISOString(),
  };

  try {
    await mkdir(path.dirname(storagePath), { recursive: true });
    await appendFile(storagePath, `${JSON.stringify(submission)}\n`, "utf8");
  } catch {
    return Response.json(
      { message: "Your response could not be saved right now." },
      { status: 500 },
    );
  }

  return Response.json({ message: "Thanks. Your response has been recorded." });
}
