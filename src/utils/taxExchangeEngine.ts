export interface Section1031Inputs {
  relinquishedSalePrice: number;
  relinquishedAdjustedBasis: number; // Original price + improvements - depreciation
  relinquishedMortgageBalance: number;
  replacementTargetPrice: number;
  replacementMortgageAmount: number;
  capitalGainsRatePercent?: number; // e.g. 20% federal + 3.8% NIIT + 5% state = ~28.8%
  depreciationRecaptureRatePercent?: number; // 25%
  depreciationClaimed?: number;
}

export interface Section1031Summary {
  realizedCapitalGain: number;
  taxableBootCash: number;
  taxableBootMortgageRelief: number;
  totalTaxableBoot: number;
  deferredCapitalGain: number;
  estimatedTaxSaved: number;
  requiredReinvestmentEquity: number;
  isFullTaxDeclineAchieved: boolean;
  identificationDeadlineDays: number; // 45 days
  closingDeadlineDays: number; // 180 days
}

/**
 * Calculates Section 1031 Like-Kind Tax-Deferred Exchange economics.
 */
export function calculateSection1031Exchange(inputs: Section1031Inputs): Section1031Summary {
  const {
    relinquishedSalePrice,
    relinquishedAdjustedBasis,
    relinquishedMortgageBalance,
    replacementTargetPrice,
    replacementMortgageAmount,
    capitalGainsRatePercent = 23.8, // 20% + 3.8% NIIT
    depreciationRecaptureRatePercent = 25.0,
    depreciationClaimed = 0,
  } = inputs;

  const totalGain = Math.max(0, relinquishedSalePrice - relinquishedAdjustedBasis);

  // Relinquished net equity available
  const netEquityRelinquished = Math.max(0, relinquishedSalePrice - relinquishedMortgageBalance);

  // Mortgage relief boot: if replacement mortgage is less than relinquished mortgage
  const mortgageReliefBoot = Math.max(0, relinquishedMortgageBalance - replacementMortgageAmount);

  // Value rule: Replacement must be equal or greater to avoid cash boot
  const priceShortfall = Math.max(0, relinquishedSalePrice - replacementTargetPrice);

  const totalBoot = Math.min(totalGain, mortgageReliefBoot + priceShortfall);
  const deferredGain = Math.max(0, totalGain - totalBoot);

  // Estimated tax saved if fully deferred
  const capGainsTax = (deferredGain * capitalGainsRatePercent) / 100;
  const depTax = (Math.min(depreciationClaimed, deferredGain) * depreciationRecaptureRatePercent) / 100;
  const estimatedTaxSaved = Math.round(capGainsTax + depTax);

  const isFullTaxDeclineAchieved = totalBoot === 0 && replacementTargetPrice >= relinquishedSalePrice;

  return {
    realizedCapitalGain: Math.round(totalGain),
    taxableBootCash: Math.round(priceShortfall),
    taxableBootMortgageRelief: Math.round(mortgageReliefBoot),
    totalTaxableBoot: Math.round(totalBoot),
    deferredCapitalGain: Math.round(deferredGain),
    estimatedTaxSaved,
    requiredReinvestmentEquity: Math.round(netEquityRelinquished),
    isFullTaxDeclineAchieved,
    identificationDeadlineDays: 45,
    closingDeadlineDays: 180,
  };
}
