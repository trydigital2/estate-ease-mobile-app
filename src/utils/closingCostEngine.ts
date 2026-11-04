/**
 * Real Estate Closing Cost & Cash-to-Close Calculator
 * Computes itemized lender, title, government, and escrow reserves
 * for home buyers across Conventional, FHA, and VA loan programs.
 */

export type LoanProgram = 'conventional' | 'fha' | 'va';

export interface ClosingCostItem {
  id: string;
  name: string;
  category: 'Lender Fees' | 'Third-Party Services' | 'Government & Taxes' | 'Prepaids & Escrow';
  amount: number;
  description: string;
}

export interface ClosingCostBreakdown {
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  loanProgram: LoanProgram;
  itemizedCosts: ClosingCostItem[];
  totalClosingCosts: number;
  closingCostPercentageOfPrice: number;
  totalCashToClose: number;
}

/**
 * Calculates itemized buyer closing costs and total cash required at closing table.
 */
export function calculateClosingCosts(
  propertyPrice: number,
  downPayment: number,
  loanProgram: LoanProgram = 'conventional',
  annualPropertyTaxRate: number = 0.0125 // 1.25% annual property tax
): ClosingCostBreakdown {
  const safePrice = Math.max(0, propertyPrice);
  const safeDown = Math.max(0, Math.min(safePrice, downPayment));
  const loanAmount = Math.max(0, safePrice - safeDown);

  const itemizedCosts: ClosingCostItem[] = [];

  // 1. Lender Fees
  const originationRate = loanProgram === 'fha' ? 0.01 : 0.008;
  const originationFee = Math.round(loanAmount * originationRate);
  itemizedCosts.push({
    id: 'lender_origination',
    name: 'Loan Origination & Processing',
    category: 'Lender Fees',
    amount: originationFee,
    description: 'Underwriting and lender administration fees',
  });

  const creditAndFloodCert = 95;
  itemizedCosts.push({
    id: 'credit_flood',
    name: 'Credit Report & Flood Determination',
    category: 'Lender Fees',
    amount: creditAndFloodCert,
    description: 'Statutory verification reports',
  });

  // 2. Third-Party Services
  const appraisalFee = 550;
  itemizedCosts.push({
    id: 'appraisal',
    name: 'Licensed Property Appraisal',
    category: 'Third-Party Services',
    amount: appraisalFee,
    description: 'Certified appraisal of fair market value',
  });

  const inspectionFee = 450;
  itemizedCosts.push({
    id: 'inspection',
    name: 'Full Home & Pest Inspection',
    category: 'Third-Party Services',
    amount: inspectionFee,
    description: 'Comprehensive physical property inspection',
  });

  const titleInsurance = Math.round(1100 + safePrice * 0.002);
  itemizedCosts.push({
    id: 'title_insurance',
    name: 'Lender Title Insurance & Search',
    category: 'Third-Party Services',
    amount: titleInsurance,
    description: 'Guarantees unencumbered ownership transfer',
  });

  const escrowFee = 850;
  itemizedCosts.push({
    id: 'escrow_settlement',
    name: 'Settlement & Closing Escrow Fee',
    category: 'Third-Party Services',
    amount: escrowFee,
    description: 'Closing attorney and neutral escrow management',
  });

  // 3. Government & Transfer Taxes
  const recordingFee = 180;
  itemizedCosts.push({
    id: 'recording_fee',
    name: 'County Deed & Mortgage Recording',
    category: 'Government & Taxes',
    amount: recordingFee,
    description: 'Official municipal deed registration',
  });

  const transferTax = Math.round(safePrice * 0.004); // 0.4% transfer stamp
  itemizedCosts.push({
    id: 'transfer_tax',
    name: 'State & County Transfer Stamps',
    category: 'Government & Taxes',
    amount: transferTax,
    description: 'Municipal conveyance taxes',
  });

  // 4. Prepaids & Escrow Reserves
  const annualInsurance = Math.round(safePrice * 0.0045);
  itemizedCosts.push({
    id: 'prepaid_insurance',
    name: 'Prepaid Homeowners Insurance (12 Mo)',
    category: 'Prepaids & Escrow',
    amount: annualInsurance,
    description: 'First year hazard and hazard binder policy',
  });

  const taxReserveMonths = 3;
  const prepaidTaxes = Math.round((safePrice * annualPropertyTaxRate * taxReserveMonths) / 12);
  itemizedCosts.push({
    id: 'prepaid_taxes',
    name: `Property Tax Escrow (${taxReserveMonths} Mo)`,
    category: 'Prepaids & Escrow',
    amount: prepaidTaxes,
    description: 'Lender escrow buffer for impending tax assessments',
  });

  const totalClosingCosts = itemizedCosts.reduce((sum, item) => sum + item.amount, 0);
  const closingCostPercentageOfPrice =
    safePrice > 0 ? Math.round((totalClosingCosts / safePrice) * 1000) / 10 : 0;
  const totalCashToClose = safeDown + totalClosingCosts;

  return {
    propertyPrice: safePrice,
    downPayment: safeDown,
    loanAmount,
    loanProgram,
    itemizedCosts,
    totalClosingCosts,
    closingCostPercentageOfPrice,
    totalCashToClose,
  };
}
