import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Property } from '../../types';
import { PrimaryButton } from '../../components/common/PrimaryButton';

export const CompareScreen = () => {
  const navigation = useNavigation<any>();
  const { properties } = useApp();

  const [propA, setPropA] = useState<Property | null>(properties[0] || null);
  const [propB, setPropB] = useState<Property | null>(properties[1] || null);
  const [selectingFor, setSelectingFor] = useState<'A' | 'B' | null>(null);

  const renderComparisonRow = (label: string, valA: string | number, valB: string | number) => (
    <View style={styles.comparisonRow} key={label}>
      <Text style={styles.cellA}>{valA}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.cellB}>{valB}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Properties</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {selectingFor ? (
          <View style={styles.selectionModal}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>Select Property for Slot {selectingFor}</Text>
              <TouchableOpacity onPress={() => setSelectingFor(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {properties.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.propertyOption}
                onPress={() => {
                  if (selectingFor === 'A') setPropA(p);
                  if (selectingFor === 'B') setPropB(p);
                  setSelectingFor(null);
                }}
              >
                <Image source={{ uri: p.images[0] }} style={styles.optionImage} />
                <View style={styles.optionDetails}>
                  <Text style={styles.optionTitle} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.optionPrice}>
                    {p.currency}{p.price.toLocaleString()} • {p.city}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            {/* Header cards with image & slot switch */}
            <View style={styles.propertiesRow}>
              {/* Slot A */}
              <View style={styles.propertyCard}>
                {propA ? (
                  <>
                    <Image source={{ uri: propA.images[0] }} style={styles.cardImage} />
                    <Text style={styles.cardTitle} numberOfLines={2}>{propA.title}</Text>
                    <Text style={styles.cardPrice}>
                      {propA.currency}{propA.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      style={styles.changeButton}
                      onPress={() => setSelectingFor('A')}
                    >
                      <Text style={styles.changeText}>Change Property</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => navigation.navigate('PropertyDetail', { propertyId: propA.id })}
                    >
                      <Text style={styles.detailText}>View Details</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.emptySlot} onPress={() => setSelectingFor('A')}>
                    <Ionicons name="add" size={28} color={colors.textLight} style={{ marginBottom: 4 }} />
                    <Text style={styles.emptySlotText}>Select Property</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Slot B */}
              <View style={styles.propertyCard}>
                {propB ? (
                  <>
                    <Image source={{ uri: propB.images[0] }} style={styles.cardImage} />
                    <Text style={styles.cardTitle} numberOfLines={2}>{propB.title}</Text>
                    <Text style={styles.cardPrice}>
                      {propB.currency}{propB.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      style={styles.changeButton}
                      onPress={() => setSelectingFor('B')}
                    >
                      <Text style={styles.changeText}>Change Property</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => navigation.navigate('PropertyDetail', { propertyId: propB.id })}
                    >
                      <Text style={styles.detailText}>View Details</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={styles.emptySlot} onPress={() => setSelectingFor('B')}>
                    <Ionicons name="add" size={28} color={colors.textLight} style={{ marginBottom: 4 }} />
                    <Text style={styles.emptySlotText}>Select Property</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Comparison specs table */}
            {propA && propB && (
              <View style={styles.tableCard}>
                <Text style={styles.tableTitle}>Key Specifications</Text>

                {renderComparisonRow('Type', propA.propertyType.toUpperCase(), propB.propertyType.toUpperCase())}
                {renderComparisonRow('Listing', propA.listingType.toUpperCase(), propB.listingType.toUpperCase())}
                {renderComparisonRow('Bedrooms', `${propA.bedrooms} Beds`, `${propB.bedrooms} Beds`)}
                {renderComparisonRow('Bathrooms', `${propA.bathrooms} Baths`, `${propB.bathrooms} Baths`)}
                {renderComparisonRow('Area', `${propA.area} ${propA.areaUnit}`, `${propB.area} ${propB.areaUnit}`)}
                {renderComparisonRow('City', propA.city, propB.city)}
                {renderComparisonRow('Neighborhood', propA.neighborhood, propB.neighborhood)}
                {renderComparisonRow('Status', propA.availabilityStatus, propB.availabilityStatus)}

                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesTitle}>Amenities</Text>
                  <View style={styles.amenitiesRow}>
                    <View style={styles.amenityColumn}>
                      {propA.amenities.map((a, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
                          <Ionicons name="checkmark-circle" size={13} color={colors.accent} style={{ marginRight: 4 }} />
                          <Text style={styles.amenityItem}>{a}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.amenityDivider} />
                    <View style={styles.amenityColumn}>
                      {propB.amenities.map((a, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
                          <Ionicons name="checkmark-circle" size={13} color={colors.accent} style={{ marginRight: 4 }} />
                          <Text style={styles.amenityItem}>{a}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  backButton: {
    padding: spacing.xs,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    padding: spacing.base,
  },
  propertiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  propertyCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginHorizontal: 4,
    ...shadows.sm,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    minHeight: 36,
  },
  cardPrice: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentDark,
    marginVertical: 4,
  },
  changeButton: {
    backgroundColor: colors.background,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginTop: 4,
  },
  changeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  detailButton: {
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 2,
  },
  detailText: {
    fontSize: typography.fontSize.xs,
    color: colors.accentDark,
    fontWeight: typography.fontWeight.medium,
  },
  emptySlot: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  plusIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  emptySlotText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  tableCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  tableTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cellA: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  rowLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  cellB: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  amenitiesSection: {
    marginTop: spacing.base,
  },
  amenitiesTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  amenitiesRow: {
    flexDirection: 'row',
  },
  amenityColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  amenityDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  amenityItem: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginVertical: 2,
  },
  selectionModal: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    ...shadows.sm,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  cancelText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
  },
  propertyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  optionDetails: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  optionPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.accentDark,
    marginTop: 2,
  },
});
