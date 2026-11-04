import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { calculateClosingCosts, LoanProgram } from '../../utils/closingCostEngine';
import { formatCurrency } from '../../utils/format';

export interface ClosingCostEstimatorCardProps {
  propertyPrice?: number;
  initialDownPayment?: number;
}

export const ClosingCostEstimatorCard: React.FC<ClosingCostEstimatorCardProps> = ({
  propertyPrice = 450000,
  initialDownPayment = 90000,
}) => {
  const [loanProgram, setLoanProgram] = useState<LoanProgram>('conventional');
  const [showItemized, setShowItemized] = useState<boolean>(false);

  const breakdown = calculateClosingCosts(propertyPrice, initialDownPayment, loanProgram);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Buyer Closing Cost & Cash-to-Close</Text>
          <Text style={styles.subtitle}>
            Price: {formatCurrency(propertyPrice)} · Down: {formatCurrency(initialDownPayment)}
          </Text>
        </View>
        <View style={styles.pctBadge}>
          <Text style={styles.pctBadgeText}>{breakdown.closingCostPercentageOfPrice}% of Price</Text>
        </View>
      </View>

      {/* Program Selector Tabs */}
      <View style={styles.programTabsRow}>
        {(['conventional', 'fha', 'va'] as LoanProgram[]).map((prog) => (
          <TouchableOpacity
            key={prog}
            style={[styles.programTab, loanProgram === prog && styles.programTabActive]}
            onPress={() => setLoanProgram(prog)}
            activeOpacity={0.8}
          >
            <Text style={[styles.programTabText, loanProgram === prog && styles.programTabTextActive]}>
              {prog.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Primary Cash to Close Banner */}
      <View style={styles.cashBanner}>
        <Text style={styles.cashLabel}>Total Cash Required at Closing Table</Text>
        <Text style={styles.cashAmount}>{formatCurrency(breakdown.totalCashToClose)}</Text>
        <Text style={styles.cashSub}>
          Includes {formatCurrency(breakdown.downPayment)} down payment + {formatCurrency(breakdown.totalClosingCosts)} closing fees
        </Text>
      </View>

      {/* Metric Breakdown Grid */}
      <View style={styles.metricGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Loan Amount</Text>
          <Text style={styles.metricValue}>{formatCurrency(breakdown.loanAmount)}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Total Closing Fees</Text>
          <Text style={[styles.metricValue, { color: colors.accentDark }]}>
            {formatCurrency(breakdown.totalClosingCosts)}
          </Text>
        </View>
      </View>

      {/* Toggle Itemized List */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowItemized(!showItemized)}
        activeOpacity={0.8}
      >
        <Text style={styles.toggleButtonText}>
          {showItemized ? '▲ Hide Itemized Fee Schedule' : `▼ View Itemized Fee Schedule (${breakdown.itemizedCosts.length} items)`}
        </Text>
      </TouchableOpacity>

      {showItemized && (
        <View style={styles.itemizedList}>
          {breakdown.itemizedCosts.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pctBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pctBadgeText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentDark,
  },
  programTabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  programTab: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  programTabActive: {
    backgroundColor: colors.primary,
  },
  programTabText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  programTabTextActive: {
    color: colors.card,
    fontWeight: typography.fontWeight.bold,
  },
  cashBanner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cashLabel: {
    fontSize: typography.fontSize.xs,
    color: '#94A3B8',
    fontWeight: typography.fontWeight.medium,
  },
  cashAmount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.extrabold,
    color: colors.card,
    marginVertical: 4,
  },
  cashSub: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  toggleButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggleButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accentDark,
  },
  itemizedList: {
    marginTop: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  itemCategory: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  itemAmount: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
});
