import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { calculateSellerNetSheet, SellerNetSheetInputs } from '../../utils/sellerNetSheetEngine';
import { formatCurrency } from '../../utils/format';

export interface SellerNetSheetCardProps {
  inputs?: Partial<SellerNetSheetInputs>;
}

export const SellerNetSheetCard: React.FC<SellerNetSheetCardProps> = ({ inputs }) => {
  const defaultInputs: SellerNetSheetInputs = {
    expectedSalePrice: 580000,
    mortgagePayoffBalance: 240000,
    brokerCommissionPercent: 5.0,
    transferTaxRatePercent: 1.0,
    titleAndEscrowFees: 1800,
    ...inputs,
  };

  const result = calculateSellerNetSheet(defaultInputs);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Seller Net Sheet</Text>
          <Text style={styles.subtitle}>Estimated Home Sale Net Proceeds</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{result.proceedsAsPercentOfSale}% NET</Text>
        </View>
      </View>

      {/* Hero Proceeds Banner */}
      <View style={styles.heroBox}>
        <Text style={styles.heroLabel}>ESTIMATED NET CASH AT CLOSING</Text>
        <Text style={styles.heroAmount}>{formatCurrency(result.netEstimatedProceeds)}</Text>
        <Text style={styles.heroSub}>
          From {formatCurrency(result.expectedSalePrice)} sale price
        </Text>
      </View>

      {/* Deductions Breakdown */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Mortgage Payoff</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(defaultInputs.mortgagePayoffBalance)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Commission (5%)</Text>
          <Text style={styles.metricValue}>{formatCurrency(result.totalBrokerCommission)}</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Transfer & Escrow</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(result.transferTax + (defaultInputs.titleAndEscrowFees || 0))}
          </Text>
        </View>
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
  titleGroup: {
    flex: 1,
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
  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accentDark,
  },
  heroBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  heroAmount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '800',
    color: colors.accentDark,
    marginVertical: 4,
  },
  heroSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
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
});

export default SellerNetSheetCard;
