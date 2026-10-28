import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography, shadows } from "../../theme";
import { calculateNeighborhoodLivability } from "../../utils/neighborhood";

interface NeighborhoodScoreCardProps {
  walkScore?: number;
  transitScore?: number;
  schoolRating?: number;
  safetyRating?: number;
}

export const NeighborhoodScoreCard: React.FC<NeighborhoodScoreCardProps> = ({
  walkScore = 84,
  transitScore = 78,
  schoolRating = 9,
  safetyRating = 8,
}) => {
  const metrics = calculateNeighborhoodLivability({
    walkScore,
    transitScore,
    schoolRating,
    safetyRating,
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Neighborhood Livability</Text>
          <Text style={styles.subtitle}>{metrics.tier} Location</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{metrics.compositeScore}/100</Text>
        </View>
      </View>

      <Text style={styles.summaryText}>{metrics.summary}</Text>

      {/* Progress Bars */}
      <View style={styles.barsContainer}>
        <View style={styles.barItem}>
          <View style={styles.barLabelRow}>
            <Text style={styles.barLabel}>Walk Score</Text>
            <Text style={styles.barValue}>{walkScore}/100</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${walkScore}%`, backgroundColor: colors.accent }]} />
          </View>
          <Text style={styles.barSub}>{metrics.walkRatingLabel}</Text>
        </View>

        <View style={styles.barItem}>
          <View style={styles.barLabelRow}>
            <Text style={styles.barLabel}>Transit Score</Text>
            <Text style={styles.barValue}>{transitScore}/100</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${transitScore}%`, backgroundColor: colors.primary }]} />
          </View>
          <Text style={styles.barSub}>{metrics.transitRatingLabel}</Text>
        </View>

        <View style={styles.barItem}>
          <View style={styles.barLabelRow}>
            <Text style={styles.barLabel}>Schools & Safety</Text>
            <Text style={styles.barValue}>{schoolRating}/10 Schools · {safetyRating}/10 Safety</Text>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.round(((schoolRating + safetyRating) / 20) * 100)}%`, backgroundColor: colors.accentDark }]} />
          </View>
        </View>
      </View>

      {/* Lifestyle Chips */}
      <View style={styles.tagsContainer}>
        {metrics.lifestyleTags.map((tag) => (
          <View key={tag} style={styles.tagBadge}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
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
    marginBottom: spacing.sm,
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
  scoreBadge: {
    backgroundColor: colors.accentDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  scoreBadgeText: {
    color: colors.card,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  summaryText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  barsContainer: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  barItem: {
    gap: 4,
  },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  barValue: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  barSub: {
    fontSize: 10,
    color: colors.textLight,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tagBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default NeighborhoodScoreCard;
