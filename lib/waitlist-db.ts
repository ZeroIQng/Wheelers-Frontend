import { Pool, type QueryResultRow } from "pg";

const globalForWaitlistDb = globalThis as typeof globalThis & {
  wheelersWaitlistPool?: Pool;
  wheelersWaitlistTableReady?: Promise<void>;
};

function getPool(): Pool {
  if (!globalForWaitlistDb.wheelersWaitlistPool) {
    const connectionString = process.env.Db_URL ?? process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("Missing Db_URL or DATABASE_URL environment variable.");
    }

    globalForWaitlistDb.wheelersWaitlistPool = new Pool({
      connectionString,
    });
  }

  return globalForWaitlistDb.wheelersWaitlistPool;
}

export async function ensureWaitlistTable() {
  if (!globalForWaitlistDb.wheelersWaitlistTableReady) {
    globalForWaitlistDb.wheelersWaitlistTableReady = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS waitlist_submissions (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL DEFAULT '',
          transport_choice JSONB NOT NULL,
          price_impact JSONB NOT NULL,
          ride_hailing_pain JSONB NOT NULL,
          ev_trust_tradeoff JSONB NOT NULL,
          ikeja_lekki_price JSONB NOT NULL,
          ride_sharing_behavior JSONB NOT NULL,
          group_ride_acceptance JSONB NOT NULL,
          question_thoughts JSONB NOT NULL DEFAULT '{}'::jsonb,
          optional_feedback TEXT NOT NULL DEFAULT '',
          allow_contact BOOLEAN NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `)
      .then(() => undefined);
  }

  await globalForWaitlistDb.wheelersWaitlistTableReady;
}

export async function insertWaitlistSubmission(submission: {
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
  questionThoughts: Record<string, string>;
  optionalFeedback: string;
  allowContact: boolean;
}) {
  await ensureWaitlistTable();

  await getPool().query(
    `
      INSERT INTO waitlist_submissions (
        name,
        email,
        phone,
        transport_choice,
        price_impact,
        ride_hailing_pain,
        ev_trust_tradeoff,
        ikeja_lekki_price,
        ride_sharing_behavior,
        group_ride_acceptance,
        question_thoughts,
        optional_feedback,
        allow_contact
      )
      VALUES (
        $1,
        $2,
        $3,
        $4::jsonb,
        $5::jsonb,
        $6::jsonb,
        $7::jsonb,
        $8::jsonb,
        $9::jsonb,
        $10::jsonb,
        $11::jsonb,
        $12,
        $13
      )
    `,
    [
      submission.name,
      submission.email,
      submission.phone,
      JSON.stringify(submission.transportChoice),
      JSON.stringify(submission.priceImpact),
      JSON.stringify(submission.rideHailingPain),
      JSON.stringify(submission.evTrustTradeoff),
      JSON.stringify(submission.ikejaLekkiPrice),
      JSON.stringify(submission.rideSharingBehavior),
      JSON.stringify(submission.groupRideAcceptance),
      JSON.stringify(submission.questionThoughts),
      submission.optionalFeedback,
      submission.allowContact,
    ],
  );
}

/* ADMIN GET TYPES + FETCH FUNCTION */

export type WaitlistSubmissionRow = {
  id: number;
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
  questionThoughts: Record<string, string>;
  optionalFeedback: string;
  allowContact: boolean;
  submittedAt: string;
};

type WaitlistDbRow = QueryResultRow & {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  transport_choice: unknown;
  price_impact: unknown;
  ride_hailing_pain: unknown;
  ev_trust_tradeoff: unknown;
  ikeja_lekki_price: unknown;
  ride_sharing_behavior: unknown;
  group_ride_acceptance: unknown;
  question_thoughts: unknown;
  optional_feedback: string;
  allow_contact: boolean;
  submitted_at: string | Date;
};

function normalizeJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeJsonObject(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string>;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, string>;
      }
    } catch {
      return {};
    }
  }

  return {};
}

export async function getWaitlistSubmissions(): Promise<WaitlistSubmissionRow[]> {
  await ensureWaitlistTable();

  const result = await getPool().query<WaitlistDbRow>(`
    SELECT
      id,
      name,
      email,
      phone,
      transport_choice,
      price_impact,
      ride_hailing_pain,
      ev_trust_tradeoff,
      ikeja_lekki_price,
      ride_sharing_behavior,
      group_ride_acceptance,
      question_thoughts,
      optional_feedback,
      allow_contact,
      submitted_at
    FROM waitlist_submissions
    ORDER BY submitted_at DESC
  `);

  return result.rows.map((row: WaitlistDbRow) => ({
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    transportChoice: normalizeJsonArray(row.transport_choice),
    priceImpact: normalizeJsonArray(row.price_impact),
    rideHailingPain: normalizeJsonArray(row.ride_hailing_pain),
    evTrustTradeoff: normalizeJsonArray(row.ev_trust_tradeoff),
    ikejaLekkiPrice: normalizeJsonArray(row.ikeja_lekki_price),
    rideSharingBehavior: normalizeJsonArray(row.ride_sharing_behavior),
    groupRideAcceptance: normalizeJsonArray(row.group_ride_acceptance),
    questionThoughts: normalizeJsonObject(row.question_thoughts),
    optionalFeedback: row.optional_feedback,
    allowContact: Boolean(row.allow_contact),
    submittedAt: row.submitted_at
      ? new Date(row.submitted_at).toISOString()
      : "",
  }));
}