import { Pool } from "pg";

const globalForDriversDb = globalThis as typeof globalThis & {
  wheelersDriversPool?: Pool;
  wheelersDriversTableReady?: Promise<void>;
};

function getPool(): Pool {
  if (!globalForDriversDb.wheelersDriversPool) {
    const connectionString = process.env.Db_URL ?? process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("Missing Db_URL or DATABASE_URL environment variable.");
    }

    globalForDriversDb.wheelersDriversPool = new Pool({
      connectionString,
    });
  }

  return globalForDriversDb.wheelersDriversPool;
}

export async function ensureDriversTable() {
  if (!globalForDriversDb.wheelersDriversTableReady) {
    globalForDriversDb.wheelersDriversTableReady = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS driver_submissions (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL DEFAULT '',
          currently_driving JSONB NOT NULL,
          platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
          most_used_platform JSONB NOT NULL DEFAULT '[]'::jsonb,
          owns_vehicle JSONB NOT NULL DEFAULT '[]'::jsonb,
          vehicle_arrangement JSONB NOT NULL DEFAULT '[]'::jsonb,
          daily_rides JSONB NOT NULL DEFAULT '[]'::jsonb,
          weekly_revenue JSONB NOT NULL DEFAULT '[]'::jsonb,
          weekly_profit JSONB NOT NULL DEFAULT '[]'::jsonb,
          operating_location JSONB NOT NULL DEFAULT '[]'::jsonb,
          sweet_spot_area TEXT NOT NULL DEFAULT '',
          ev_earnings_beliefs JSONB NOT NULL DEFAULT '[]'::jsonb,
          lease_willingness JSONB NOT NULL DEFAULT '[]'::jsonb,
          lease_rejection_reason JSONB NOT NULL DEFAULT '[]'::jsonb,
          planning_to_join JSONB NOT NULL DEFAULT '[]'::jsonb,
          referral_contact TEXT NOT NULL DEFAULT '',
          more_info_needed JSONB NOT NULL DEFAULT '[]'::jsonb,
          platform_pain_points JSONB NOT NULL DEFAULT '[]'::jsonb,
          fair_commission TEXT NOT NULL DEFAULT '',
          vehicle_ownership_importance JSONB NOT NULL DEFAULT '[]'::jsonb,
          ev_transition_support JSONB NOT NULL DEFAULT '[]'::jsonb,
          additional_comments TEXT NOT NULL DEFAULT '',
          question_thoughts JSONB NOT NULL DEFAULT '{}'::jsonb,
          allow_contact BOOLEAN NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `)
      .then(() => undefined);
  }

  await globalForDriversDb.wheelersDriversTableReady;
}

export async function insertDriverSubmission(submission: {
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
  questionThoughts: Record<string, string>;
  allowContact: boolean;
}) {
  await ensureDriversTable();

  await getPool().query(
    `
      INSERT INTO driver_submissions (
        name,
        email,
        phone,
        currently_driving,
        platforms,
        most_used_platform,
        owns_vehicle,
        vehicle_arrangement,
        daily_rides,
        weekly_revenue,
        weekly_profit,
        operating_location,
        sweet_spot_area,
        ev_earnings_beliefs,
        lease_willingness,
        lease_rejection_reason,
        planning_to_join,
        referral_contact,
        more_info_needed,
        platform_pain_points,
        fair_commission,
        vehicle_ownership_importance,
        ev_transition_support,
        additional_comments,
        question_thoughts,
        allow_contact
      )
      VALUES (
        $1, $2, $3,
        $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb,
        $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb,
        $13,
        $14::jsonb, $15::jsonb, $16::jsonb,
        $17::jsonb, $18, $19::jsonb,
        $20::jsonb, $21, $22::jsonb, $23::jsonb,
        $24,
        $25::jsonb,
        $26
      )
    `,
    [
      submission.name,
      submission.email,
      submission.phone,
      JSON.stringify(submission.currentlyDriving),
      JSON.stringify(submission.platforms),
      JSON.stringify(submission.mostUsedPlatform),
      JSON.stringify(submission.ownsVehicle),
      JSON.stringify(submission.vehicleArrangement),
      JSON.stringify(submission.dailyRides),
      JSON.stringify(submission.weeklyRevenue),
      JSON.stringify(submission.weeklyProfit),
      JSON.stringify(submission.operatingLocation),
      submission.sweetSpotArea,
      JSON.stringify(submission.evEarningsBeliefs),
      JSON.stringify(submission.leaseWillingness),
      JSON.stringify(submission.leaseRejectionReason),
      JSON.stringify(submission.planningToJoin),
      submission.referralContact,
      JSON.stringify(submission.moreInfoNeeded),
      JSON.stringify(submission.platformPainPoints),
      submission.fairCommission,
      JSON.stringify(submission.vehicleOwnershipImportance),
      JSON.stringify(submission.evTransitionSupport),
      submission.additionalComments,
      JSON.stringify(submission.questionThoughts),
      submission.allowContact,
    ],
  );
}
