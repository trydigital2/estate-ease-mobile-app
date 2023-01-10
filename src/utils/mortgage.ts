/**
 * Mortgage & Loan Calculation Utilities for Real Estate Properties
 * Calculates monthly EMI payments, interest totals, amortization breakdown,
 * and maximum home affordability based on debt-to-income (DTI) metrics.
 */

export interface MortgageInputs {
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number; // e.g. 6.5 for 6.5%
  loanTermYears: number; // e.g. 15 or 30
  annualPropertyTaxRate?: number; // e.g. 1.2%
  annualInsurance?: number; // annual insurance in USD
  monthlyHOA?: number; // Homeowners Association fee
}

export interface MortgageBreakdown {
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalLoanAmount: number;
  totalInterestPaid: number;
  downPaymentPercentage: number;
}

export interface AffordabilityInputs {
  grossMonthlyIncome: number;
  monthlyDebtObligations: number;
  downPaymentAvailable: number;
  annualInterestRate: number;
  loanTermYears: number;
}

export interface AffordabilityResult {
  maxAffordablePrice: number;
  maxMonthlyPayment: number;
  recommendedDownPayment: number;
  debtToIncomeRatio: number;
}

/**
 * Calculates standard fixed-rate monthly mortgage payment (EMI)
 * Formula: M = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageBreakdown {
  const {
    propertyPrice,
    downPayment,
    annualInterestRate,
    loanTermYears,
    annualPropertyTaxRate = 1.2,
    annualInsurance = 1200,
    monthlyHOA = 0,
  } = inputs;

  const totalLoanAmount = Math.max(0, propertyPrice - downPayment);
  const downPaymentPercentage = propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0;

  if (totalLoanAmount === 0 || annualInterestRate <= 0 || loanTermYears <= 0) {
    const monthlyTax = Math.round((propertyPrice * (annualPropertyTaxRate / 100)) / 12);
    const monthlyIns = Math.round(annualInsurance / 12);
    return {
      monthlyPrincipalAndInterest: 0,
      monthlyPropertyTax: monthlyTax,
      monthlyInsurance: monthlyIns,
      monthlyHOA,
      totalMonthlyPayment: monthlyTax + monthlyIns + monthlyHOA,
      totalLoanAmount: 0,
      totalInterestPaid: 0,
      downPaymentPercentage: 100,
    };
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;

  const monthlyPrincipalAndInterest = Math.round(totalLoanAmount * (numerator / denominator));
  const totalInterestPaid = Math.round(monthlyPrincipalAndInterest * numberOfPayments - totalLoanAmount);

  const monthlyPropertyTax = Math.round((propertyPrice * (annualPropertyTaxRate / 100)) / 12);
  const monthlyInsurance = Math.round(annualInsurance / 12);
  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyHOA;

  return {
    monthlyPrincipalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHOA,
    totalMonthlyPayment,
    totalLoanAmount,
    totalInterestPaid,
    downPaymentPercentage: Math.round(downPaymentPercentage * 10) / 10,
  };
}

/**
 * Estimates home purchasing power based on conventional 28/36 DTI rules.
 */
export function calculateAffordability(inputs: AffordabilityInputs): AffordabilityResult {
  const {
    grossMonthlyIncome,
    monthlyDebtObligations,
    downPaymentAvailable,
    annualInterestRate,
    loanTermYears,
  } = inputs;

  // Front-end rule: housing <= 28% of income
  const frontEndMax = grossMonthlyIncome * 0.28;

  // Back-end rule: (housing + debts) <= 36% of income
  const backEndMax = Math.max(0, grossMonthlyIncome * 0.36 - monthlyDebtObligations);

  const maxAllowedHousingPayment = Math.min(frontEndMax, backEndMax);

  // Reserve ~18% of monthly budget for taxes & insurance
  const estimatedPrincipalInterestPayment = maxAllowedHousingPayment * 0.82;

  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  let maxLoanAmount = 0;
  if (monthlyRate > 0) {
    const factor = (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    maxLoanAmount = estimatedPrincipalInterestPayment / factor;
  }

  const maxAffordablePrice = Math.round(maxLoanAmount + downPaymentAvailable);
  const dti = grossMonthlyIncome > 0 ? Math.round(((maxAllowedHousingPayment + monthlyDebtObligations) / grossMonthlyIncome) * 100) : 0;

  return {
    maxAffordablePrice,
    maxMonthlyPayment: Math.round(maxAllowedHousingPayment),
    recommendedDownPayment: downPaymentAvailable,
    debtToIncomeRatio: dti,
  };
}
