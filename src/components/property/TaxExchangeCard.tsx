import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { calculateSection1031Exchange, Section1031Inputs } from '../../utils/taxExchangeEngine';
import { formatCurrency } from '../../utils/format';

export interface TaxExchangeCardProps {
  inputs?: Partial<Section1031Inputs>;
}

export const TaxExchangeCard: React.FC<TaxExchangeCardProps> = ({ inputs }) => {
  const defaultInputs: Section1031Inputs = {
    relinquishedSalePrice: 750000,
    relinquishedAdjustedBasis: 380000,
    relinquishedMortgageBalance: 250000,
    replacementTargetPrice: 850000,
    replacementMortgageAmount: 300000,
    capitalGainsRatePercent: 23.8,
    depreciationRecaptureRatePercent: 25.0,
    depreciationClaimed: 45000,
    ...inputs,
  };

  const summary = calculateSection1031Exchange(defaultInputs);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.label}>SECTION 1031 EXCHANGE</Text>
          <Text style={styles.headline}>Tax-Deferred Equity Rollover</Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: summary.isFullTaxDeclineAchieved
                ? colors.success + '20'
                : colors.warning + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: summary.isFullTaxDeclineAchieved ? colors.success : colors.warning,
              },
            ]}
          >
            {summary.isFullTaxDeclineAchieved ? '100% DEFERRED' : 'PARTIAL BOOT'}
          </Text>
        </View>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBox}>
        <Text style={styles.heroLabel}>ESTIMATED TAX SHELTERED</Text>
        <Text style={styles.heroAmount}>{formatCurrency(summary.estimatedTaxSaved)}</Text>
        <Text style={styles.heroSub}>
          On {formatCurrency(summary.deferredCapitalGain)} deferred capital gains
        </Text>
      </View>

      {/* Metrics Grid */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Realized Capital Gain</Text>
          <Text style={styles.gridValue}>{formatCurrency(summary.realizedCapitalGain)}</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Reinvestment Equity</Text>
          <Text style={styles.gridValue}>{formatCurrency(summary.requiredReinvestmentEquity)}</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Taxable Boot</Text>
          <Text
            style={[
              styles.gridValue,
              { color: summary.totalTaxableBoot > 0 ? colors.error : colors.textPrimary },
            ]}
          >
            {formatCurrency(summary.totalTaxableBoot)}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Replacement Target</Text>
          <Text style={styles.gridValue}>{formatCurrency(defaultInputs.replacementTargetPrice)}</Text>
        </View>
      </View>

      {/* Deadlines Section */}
      <View style={styles.deadlineContainer}>
        <View style={styles.deadlinePill}>
          <Text style={styles.deadlineDays}>{summary.identificationDeadlineDays} Days</Text>
          <Text style={styles.deadlineDesc}>Identification Period (3-Property Rule)</Text>
        </View>
        <View style={styles.deadlinePill}>
          <Text style={styles.deadlineDays}>{summary.closingDeadlineDays} Days</Text>
          <Text style={styles.deadlineDesc}>Final Replacement Closing Deadline</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  heroBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.extrabold,
    color: colors.success,
    marginVertical: 4,
  },
  heroSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  gridItem: {
    width: '50%',
    paddingVertical: spacing.xs,
  },
  gridLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  gridValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  deadlineContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  deadlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  deadlineDays: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    minWidth: 65,
  },
  deadlineDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});

export default TaxExchangeCard;
