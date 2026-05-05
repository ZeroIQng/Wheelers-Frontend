export const CAR_COST_NAIRA = 12_000_000;
export const REPAYMENT_MONTHS = 14;
export const DRIVER_SALARY_PER_MONTH_NAIRA = 200_000;
export const DAILY_INSURANCE_NAIRA = 2_000;
export const DAILY_MAINTENANCE_NAIRA = 3_333;
export const BATTERY_CAPACITY_KWH = 39.826;
export const RANGE_PER_CHARGE_KM = 400;
export const ELECTRICITY_COST_PER_KWH_NAIRA = 500;
export const MINIMUM_DAILY_DISTANCE_KM = 200;
export const MARGIN_PERCENT = 25;

export type RidePricingConstants = {
  carCostNaira: number;
  repaymentMonths: number;
  driverSalaryPerMonthNaira: number;
  dailyInsuranceNaira: number;
  dailyMaintenanceNaira: number;
  batteryCapacityKWh: number;
  rangePerChargeKm: number;
  electricityCostPerKWhNaira: number;
  minimumDailyDistanceKm: number;
  marginPercent: number;
};

export type RidePriceBreakdown = {
  distanceKm: number;
  tripPrice: number;
  tripProfit: number;
  energyCost: number;
  pricePerKm: number;
  breakEvenPerKm: number;
  profitPerKm: number;
};

export const DEFAULT_RIDE_PRICING_CONSTANTS: RidePricingConstants = {
  carCostNaira: CAR_COST_NAIRA,
  repaymentMonths: REPAYMENT_MONTHS,
  driverSalaryPerMonthNaira: DRIVER_SALARY_PER_MONTH_NAIRA,
  dailyInsuranceNaira: DAILY_INSURANCE_NAIRA,
  dailyMaintenanceNaira: DAILY_MAINTENANCE_NAIRA,
  batteryCapacityKWh: BATTERY_CAPACITY_KWH,
  rangePerChargeKm: RANGE_PER_CHARGE_KM,
  electricityCostPerKWhNaira: ELECTRICITY_COST_PER_KWH_NAIRA,
  minimumDailyDistanceKm: MINIMUM_DAILY_DISTANCE_KM,
  marginPercent: MARGIN_PERCENT,
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertPositiveNumber(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive number.`);
  }
}

export function calculateRidePrice(
  distanceKm: number,
  overrides: Partial<RidePricingConstants> = {},
): RidePriceBreakdown {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new RangeError("distanceKm must be a non-negative number.");
  }

  const constants: RidePricingConstants = {
    ...DEFAULT_RIDE_PRICING_CONSTANTS,
    ...overrides,
  };

  assertPositiveNumber(constants.carCostNaira, "carCostNaira");
  assertPositiveNumber(constants.repaymentMonths, "repaymentMonths");
  assertPositiveNumber(
    constants.driverSalaryPerMonthNaira,
    "driverSalaryPerMonthNaira",
  );
  assertPositiveNumber(constants.dailyInsuranceNaira, "dailyInsuranceNaira");
  assertPositiveNumber(constants.dailyMaintenanceNaira, "dailyMaintenanceNaira");
  assertPositiveNumber(constants.batteryCapacityKWh, "batteryCapacityKWh");
  assertPositiveNumber(constants.rangePerChargeKm, "rangePerChargeKm");
  assertPositiveNumber(
    constants.electricityCostPerKWhNaira,
    "electricityCostPerKWhNaira",
  );
  assertPositiveNumber(
    constants.minimumDailyDistanceKm,
    "minimumDailyDistanceKm",
  );

  const energyPerKm =
    constants.batteryCapacityKWh / constants.rangePerChargeKm;
  const dailyEnergy =
    constants.minimumDailyDistanceKm *
    energyPerKm *
    constants.electricityCostPerKWhNaira;
  const dailyCarRecovery =
    constants.carCostNaira / constants.repaymentMonths / 30;
  const dailyDriverCost = constants.driverSalaryPerMonthNaira / 30;
  const totalDailyCost =
    dailyCarRecovery +
    dailyDriverCost +
    constants.dailyInsuranceNaira +
    constants.dailyMaintenanceNaira +
    dailyEnergy;
  const breakEvenPerKm =
    totalDailyCost / constants.minimumDailyDistanceKm;
  const pricePerKm =
    breakEvenPerKm * (1 + constants.marginPercent / 100);
  const profitPerKm = pricePerKm - breakEvenPerKm;

  return {
    distanceKm: roundCurrency(distanceKm),
    tripPrice: roundCurrency(pricePerKm * distanceKm),
    tripProfit: roundCurrency(profitPerKm * distanceKm),
    energyCost: roundCurrency(
      energyPerKm * distanceKm * constants.electricityCostPerKWhNaira,
    ),
    pricePerKm: roundCurrency(pricePerKm),
    breakEvenPerKm: roundCurrency(breakEvenPerKm),
    profitPerKm: roundCurrency(profitPerKm),
  };
}
