/**
 * Mortgage Amortization & Accelerated Payoff Engine
 * Generates month-by-month and annual amortization schedules,
 * simulates extra monthly principal prepayments, and analyzes
 * accelerated bi-weekly payment strategies.
 */

export interface AmortizationScheduleEntry {
  periodMonth: number;
  year: number;
  monthlyPayment: number;
  principalPaid: number;
  interestPaid: number;
  extraPrincipalPaid: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
  remainingBalance: number;
}

export interface AnnualAmortizationSummary {
  year: number;
  totalPayment: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface AcceleratedPayoffResult {
  standardPayoffMonths: number;
  acceleratedPayoffMonths: number;
  monthsSaved: number;
  yearsSaved: number;
  standardMonthlyPayment: number;
  standardTotalInterest: number;
  acceleratedTotalInterest: number;
  totalInterestSaved: number;
  biWeeklyPayoffMonths: number;
  biWeeklyInterestSaved: number;
  annualSummaries: AnnualAmortizationSummary[];
}

/**
 * Generates detailed amortization schedule with optional extra monthly prepayment.
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number,
  extraMonthlyPrincipal: number = 0
): {
  entries: AmortizationScheduleEntry[];
  annualSummaries: AnnualAmortizationSummary[];
  totalInterestPaid: number;
  totalMonths: number;
} {
  const safeLoan = Math.max(0, loanAmount);
  const monthlyRate = (annualInterestRate / 100) / 12;
  const standardTotalMonths = Math.max(1, loanTermYears * 12);
  const safeExtra = Math.max(0, extraMonthlyPrincipal);

  if (safeLoan === 0) {
    return {
      entries: [],
      annualSummaries: [],
      totalInterestPaid: 0,
      totalMonths: 0,
    };
  }

  // Base monthly EMI: P * [r(1+r)^n] / [(1+r)^n - 1]
  let baseMonthlyPayment = 0;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, standardTotalMonths);
    baseMonthlyPayment = (safeLoan * monthlyRate * factor) / (factor - 1);
  } else {
    baseMonthlyPayment = safeLoan / standardTotalMonths;
  }

  const entries: AmortizationScheduleEntry[] = [];
  const annualSummaries: AnnualAmortizationSummary[] = [];

  let balance = safeLoan;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  let currentYear = 1;
  let yearPayment = 0;
  let yearPrincipal = 0;
  let yearInterest = 0;

  let month = 1;
  const maxSafeMonths = 600; // 50 years safeguard

  while (balance > 0.01 && month <= maxSafeMonths) {
    const interestForMonth = balance * monthlyRate;
    let scheduledPrincipal = baseMonthlyPayment - interestForMonth;

    if (scheduledPrincipal > balance) {
      scheduledPrincipal = balance;
    }

    let actualExtra = safeExtra;
    if (scheduledPrincipal + actualExtra > balance) {
      actualExtra = Math.max(0, balance - scheduledPrincipal);
    }

    const totalPrincipal = scheduledPrincipal + actualExtra;
    const totalPayment = scheduledPrincipal + actualExtra + interestForMonth;

    balance = Math.max(0, balance - totalPrincipal);
    cumulativePrincipal += totalPrincipal;
    cumulativeInterest += interestForMonth;

    yearPayment += totalPayment;
    yearPrincipal += totalPrincipal;
    yearInterest += interestForMonth;

    const entry: AmortizationScheduleEntry = {
      periodMonth: month,
      year: Math.ceil(month / 12),
      monthlyPayment: Math.round(totalPayment),
      principalPaid: Math.round(totalPrincipal),
      interestPaid: Math.round(interestForMonth),
      extraPrincipalPaid: Math.round(actualExtra),
      cumulativePrincipal: Math.round(cumulativePrincipal),
      cumulativeInterest: Math.round(cumulativeInterest),
      remainingBalance: Math.round(balance),
    };
    entries.push(entry);

    if (month % 12 === 0 || balance <= 0.01) {
      annualSummaries.push({
        year: currentYear,
        totalPayment: Math.round(yearPayment),
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        endingBalance: Math.round(balance),
      });
      currentYear++;
      yearPayment = 0;
      yearPrincipal = 0;
      yearInterest = 0;
    }

    month++;
  }

  return {
    entries,
    annualSummaries,
    totalInterestPaid: Math.round(cumulativeInterest),
    totalMonths: month - 1,
  };
}

/**
 * Calculates accelerated mortgage payoff analytics:
 * Compares standard amortization vs extra monthly contribution vs bi-weekly scheduling.
 */
export function calculateAcceleratedPayoff(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number,
  extraMonthlyPrincipal: number = 0
): AcceleratedPayoffResult {
  // 1. Standard Schedule
  const standard = generateAmortizationSchedule(loanAmount, annualInterestRate, loanTermYears, 0);

  // 2. Accelerated with Extra Principal
  const accelerated = generateAmortizationSchedule(
    loanAmount,
    annualInterestRate,
    loanTermYears,
    extraMonthlyPrincipal
  );

  const monthsSaved = Math.max(0, standard.totalMonths - accelerated.totalMonths);
  const yearsSaved = Math.round((monthsSaved / 12) * 10) / 10;
  const totalInterestSaved = Math.max(0, standard.totalInterestPaid - accelerated.totalInterestPaid);

  // 3. Bi-weekly Payment Simulation
  // Paying half monthly payment every 2 weeks = 26 half-payments = 13 full payments per year (1 extra payment/yr)
  const baseMonthlyPayment = standard.entries[0]?.monthlyPayment || 0;
  const biWeeklyExtraPerMonth = baseMonthlyPayment / 12;
  const biWeekly = generateAmortizationSchedule(
    loanAmount,
    annualInterestRate,
    loanTermYears,
    biWeeklyExtraPerMonth
  );

  return {
    standardPayoffMonths: standard.totalMonths,
    acceleratedPayoffMonths: accelerated.totalMonths,
    monthsSaved,
    yearsSaved,
    standardMonthlyPayment: baseMonthlyPayment,
    standardTotalInterest: standard.totalInterestPaid,
    acceleratedTotalInterest: accelerated.totalInterestPaid,
    totalInterestSaved,
    biWeeklyPayoffMonths: biWeekly.totalMonths,
    biWeeklyInterestSaved: Math.max(0, standard.totalInterestPaid - biWeekly.totalInterestPaid),
    annualSummaries: accelerated.annualSummaries,
  };
}
