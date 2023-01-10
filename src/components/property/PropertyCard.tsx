import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../../types';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme';
import { formatCurrency, formatArea } from '../../utils/format';
import { useApp } from '../../store/AppContext';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  showFavorite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress, showFavorite = true }) => {
  const { toggleFavorite, isFavorite } = useApp();
  const favorite = isFavorite(property.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: property.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      {showFavorite && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={20}
            color={colors.error}
          />
        </TouchableOpacity>
      )}
      <View style={styles.content}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(property.price, property.currency)}</Text>
          <Text style={styles.listingType}>{property.listingType === 'buy' ? 'For Sale' : 'For Rent'}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} style={styles.locationIcon} />
          <Text style={styles.location} numberOfLines={1}>{property.neighborhood}, {property.city}</Text>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.detailText}>{property.bedrooms} Beds</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.detailText}>{property.bathrooms} Baths</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="scan-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.detailText}>{formatArea(property.area, property.areaUnit)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  content: {
    padding: spacing.base,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  listingType: {
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationIcon: {
    marginRight: 4,
  },
  location: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
