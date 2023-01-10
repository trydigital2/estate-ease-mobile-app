import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { useApp } from '../../store/AppContext';
import { PropertyCard } from '../../components/property/PropertyCard';
import { EmptyState } from '../../components/common/EmptyState';

export const SavedScreen = () => {
  const navigation = useNavigation<any>();
  const { properties, favorites } = useApp();

  const savedProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Properties</Text>
        <Text style={styles.count}>{savedProperties.length} saved</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedProperties.length === 0 ? (
          <EmptyState
            iconName="heart-outline"
            title="No Saved Properties"
            message="Start saving properties you like to see them here"
            actionLabel="Explore Properties"
            onAction={() => navigation.navigate('Explore')}
          />
        ) : (
          savedProperties.map((property) => (
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
  count: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});
