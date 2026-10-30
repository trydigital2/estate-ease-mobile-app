import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius, typography, shadows } from "../../theme";
import { calculatePropertyAppreciation } from "../../utils/propertyAppreciation";
import { formatCurrency } from "../../utils/format";

export interface PropertyAppreciationCardProps {
  purchasePrice?: number;
  downPayment?: number;
  annualAppreciationRate?: number;
  renovationCost?: number;
}

export const PropertyAppreciationCard: React.FC<PropertyAppreciationCardProps> = ({
  purchasePrice = 500000,
  downPayment = 100000,
  annualAppreciationRate = 4.5,
  renovationCost = 25000,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<5 | 10 | 20 | 30>(10);

  const result = calculatePropertyAppreciation({
    purchasePrice,
    downPayment,
    annualAppreciationRate,
    renovationCost,
  });

  const activeMilestone =
    selectedHorizon === 5
      ? result.year5
      : selectedHorizon === 10
      ? result.year10
      : selectedHorizon === 20
      ? result.year20
      : result.year30;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Equity & Appreciation Forecast</Text>
          <Text style={styles.subtitle}>
            Initial: {formatCurrency(result.initialInvestment)} · Immediate ARV: {formatCurrency(result.immediateARV)}
          </Text>
        </View>
        <View style={styles.multiplierBadge}>
          <Text style={styles.multiplierText}>{result.tenYearEquityMultiplier}x in 10Y</Text>
        </View>
      </View>

      {/* Horizon Selector Tabs */}
      <View style={styles.tabsRow}>
        {([5, 10, 20, 30] as const).map((yr) => (
          <TouchableOpacity
            key={yr}
            style={[styles.tab, selectedHorizon === yr && styles.tabActive]}
            onPress={() => setSelectedHorizon(yr)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, selectedHorizon === yr && styles.tabTextActive]}>
              {yr} Years
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Horizon Metrics */}
      <View style={styles.milestoneGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Estimated Home Value</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(activeMilestone.estimatedPropertyValue)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Net Accumulated Equity</Text>
          <Text style={[styles.metricValue, { color: colors.accent }]}>
            {formatCurrency(activeMilestone.accumulatedEquity)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Remaining Mortgage</Text>
          <Text style={styles.metricValueSecondary}>
            {formatCurrency(activeMilestone.remainingMortgageBalance)}
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Equity Ownership %</Text>
          <Text style={styles.metricValueSecondary}>
            {activeMilestone.equityPercentage}% of Asset
          </Text>
        </View>
      </View>

      {/* Equity Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, activeMilestone.equityPercentage)}%` },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressSub}>Appreciation Gain: +{formatCurrency(activeMilestone.appreciationGain)}</Text>
          <Text style={styles.progressSub}>10Y IRR: {result.tenYearAnnualizedRoi}%/yr</Text>
        </View>
      </View>

      {/* Market Insight Box */}
      <View style={styles.insightBox}>
        <Text style={styles.insightText}>📈 {result.marketInsight}</Text>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  multiplierBadge: {
    backgroundColor: `${colors.accent}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  multiplierText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentDark,
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: 3,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.card,
    ...shadows.sm,
  },
  tabText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  milestoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricItem: {
    width: "47%",
  },
  metricLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.textPrimary,
  },
  metricValueSecondary: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  insightBox: {
    backgroundColor: `${colors.primary}08`,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  insightText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default PropertyAppreciationCard;
