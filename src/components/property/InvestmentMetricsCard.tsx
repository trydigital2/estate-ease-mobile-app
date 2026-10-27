import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius, typography, shadows } from "../../theme";
import { calculateInvestmentMetrics } from "../../utils/investment";
import { formatCurrency } from "../../utils/format";

interface InvestmentMetricsCardProps {
  propertyPrice: number;
  defaultMonthlyRent?: number;
}

export const InvestmentMetricsCard: React.FC<InvestmentMetricsCardProps> = ({
  propertyPrice,
  defaultMonthlyRent = Math.round(propertyPrice * 0.0065), // ~0.65% rule
}) => {
  const [rent, setRent] = useState<number>(defaultMonthlyRent);

  const metrics = calculateInvestmentMetrics({
    purchasePrice: propertyPrice,
    monthlyRentalIncome: rent,
  });

  const getRatingBadgeColor = () => {
    switch (metrics.yieldRating) {
      case "High Yield":
        return colors.accent;
      case "Market Average":
        return colors.primary;
      default:
        return colors.warning;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Investment & Rental Yield</Text>
          <Text style={styles.subtitle}>Estimated Return on Investment</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getRatingBadgeColor() + "20" }]}>
          <Text style={[styles.badgeText, { color: getRatingBadgeColor() }]}>
            {metrics.yieldRating}
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{metrics.grossRentalYieldPercent}%</Text>
          <Text style={styles.metricLabel}>Gross Yield</Text>
          <Text style={styles.metricSub}>Annual</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{metrics.capRatePercent}%</Text>
          <Text style={styles.metricLabel}>Cap Rate</Text>
          <Text style={styles.metricSub}>Net NOI</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{formatCurrency(metrics.estimatedMonthlyCashFlow)}</Text>
          <Text style={styles.metricLabel}>Net Cash Flow</Text>
          <Text style={styles.metricSub}>/ month</Text>
        </View>
      </View>

      {/* Quick rent adjuster */}
      <Text style={styles.controlLabel}>Simulate Monthly Rent: {formatCurrency(rent)}</Text>
      <View style={styles.chipRow}>
        {[-300, 0, 300, 600].map((delta) => {
          const simulatedVal = defaultMonthlyRent + delta;
          const isSelected = rent === simulatedVal;
          return (
            <TouchableOpacity
              key={delta}
              style={[styles.chip, isSelected && styles.activeChip]}
              onPress={() => setRent(simulatedVal)}
            >
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {formatCurrency(simulatedVal)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.breakdownContainer}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Gross Annual Rent</Text>
          <Text style={styles.breakdownValue}>{formatCurrency(metrics.grossAnnualIncome)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Est. Operating Expenses</Text>
          <Text style={styles.breakdownValue}>-{formatCurrency(metrics.totalOperatingExpenses)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Net Operating Income (NOI)</Text>
          <Text style={[styles.breakdownValue, { color: colors.accentDark }]}>
            {formatCurrency(metrics.netOperatingIncome)}
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
    padding: spacing.base,
    marginVertical: spacing.md,
    ...shadows.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.primary,
  },
  metricLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textLight,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  controlLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 11,
    color: colors.textPrimary,
  },
  activeChipText: {
    color: colors.card,
    fontWeight: typography.fontWeight.semibold,
  },
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
});

export default InvestmentMetricsCard;
