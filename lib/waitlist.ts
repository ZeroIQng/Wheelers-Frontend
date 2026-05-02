export const waitlistQuestionIds = [
  "transportChoice",
  "priceImpact",
  "rideHailingPain",
  "evTrustTradeoff",
  "ikejaLekkiPrice",
  "rideSharingBehavior",
  "groupRideAcceptance",
] as const;

export type WaitlistQuestionId = (typeof waitlistQuestionIds)[number];

export const waitlistQuestionLabels: Record<WaitlistQuestionId, string> = {
  transportChoice: "Transport Choice",
  priceImpact: "Price Sensitivity",
  rideHailingPain: "Current Ride-Hailing Pain",
  evTrustTradeoff: "EV Adoption, Trust & Trade-off",
  ikejaLekkiPrice: "Price Expectation",
  rideSharingBehavior: "Ride Sharing Behavior",
  groupRideAcceptance: "Group Ride Acceptance + Concern",
};
