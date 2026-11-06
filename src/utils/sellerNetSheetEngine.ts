/**
 * Seller Net Sheet & Home Equity Proceeds Calculator Engine
 * Calculates net cash proceeds after mortgage payoff, broker commissions,
 * transfer taxes, escrow fees, and property tax prorations.
 */

export interface SellerNetSheetInputs {
  expectedSalePrice: number;
  mortgagePayoffBalance: number;
  brokerCommissionPercent?: number; // default 5.0%
  transferTaxRatePercent?: number; // default 1.0%
  titleAndEscrowFees?: number; // default $1,500
  sellerConcessionsOrRepairs?: number; // default $0
  propertyTaxProrationCredit?: number; // default $0
}

export interface SellerNetSheetResult {
  expectedSalePrice: number;
  totalBrokerCommission: number;
  transferTax: number;
  totalDeductions: number;
  netEstimatedProceeds: number;
  proceedsAsPercentOfSale: number;
  profitRatio: number;
}

export function calculateSellerNetSheet(inputs: SellerNetSheetInputs): SellerNetSheetResult {
  const {
    expectedSalePrice,
    mortgagePayoffBalance,
    brokerCommissionPercent = 5.0,
    transferTaxRatePercent = 1.0,
    titleAndEscrowFees = 1500,
    sellerConcessionsOrRepairs = 0,
    propertyTaxProrationCredit = 0,
  } = inputs;

  const safeSalePrice = Math.max(0, expectedSalePrice);
  const totalBrokerCommission = Math.round(safeSalePrice * (brokerCommissionPercent / 100));
  const transferTax = Math.round(safeSalePrice * (transferTaxRatePercent / 100));

  const totalDeductions =
    mortgagePayoffBalance +
    totalBrokerCommission +
    transferTax +
    titleAndEscrowFees +
    sellerConcessionsOrRepairs -
    propertyTaxProrationCredit;

  const netEstimatedProceeds = safeSalePrice - totalDeductions;
  const proceedsAsPercentOfSale =
    safeSalePrice > 0 ? Math.round((netEstimatedProceeds / safeSalePrice) * 1000) / 10 : 0;
  const profitRatio =
    mortgagePayoffBalance > 0
      ? Math.round((netEstimatedProceeds / mortgagePayoffBalance) * 100) / 100
      : 0;

  return {
    expectedSalePrice: safeSalePrice,
    totalBrokerCommission,
    transferTax,
    totalDeductions,
    netEstimatedProceeds,
    proceedsAsPercentOfSale,
    profitRatio,
  };
}
