/**
 * Real Estate Investment & Rental Yield Calculation Utilities
 * Analyzes gross rental yield, net operating income (NOI),
 * capitalization rate (Cap Rate), and cash-on-cash return.
 */

export interface InvestmentInputs {
  purchasePrice: number;
  monthlyRentalIncome: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  annualHOAFees?: number;
  vacancyRatePercent?: number; // default 5%
  propertyManagementRatePercent?: number; // default 8%
  annualMaintenanceReserve?: number; // default 1% of price
}

export interface InvestmentMetrics {
  grossAnnualIncome: number;
  effectiveGrossIncome: number; // after vacancy deduction
  totalOperatingExpenses: number;
  netOperatingIncome: number; // NOI
  grossRentalYieldPercent: number; // (Annual rent / Price) * 100
  capRatePercent: number; // (NOI / Price) * 100
  estimatedMonthlyCashFlow: number;
  yieldRating: "High Yield" | "Market Average" | "Appreciation Focused";
}

/**
 * Calculates investment performance and rental returns.
 */
export function calculateInvestmentMetrics(inputs: InvestmentInputs): InvestmentMetrics {
  const {
    purchasePrice,
    monthlyRentalIncome,
    annualPropertyTax = Math.round(purchasePrice * 0.012),
    annualInsurance = 1200,
    annualHOAFees = 0,
    vacancyRatePercent = 5,
    propertyManagementRatePercent = 8,
    annualMaintenanceReserve = Math.round(purchasePrice * 0.01),
  } = inputs;

  const grossAnnualIncome = monthlyRentalIncome * 12;
  const vacancyDeduction = grossAnnualIncome * (vacancyRatePercent / 100);
  const effectiveGrossIncome = grossAnnualIncome - vacancyDeduction;

  const managementFees = effectiveGrossIncome * (propertyManagementRatePercent / 100);
  const totalOperatingExpenses = Math.round(
    annualPropertyTax + annualInsurance + annualHOAFees + managementFees + annualMaintenanceReserve
  );

  const netOperatingIncome = Math.round(effectiveGrossIncome - totalOperatingExpenses);
  const estimatedMonthlyCashFlow = Math.round(netOperatingIncome / 12);

  const grossRentalYieldPercent =
    purchasePrice > 0 ? Math.round((grossAnnualIncome / purchasePrice) * 1000) / 10 : 0;
  const capRatePercent =
    purchasePrice > 0 ? Math.round((netOperatingIncome / purchasePrice) * 1000) / 10 : 0;

  let yieldRating: "High Yield" | "Market Average" | "Appreciation Focused" = "Market Average";
  if (capRatePercent >= 7.0) {
    yieldRating = "High Yield";
  } else if (capRatePercent < 4.5) {
    yieldRating = "Appreciation Focused";
  }

  return {
    grossAnnualIncome,
    effectiveGrossIncome: Math.round(effectiveGrossIncome),
    totalOperatingExpenses,
    netOperatingIncome,
    grossRentalYieldPercent,
    capRatePercent,
    estimatedMonthlyCashFlow,
    yieldRating,
  };
}
