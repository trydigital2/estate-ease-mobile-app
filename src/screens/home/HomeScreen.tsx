import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useApp } from '../../store/AppContext';
import { PropertyCard } from '../../components/property/PropertyCard';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { properties, profile } = useApp();
  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy');

  const featured = properties.filter((p) => p.featured).slice(0, 3);
  const recent = properties.slice(0, 4);

  const categories = [
    { label: 'Apartments', icon: 'business-outline' as const },
    { label: 'Houses', icon: 'home-outline' as const },
    { label: 'Villas', icon: 'diamond-outline' as const },
    { label: 'Studios', icon: 'cube-outline' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile.name.split(' ')[0]}</Text>
            <Text style={styles.subtitle}>Find your dream property</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Explore')}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search location, property...</Text>
        </TouchableOpacity>

        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segment, listingType === 'buy' && styles.segmentActive]}
            onPress={() => setListingType('buy')}
          >
            <Text style={[styles.segmentText, listingType === 'buy' && styles.segmentTextActive]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, listingType === 'rent' && styles.segmentActive]}
            onPress={() => setListingType('rent')}
          >
            <Text style={[styles.segmentText, listingType === 'rent' && styles.segmentTextActive]}>Rent</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Properties</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featured.map((property) => (
              <View key={property.id} style={styles.featuredCard}>
                <PropertyCard property={property} onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Explore')}
              >
                <View style={styles.categoryIconWrap}>
                  <Ionicons name={cat.icon} size={22} color={colors.primary} />
                </View>
                <Text style={styles.categoryText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recent.map((property) => (
            <PropertyCard key={property.id} property={property} onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })} />
          ))}
        </View>

        <View style={styles.quickNav}>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => navigation.navigate('Saved')}>
            <View style={styles.quickNavIconWrap}>
              <Ionicons name="heart-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickNavText}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => navigation.navigate('Visits')}>
            <View style={styles.quickNavIconWrap}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickNavText}>Visits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => navigation.navigate('RecentlyViewed')}>
            <View style={styles.quickNavIconWrap}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickNavText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => navigation.navigate('Compare')}>
            <View style={styles.quickNavIconWrap}>
              <Ionicons name="git-compare-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickNavText}>Compare</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: typography.fontSize.base,
    color: colors.textLight,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.base,
    borderRadius: borderRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
  },
  horizontalScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  featuredCard: {
    width: 300,
    marginRight: spacing.base,
  },
  categoryCard: {
    backgroundColor: colors.card,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 92,
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    marginTop: spacing.base,
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  quickNavItem: {
    alignItems: 'center',
  },
  quickNavIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickNavText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
});
