import { Pool } from "pg";

const globalForWaitlistDb = globalThis as typeof globalThis & {
  wheelersWaitlistPool?: Pool;
  wheelersWaitlistTableReady?: Promise<void>;
};

function getPool() {
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
