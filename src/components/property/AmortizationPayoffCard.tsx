import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius, typography, shadows } from "../../theme";
import { calculateAcceleratedPayoff } from "../../utils/amortization";
import { formatCurrency } from "../../utils/format";

export interface AmortizationPayoffCardProps {
  loanAmount?: number;
  annualInterestRate?: number;
  loanTermYears?: number;
}

export const AmortizationPayoffCard: React.FC<AmortizationPayoffCardProps> = ({
  loanAmount = 400000,
  annualInterestRate = 6.5,
  loanTermYears = 30,
}) => {
  const [extraPayment, setExtraPayment] = useState<number>(250);

  const analysis = calculateAcceleratedPayoff(
    loanAmount,
    annualInterestRate,
    loanTermYears,
    extraPayment
  );

  const quickExtraOptions = [0, 100, 250, 500];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Early Payoff Accelerator</Text>
          <Text style={styles.subtitle}>
            {formatCurrency(loanAmount)} loan · {annualInterestRate}% · {loanTermYears} yrs
          </Text>
        </View>
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsBadgeText}>
            {analysis.yearsSaved > 0 ? `-${analysis.yearsSaved} Years` : "Standard"}
          </Text>
        </View>
      </View>

      {/* Prepayment Selector Buttons */}
      <Text style={styles.sectionLabel}>Extra Monthly Principal Prepayment</Text>
      <View style={styles.selectorRow}>
        {quickExtraOptions.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionPill,
              extraPayment === opt && styles.optionPillActive,
            ]}
            onPress={() => setExtraPayment(opt)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionPillText,
                extraPayment === opt && styles.optionPillTextActive,
              ]}
            >
              {opt === 0 ? "None" : `+${formatCurrency(opt)}/mo`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Impact Stats Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Interest Saved</Text>
          <Text style={[styles.metricValue, { color: colors.accent }]}>
            {formatCurrency(analysis.totalInterestSaved)}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>New Payoff Timeline</Text>
          <Text style={styles.metricValue}>
            {Math.floor(analysis.acceleratedPayoffMonths / 12)} yrs {analysis.acceleratedPayoffMonths % 12} mos
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Standard Total Interest</Text>
          <Text style={styles.metricValueSecondary}>
            {formatCurrency(analysis.standardTotalInterest)}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>New Total Interest</Text>
          <Text style={styles.metricValueSecondary}>
            {formatCurrency(analysis.acceleratedTotalInterest)}
          </Text>
        </View>
      </View>

      {/* Bi-weekly Alternative Strategy */}
      <View style={styles.biWeeklyBox}>
        <View style={styles.biWeeklyTop}>
          <Text style={styles.biWeeklyTitle}>💡 Bi-Weekly Alternative Strategy</Text>
          <Text style={styles.biWeeklySavings}>
            Save {formatCurrency(analysis.biWeeklyInterestSaved)}
          </Text>
        </View>
        <Text style={styles.biWeeklyText}>
          Paying half your standard monthly payment every two weeks results in 13 full payments per year, cutting{" "}
          {Math.round((analysis.standardPayoffMonths - analysis.biWeeklyPayoffMonths) / 12 * 10) / 10} years off your mortgage without changing monthly lifestyle habits.
        </Text>
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
  savingsBadge: {
    backgroundColor: `${colors.accent}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  savingsBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentDark,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  selectorRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  optionPill: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  optionPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  optionPillTextActive: {
    color: colors.card,
  },
  metricsGrid: {
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
  biWeeklyBox: {
    backgroundColor: `${colors.primary}08`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  biWeeklyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  biWeeklyTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  biWeeklySavings: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentDark,
  },
  biWeeklyText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
