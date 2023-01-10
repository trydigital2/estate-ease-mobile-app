import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useApp } from '../../store/AppContext';
import { formatCurrency, formatArea } from '../../utils/format';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { agents } from '../../data';

export const PropertyDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { propertyId } = route.params;
  const { properties, toggleFavorite, isFavorite, addToRecentlyViewed } = useApp();
  
  const property = properties.find((p) => p.id === propertyId);
  const agent = agents.find((a) => a.id === property?.agentId);
  const favorite = property ? isFavorite(property.id) : false;

  React.useEffect(() => {
    if (property) {
      addToRecentlyViewed(property.id);
    }
  }, [property]);

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Property not found</Text>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${property.title} - ${formatCurrency(property.price, property.currency)} on EstateEase`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share property');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: property.images[0] }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={19} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatCurrency(property.price, property.currency)}</Text>
              <Text style={styles.listingType}>{property.listingType === 'buy' ? 'For Sale' : 'For Rent'}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteBtn} onPress={() => toggleFavorite(property.id)}>
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={22}
                color={colors.error}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{property.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Ionicons name="location-outline" size={15} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.location}>{property.address}, {property.city}</Text>
          </View>

          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={17} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.featureText}>{property.bedrooms} Beds</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={17} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.featureText}>{property.bathrooms} Baths</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="scan-outline" size={17} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.featureText}>{formatArea(property.area, property.areaUnit)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, idx) => (
                <View key={idx} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.accent} style={{ marginRight: 6 }} />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{property.propertyType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{property.availabilityStatus}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Listed</Text>
                <Text style={styles.detailValue}>{new Date(property.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>

          {agent && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Agent</Text>
              <TouchableOpacity style={styles.agentCard} onPress={() => navigation.navigate('AgentProfile', { agentId: agent.id })}>
                <Image source={{ uri: agent.photo }} style={styles.agentPhoto} />
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentAgency}>{agent.agency}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Ionicons name="star" size={13} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.agentRating}>{agent.rating} ({agent.reviewsCount} reviews)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton title="Contact Agent" onPress={() => navigation.navigate('ContactAgent', { agentId: property.agentId, propertyId: property.id })} variant="outline" style={styles.bottomButton} />
        <PrimaryButton title="Schedule Visit" onPress={() => navigation.navigate('ScheduleVisit', { propertyId: property.id })} style={styles.bottomButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.border,
  },
  backButton: {
    position: 'absolute',
    top: spacing.base,
    left: spacing.base,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  shareButton: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  content: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  listingType: {
    fontSize: typography.fontSize.base,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  favoriteBtn: {
    backgroundColor: colors.card,
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  favoriteIcon: {
    fontSize: 28,
    color: colors.error,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  location: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityItem: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amenityText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  detailsGrid: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  agentCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  agentPhoto: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    marginRight: spacing.base,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  agentAgency: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  agentRating: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.base,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  bottomButton: {
    flex: 1,
  },
});
