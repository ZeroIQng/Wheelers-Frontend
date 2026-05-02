import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type WaitlistPayload = {
  name?: unknown;
  email?: unknown;
  transportChoice?: unknown;
  priceImpact?: unknown;
  rideHailingPain?: unknown;
  evTrustTradeoff?: unknown;
  ikejaLekkiPrice?: unknown;
  rideSharingBehavior?: unknown;
  groupRideAcceptance?: unknown;
};

const requiredFields = [
  "name",
  "email",
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readField(payload: WaitlistPayload, field: (typeof requiredFields)[number]) {
  const value = payload[field];

  if (!isNonEmptyString(value)) {
    return null;
  }

  return value.trim();
}

export async function POST(request: Request) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  for (const field of requiredFields) {
    if (!isNonEmptyString(payload[field])) {
      return Response.json(
        { message: `Please complete the ${field} field.` },
        { status: 400 },
      );
    }
  }

  const name = readField(payload, "name");
  const emailValue = readField(payload, "email");
  const transportChoice = readField(payload, "transportChoice");
  const priceImpact = readField(payload, "priceImpact");
  const rideHailingPain = readField(payload, "rideHailingPain");
  const evTrustTradeoff = readField(payload, "evTrustTradeoff");
  const ikejaLekkiPrice = readField(payload, "ikejaLekkiPrice");
  const rideSharingBehavior = readField(payload, "rideSharingBehavior");
  const groupRideAcceptance = readField(payload, "groupRideAcceptance");

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
    transportChoice,
    priceImpact,
    rideHailingPain,
    evTrustTradeoff,
    ikejaLekkiPrice,
    rideSharingBehavior,
    groupRideAcceptance,
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
