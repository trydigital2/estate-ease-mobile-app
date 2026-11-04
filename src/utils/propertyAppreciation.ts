/**
 * Property Appreciation & Wealth Equity Forecast Engine
 * Calculates multi-year property appreciation compound growth,
 * loan amortization principal paydown, net accumulated equity,
 * and renovation value-add (After-Repair Value / ARV).
 */

export interface EquityMilestone {
  year: number;
  estimatedPropertyValue: number;
  remainingMortgageBalance: number;
  accumulatedEquity: number;
  equityPercentage: number;
  appreciationGain: number;
}

export interface PropertyAppreciationInputs {
  purchasePrice: number;
  downPayment: number;
  annualAppreciationRate?: number; // e.g. 4.5 for 4.5%
  loanInterestRate?: number; // e.g. 6.5 for 6.5%
  loanTermYears?: number; // default 30
  renovationCost?: number; // optional upfront capex
  renovationRoiPercent?: number; // e.g. 70 for 70% return on spend
}

export interface PropertyAppreciationResult {
  initialInvestment: number;
  immediateARV: number;
  year5: EquityMilestone;
  year10: EquityMilestone;
  year20: EquityMilestone;
  year30: EquityMilestone;
  milestones: EquityMilestone[];
  tenYearEquityMultiplier: number;
  tenYearAnnualizedRoi: number;
  marketInsight: string;
}

/**
 * Calculates compound property valuation and net equity growth over 30 years.
 */
export function calculatePropertyAppreciation(
  inputs: PropertyAppreciationInputs
): PropertyAppreciationResult {
  const {
    purchasePrice,
    downPayment,
    annualAppreciationRate = 4.5,
    loanInterestRate = 6.5,
    loanTermYears = 30,
    renovationCost = 0,
    renovationRoiPercent = 75,
  } = inputs;

  const safePrice = Math.max(0, purchasePrice);
  const safeDown = Math.max(0, Math.min(safePrice, downPayment));
  const safeLoan = Math.max(0, safePrice - safeDown);
  const safeReno = Math.max(0, renovationCost);

  // Immediate ARV (After Repair Value)
  const renoValueAdd = safeReno * (1 + renovationRoiPercent / 100);
  const immediateARV = Math.round(safePrice + renoValueAdd);

  const initialInvestment = safeDown + safeReno;

  // Monthly loan payment for amortization balance tracking
  const monthlyRate = (loanInterestRate / 100) / 12;
  const totalMonths = loanTermYears * 12;
  let monthlyPayment = 0;
  if (monthlyRate > 0 && totalMonths > 0 && safeLoan > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPayment = (safeLoan * monthlyRate * factor) / (factor - 1);
  } else if (totalMonths > 0) {
    monthlyPayment = safeLoan / totalMonths;
  }

  // Helper to compute remaining balance after N years
  const getRemainingBalance = (years: number): number => {
    if (safeLoan <= 0) return 0;
    const monthsElapsed = years * 12;
    if (monthsElapsed >= totalMonths) return 0;

    let balance = safeLoan;
    for (let m = 1; m <= monthsElapsed; m++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance = Math.max(0, balance - principal);
      if (balance <= 0) break;
    }
    return Math.round(balance);
  };

  const calculateMilestone = (year: number): EquityMilestone => {
    // Compound appreciation from immediate ARV
    const appreciationFactor = Math.pow(1 + annualAppreciationRate / 100, year);
    const estimatedPropertyValue = Math.round(immediateARV * appreciationFactor);
    const remainingMortgageBalance = getRemainingBalance(year);
    const accumulatedEquity = Math.max(0, estimatedPropertyValue - remainingMortgageBalance);
    const equityPercentage = estimatedPropertyValue > 0
      ? Math.min(100, Math.round((accumulatedEquity / estimatedPropertyValue) * 100))
      : 100;
    const appreciationGain = Math.max(0, estimatedPropertyValue - safePrice);

    return {
      year,
      estimatedPropertyValue,
      remainingMortgageBalance,
      accumulatedEquity,
      equityPercentage,
      appreciationGain,
    };
  };

  const keyYears = [1, 3, 5, 10, 15, 20, 25, 30];
  const milestones = keyYears.map((yr) => calculateMilestone(yr));

  const year5 = calculateMilestone(5);
  const year10 = calculateMilestone(10);
  const year20 = calculateMilestone(20);
  const year30 = calculateMilestone(30);

  // 10-year equity metrics
  const tenYearEquityMultiplier = initialInvestment > 0
    ? Math.round((year10.accumulatedEquity / initialInvestment) * 10) / 10
    : 1;

  // Annualized compound return on invested capital over 10 years: (Final / Initial)^(1/10) - 1
  let tenYearAnnualizedRoi = 0;
  if (initialInvestment > 0 && year10.accumulatedEquity > 0) {
    tenYearAnnualizedRoi = Math.round((Math.pow(year10.accumulatedEquity / initialInvestment, 1 / 10) - 1) * 1000) / 10;
  }

  let marketInsight = "Stable capital preservation with steady compounding equity through forced savings and amortization.";
  if (tenYearAnnualizedRoi >= 12) {
    marketInsight = "Exceptional wealth accumulation vehicle. Leveraged equity growth substantially outpaces historic inflation.";
  } else if (tenYearAnnualizedRoi >= 8) {
    marketInsight = "Strong institutional-grade return profile driven by balanced appreciation and consistent mortgage paydown.";
  }

  return {
    initialInvestment,
    immediateARV,
    year5,
    year10,
    year20,
    year30,
    milestones,
    tenYearEquityMultiplier,
    tenYearAnnualizedRoi,
    marketInsight,
  };
}
