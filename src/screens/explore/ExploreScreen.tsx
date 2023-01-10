import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useApp } from '../../store/AppContext';
import { PropertyCard } from '../../components/property/PropertyCard';
import { filterProperties } from '../../utils/filters';
import { FilterState } from '../../types';

export const ExploreScreen = () => {
  const navigation = useNavigation<any>();
  const { properties } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState<FilterState>({
    listingType: 'all',
    propertyTypes: [],
    minPrice: null,
    maxPrice: null,
    minBedrooms: null,
    minBathrooms: null,
    minArea: null,
    city: null,
    sortBy: 'popularity',
  });

  const filteredResults = filterProperties(properties, filters, searchQuery);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Properties</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textLight} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city, neighborhood..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, filters.listingType === 'buy' && styles.filterChipActive]}
            onPress={() => setFilters({ ...filters, listingType: filters.listingType === 'buy' ? 'all' : 'buy' })}
          >
            <Text style={[styles.filterChipText, filters.listingType === 'buy' && styles.filterChipTextActive]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filters.listingType === 'rent' && styles.filterChipActive]}
            onPress={() => setFilters({ ...filters, listingType: filters.listingType === 'rent' ? 'all' : 'rent' })}
          >
            <Text style={[styles.filterChipText, filters.listingType === 'rent' && styles.filterChipTextActive]}>Rent</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredResults.length} properties found</Text>
        <TouchableOpacity
          style={styles.viewToggleBtn}
          onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        >
          <Ionicons name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} size={18} color={colors.primary} />
          <Text style={styles.viewToggleText}>{viewMode === 'list' ? 'Grid' : 'List'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {filteredResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={56} color={colors.textLight} style={{ marginBottom: spacing.md }} />
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptyMessage}>Try adjusting your filters or search criteria</Text>
            <TouchableOpacity style={styles.resetButton} onPress={() => {
              setSearchQuery('');
              setFilters({
                listingType: 'all',
                propertyTypes: [],
                minPrice: null,
                maxPrice: null,
                minBedrooms: null,
                minBathrooms: null,
                minArea: null,
                city: null,
                sortBy: 'popularity',
              });
            }}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredResults.map((property) => (
            <PropertyCard key={property.id} property={property} onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })} />
          ))
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
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.base,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  filterBar: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.base,
  },
  filterChip: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.base,
  },
  resultsCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  viewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewToggleText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  results: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.base,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
