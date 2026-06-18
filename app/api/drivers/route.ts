import { insertDriverSubmission } from "@/lib/drivers-db";
import {
  driverQuestionIds,
  driverQuestionLabels,
  type DriverQuestionId,
} from "@/lib/drivers";

export const runtime = "nodejs";

type DriverPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  currentlyDriving?: unknown;
  platforms?: unknown;
  mostUsedPlatform?: unknown;
  ownsVehicle?: unknown;
  vehicleArrangement?: unknown;
  dailyRides?: unknown;
  weeklyRevenue?: unknown;
  weeklyProfit?: unknown;
  operatingLocation?: unknown;
  sweetSpotArea?: unknown;
  evEarningsBeliefs?: unknown;
  leaseWillingness?: unknown;
  leaseRejectionReason?: unknown;
  platformPainPoints?: unknown;
  fairCommission?: unknown;
  vehicleOwnershipImportance?: unknown;
  evTransitionSupport?: unknown;
  additionalComments?: unknown;
  questionThoughts?: unknown;
  allowContact?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
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

function readRequiredTextField(
  payload: DriverPayload,
  field: "name" | "email",
) {
  const value = payload[field];

  if (!isNonEmptyString(value)) {
    return null;
  }

  return value.trim();
}

function readOptionalTextField(
  payload: DriverPayload,
  field: "phone" | "sweetSpotArea" | "additionalComments",
) {
  const value = payload[field];

  if (!isNonEmptyString(value)) {
    return "";
  }

  return value.trim();
}

function readSelectionField(payload: DriverPayload, field: DriverQuestionId) {
  const value = payload[field];

  if (isStringArray(value)) {
    return value.map((item) => item.trim());
  }

  return [];
}

function readQuestionThoughts(payload: DriverPayload) {
  const rawThoughts = payload.questionThoughts;
  const thoughts: Record<DriverQuestionId, string> = {
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

  if (
    !rawThoughts ||
    typeof rawThoughts !== "object" ||
    Array.isArray(rawThoughts)
  ) {
    return thoughts;
  }

  const thoughtRecord = rawThoughts as Record<string, unknown>;

  for (const field of driverQuestionIds) {
    const value = thoughtRecord[field];
    thoughts[field] = isString(value) ? value.trim() : "";
  }

  return thoughts;
}

/* ── conditional visibility logic (mirrors client) ─────── */

function isQuestionRequired(
  field: DriverQuestionId,
  payload: DriverPayload,
): boolean {
  const currentlyDriving = isNonEmptyStringArray(payload.currentlyDriving)
    ? payload.currentlyDriving
    : [];
  const ownsVehicle = isNonEmptyStringArray(payload.ownsVehicle)
    ? payload.ownsVehicle
    : [];
  const evEarningsBeliefs = isNonEmptyStringArray(payload.evEarningsBeliefs)
    ? payload.evEarningsBeliefs
    : [];
  const leaseWillingness = isNonEmptyStringArray(payload.leaseWillingness)
    ? payload.leaseWillingness
    : [];

  switch (field) {
    case "platforms":
    case "mostUsedPlatform":
    case "ownsVehicle":
    case "dailyRides":
    case "weeklyRevenue":
    case "weeklyProfit":
      return currentlyDriving.includes("Yes");

    case "vehicleArrangement":
      return (
        currentlyDriving.includes("Yes") && ownsVehicle.includes("No")
      );

    case "leaseWillingness":
      return (
        evEarningsBeliefs.includes("Yes") ||
        evEarningsBeliefs.includes("Not sure")
      );

    case "leaseRejectionReason":
      return leaseWillingness.includes("No");

    // Free text fields are never required
    case "sweetSpotArea":
    case "additionalComments":
      return false;

    // All other questions are always required
    default:
      return true;
  }
}

export async function POST(request: Request) {
  let payload: DriverPayload;

  try {
    payload = (await request.json()) as DriverPayload;
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
    return Response.json(
      { message: "Please enter a valid email." },
      { status: 400 },
    );
  }

  // Validate required selection fields
  for (const field of driverQuestionIds) {
    if (field === "sweetSpotArea" || field === "additionalComments") continue;

    if (!isQuestionRequired(field, payload)) continue;

    const selections = readSelectionField(payload, field);

    if (selections.length === 0) {
      return Response.json(
        {
          message: `Please complete the ${driverQuestionLabels[field]} section before submitting.`,
        },
        { status: 400 },
      );
    }
  }

  if (payload.allowContact !== true) {
    return Response.json(
      {
        message:
          "Please tick the contact consent checkbox before submitting.",
      },
      { status: 400 },
    );
  }

  const phone = readOptionalTextField(payload, "phone");
  const sweetSpotArea = readOptionalTextField(payload, "sweetSpotArea");
  const additionalComments = readOptionalTextField(
    payload,
    "additionalComments",
  );
  const questionThoughts = readQuestionThoughts(payload);

  // Build selection records (return empty arrays for conditional questions not shown)
  const selections = Object.fromEntries(
    driverQuestionIds
      .filter((f) => f !== "sweetSpotArea" && f !== "additionalComments")
      .map((field) => [field, readSelectionField(payload, field)]),
  ) as Record<string, string[]>;

  try {
    await insertDriverSubmission({
      name,
      email,
      phone,
      currentlyDriving: selections.currentlyDriving ?? [],
      platforms: selections.platforms ?? [],
      mostUsedPlatform: selections.mostUsedPlatform ?? [],
      ownsVehicle: selections.ownsVehicle ?? [],
      vehicleArrangement: selections.vehicleArrangement ?? [],
      dailyRides: selections.dailyRides ?? [],
      weeklyRevenue: selections.weeklyRevenue ?? [],
      weeklyProfit: selections.weeklyProfit ?? [],
      operatingLocation: selections.operatingLocation ?? [],
      sweetSpotArea,
      evEarningsBeliefs: selections.evEarningsBeliefs ?? [],
      leaseWillingness: selections.leaseWillingness ?? [],
      leaseRejectionReason: selections.leaseRejectionReason ?? [],
      platformPainPoints: selections.platformPainPoints ?? [],
      fairCommission: selections.fairCommission ?? [],
      vehicleOwnershipImportance: selections.vehicleOwnershipImportance ?? [],
      evTransitionSupport: selections.evTransitionSupport ?? [],
      additionalComments,
      questionThoughts,
      allowContact: true,
    });
  } catch (error) {
    console.error("driver submission insert failed", error);

    return Response.json(
      { message: "Your response could not be saved right now." },
      { status: 500 },
    );
  }

  return Response.json({
    message:
      "Thanks. Your response has been recorded. Welcome to the Wheelers Driver Partnership.",
  });
}
