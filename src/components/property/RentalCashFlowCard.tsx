import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { calculateRentalCashFlow, RentalCashFlowInputs } from '../../utils/rentalCashFlowEngine';
import { formatCurrency } from '../../utils/format';

export interface RentalCashFlowCardProps {
  inputs?: Partial<RentalCashFlowInputs>;
}

export const RentalCashFlowCard: React.FC<RentalCashFlowCardProps> = ({ inputs }) => {
  const defaultInputs: RentalCashFlowInputs = {
    purchasePrice: 420000,
    downPayment: 84000,
    monthlyRent: 2950,
    monthlyMortgagePayment: 1850,
    annualPropertyTaxes: 4800,
    annualInsurance: 1500,
    monthlyHoa: 120,
    vacancyRatePercent: 5.0,
    propertyManagementPercent: 8.0,
    maintenanceReservePercent: 5.0,
    ...inputs,
  };

  const result = calculateRentalCashFlow(defaultInputs);
  const isPositiveCashFlow = result.monthlyNetCashFlow >= 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>Rental Cash Flow & Yield</Text>
          <Text style={styles.subtitle}>
            Gross Rent: {formatCurrency(defaultInputs.monthlyRent)}/mo · EGI: {formatCurrency(result.effectiveGrossMonthlyIncome)}/mo
          </Text>
        </View>
        <View style={[styles.tierBadge, { backgroundColor: result.tierColor + '20', borderColor: result.tierColor }]}>
          <Text style={[styles.tierText, { color: result.tierColor }]}>{result.cashFlowTier}</Text>
        </View>
      </View>

      {/* Net Monthly Cash Flow Hero */}
      <View style={styles.heroBanner}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroLabel}>Net Monthly Cash Flow</Text>
          <Text
            style={[
              styles.heroAmount,
              { color: isPositiveCashFlow ? colors.success : colors.error },
            ]}
          >
            {isPositiveCashFlow ? `+${formatCurrency(result.monthlyNetCashFlow)}` : `-${formatCurrency(Math.abs(result.monthlyNetCashFlow))}`}
            <Text style={styles.heroUnit}> /mo</Text>
          </Text>
          <Text style={styles.heroAnnual}>
            Annualized: {formatCurrency(result.annualNetCashFlow)}/year
          </Text>
        </View>

        <View style={styles.heroRight}>
          <View style={styles.ratePill}>
            <Text style={styles.ratePillLabel}>Cap Rate</Text>
            <Text style={styles.ratePillValue}>{result.capRatePercent}%</Text>
          </View>
          <View style={[styles.ratePill, { marginTop: spacing.xs }]}>
            <Text style={styles.ratePillLabel}>CoC Return</Text>
            <Text style={styles.ratePillValue}>{result.cashOnCashReturnPercent}%</Text>
          </View>
        </View>
      </View>

      {/* Operating Expense & NOI Breakdown */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Monthly NOI</Text>
          <Text style={styles.metricValue}>{formatCurrency(result.monthlyNetOperatingIncome)}</Text>
          <Text style={styles.metricSub}>Before debt service</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Operating Expenses</Text>
          <Text style={styles.metricValue}>{formatCurrency(result.totalMonthlyOperatingExpenses)}</Text>
          <Text style={styles.metricSub}>{result.operatingExpenseRatioPercent}% of rent</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Debt Service (P&I)</Text>
          <Text style={styles.metricValue}>{formatCurrency(result.monthlyDebtService)}</Text>
          <Text style={styles.metricSub}>Mortgage obligation</Text>
        </View>
      </View>

      {/* Recommendation Banner */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationTitle}>ANALYSIS & STRATEGY</Text>
        <Text style={styles.recommendationText}>{result.recommendation}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
  },
  heroBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  heroLeft: {
    flex: 1,
  },
  heroLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  heroAmount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '800',
    marginVertical: 2,
  },
  heroUnit: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  heroAnnual: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  heroRight: {
    alignItems: 'flex-end',
  },
  ratePill: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    minWidth: 80,
  },
  ratePillLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  ratePillValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricItem: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  metricSub: {
    fontSize: 9,
    color: colors.textLight,
    marginTop: 1,
  },
  recommendationBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  recommendationTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});

export default RentalCashFlowCard;
