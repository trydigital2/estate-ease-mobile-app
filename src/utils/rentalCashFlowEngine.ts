/**
 * Rental Cash Flow, Net Operating Income (NOI) & Cap Rate Analyzer Engine
 * Calculates gross rental income, vacancy loss, operating expense ratios,
 * debt service coverage, monthly net cash flow, and Cash-on-Cash return.
 */

export interface RentalCashFlowInputs {
  purchasePrice: number;
  downPayment: number;
  monthlyRent: number;
  monthlyMortgagePayment: number;
  annualPropertyTaxes: number;
  annualInsurance: number;
  monthlyHoa?: number;
  vacancyRatePercent?: number; // default 5%
  propertyManagementPercent?: number; // default 8%
  maintenanceReservePercent?: number; // default 5%
  otherMonthlyExpenses?: number;
}

export interface RentalCashFlowResult {
  effectiveGrossMonthlyIncome: number;
  totalMonthlyOperatingExpenses: number;
  monthlyNetOperatingIncome: number; // NOI (before debt service)
  annualNetOperatingIncome: number;
  monthlyDebtService: number;
  monthlyNetCashFlow: number;
  annualNetCashFlow: number;
  capRatePercent: number; // NOI / Purchase Price
  cashOnCashReturnPercent: number; // Annual Cash Flow / Initial Down Payment
  operatingExpenseRatioPercent: number;
  cashFlowTier: 'High Cash Flow' | 'Moderate Cash Flow' | 'Break-Even' | 'Negative Cash Flow';
  tierColor: string;
  recommendation: string;
}

/**
 * Evaluates comprehensive rental cash flow and investment yield.
 */
export function calculateRentalCashFlow(inputs: RentalCashFlowInputs): RentalCashFlowResult {
  const {
    purchasePrice,
    downPayment,
    monthlyRent,
    monthlyMortgagePayment,
    annualPropertyTaxes,
    annualInsurance,
    monthlyHoa = 0,
    vacancyRatePercent = 5.0,
    propertyManagementPercent = 8.0,
    maintenanceReservePercent = 5.0,
    otherMonthlyExpenses = 0,
  } = inputs;

  // 1. Vacancy & Effective Gross Income
  const monthlyVacancyLoss = monthlyRent * (Math.max(0, vacancyRatePercent) / 100);
  const effectiveGrossMonthlyIncome = Math.max(0, monthlyRent - monthlyVacancyLoss);

  // 2. Fixed & Variable Monthly Operating Expenses
  const monthlyTaxes = annualPropertyTaxes / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyManagementFee = effectiveGrossMonthlyIncome * (Math.max(0, propertyManagementPercent) / 100);
  const monthlyMaintenanceReserve = effectiveGrossMonthlyIncome * (Math.max(0, maintenanceReservePercent) / 100);

  const totalMonthlyOperatingExpenses =
    monthlyTaxes +
    monthlyInsurance +
    monthlyHoa +
    monthlyManagementFee +
    monthlyMaintenanceReserve +
    otherMonthlyExpenses;

  // 3. Net Operating Income (NOI)
  const monthlyNetOperatingIncome = effectiveGrossMonthlyIncome - totalMonthlyOperatingExpenses;
  const annualNetOperatingIncome = monthlyNetOperatingIncome * 12;

  // 4. Debt Service & Cash Flow
  const monthlyDebtService = Math.max(0, monthlyMortgagePayment);
  const monthlyNetCashFlow = monthlyNetOperatingIncome - monthlyDebtService;
  const annualNetCashFlow = monthlyNetCashFlow * 12;

  // 5. Investment Metrics
  const capRatePercent =
    purchasePrice > 0
      ? Math.round((annualNetOperatingIncome / purchasePrice) * 10000) / 100
      : 0;

  const totalInvestedCapital = Math.max(1, downPayment);
  const cashOnCashReturnPercent =
    Math.round((annualNetCashFlow / totalInvestedCapital) * 10000) / 100;

  const operatingExpenseRatioPercent =
    effectiveGrossMonthlyIncome > 0
      ? Math.round((totalMonthlyOperatingExpenses / effectiveGrossMonthlyIncome) * 1000) / 10
      : 0;

  // Tier Classification
  let cashFlowTier: RentalCashFlowResult['cashFlowTier'] = 'Moderate Cash Flow';
  let tierColor = '#0284C7';
  let recommendation = '';

  if (monthlyNetCashFlow >= 450) {
    cashFlowTier = 'High Cash Flow';
    tierColor = '#10B981';
    recommendation =
      'Outstanding cash-flowing asset. Robust margin provides strong buffer against vacancy surges and interest fluctuations.';
  } else if (monthlyNetCashFlow >= 150) {
    cashFlowTier = 'Moderate Cash Flow';
    tierColor = '#0284C7';
    recommendation =
      'Healthy cash yield. Reinvest positive cash flows into capital expenditure reserves for long-term equity compounding.';
  } else if (monthlyNetCashFlow >= 0) {
    cashFlowTier = 'Break-Even';
    tierColor = '#F59E0B';
    recommendation =
      'Tight operating margins. Growth relies primarily on principal paydown and regional property appreciation.';
  } else {
    cashFlowTier = 'Negative Cash Flow';
    tierColor = '#EF4444';
    recommendation =
      'Negative cash carry. Out-of-pocket funding required monthly; evaluate rent increase potential or refinancing.';
  }

  return {
    effectiveGrossMonthlyIncome: Math.round(effectiveGrossMonthlyIncome),
    totalMonthlyOperatingExpenses: Math.round(totalMonthlyOperatingExpenses),
    monthlyNetOperatingIncome: Math.round(monthlyNetOperatingIncome),
    annualNetOperatingIncome: Math.round(annualNetOperatingIncome),
    monthlyDebtService: Math.round(monthlyDebtService),
    monthlyNetCashFlow: Math.round(monthlyNetCashFlow),
    annualNetCashFlow: Math.round(annualNetCashFlow),
    capRatePercent,
    cashOnCashReturnPercent,
    operatingExpenseRatioPercent,
    cashFlowTier,
    tierColor,
    recommendation,
  };
}
