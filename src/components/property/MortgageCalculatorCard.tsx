import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, borderRadius, typography, shadows } from "../../theme";
import { calculateMortgage } from "../../utils/mortgage";
import { formatCurrency } from "../../utils/format";

interface MortgageCalculatorCardProps {
  propertyPrice: number;
}

export const MortgageCalculatorCard: React.FC<MortgageCalculatorCardProps> = ({
  propertyPrice,
}) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(30);
  const interestRate = 6.75;

  const downPayment = Math.round((propertyPrice * downPaymentPercent) / 100);
  const breakdown = calculateMortgage({
    propertyPrice,
    downPayment,
    annualInterestRate: interestRate,
    loanTermYears: termYears,
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Mortgage Estimator</Text>
          <Text style={styles.subtitle}>Estimated Monthly Payment</Text>
        </View>
        <Text style={styles.totalPrice}>
          {formatCurrency(breakdown.totalMonthlyPayment)}/mo
        </Text>
      </View>

      {/* Down payment selectors */}
      <Text style={styles.controlLabel}>Down Payment ({downPaymentPercent}%): {formatCurrency(downPayment)}</Text>
      <View style={styles.chipRow}>
        {[10, 15, 20, 25].map((pct) => (
          <TouchableOpacity
            key={pct}
            style={[styles.chip, downPaymentPercent === pct && styles.activeChip]}
            onPress={() => setDownPaymentPercent(pct)}
          >
            <Text style={[styles.chipText, downPaymentPercent === pct && styles.activeChipText]}>
              {pct}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loan term selectors */}
      <Text style={styles.controlLabel}>Loan Term</Text>
      <View style={styles.chipRow}>
        {[15, 30].map((term) => (
          <TouchableOpacity
            key={term}
            style={[styles.chip, termYears === term && styles.activeChip]}
            onPress={() => setTermYears(term)}
          >
            <Text style={[styles.chipText, termYears === term && styles.activeChipText]}>
              {term} Years Fixed
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Breakdown breakdown rows */}
      <View style={styles.breakdownContainer}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Principal & Interest ({interestRate}%)</Text>
          <Text style={styles.breakdownValue}>{formatCurrency(breakdown.monthlyPrincipalAndInterest)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Est. Property Taxes</Text>
          <Text style={styles.breakdownValue}>{formatCurrency(breakdown.monthlyPropertyTax)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Homeowners Insurance</Text>
          <Text style={styles.breakdownValue}>{formatCurrency(breakdown.monthlyInsurance)}</Text>
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
  totalPrice: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.accentDark,
  },
  controlLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
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
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
  },
  activeChipText: {
    color: colors.card,
    fontWeight: typography.fontWeight.semibold,
  },
  breakdownContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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

export default MortgageCalculatorCard;
