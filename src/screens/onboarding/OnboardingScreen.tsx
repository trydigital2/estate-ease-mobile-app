import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useApp } from '../../store/AppContext';

const { width } = Dimensions.get('window');

const slides = [
  {
    iconName: 'compass-outline' as const,
    title: 'Discover Properties',
    description: 'Browse thousands of properties for buy and rent in prime locations across the country.',
  },
  {
    iconName: 'heart-outline' as const,
    title: 'Save Your Favorites',
    description: 'Keep track of properties you love and compare them to find the perfect match.',
  },
  {
    iconName: 'calendar-outline' as const,
    title: 'Schedule Visits',
    description: 'Book property visits easily and manage your appointments all in one place.',
  },
];

export const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation<any>();
  const { completeOnboarding } = useApp();

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await completeOnboarding();
      navigation.replace('MainTabs');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PrimaryButton title="Skip" onPress={handleSkip} variant="outline" style={styles.skipButton} />
      </View>
      <View style={styles.slideContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name={slides[currentSlide].iconName} size={64} color={colors.primary} />
        </View>
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentSlide && styles.activeDot]} />
          ))}
        </View>
        <PrimaryButton title={currentSlide === slides.length - 1 ? 'Get Started' : 'Next'} onPress={handleNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'flex-end',
  },
  skipButton: {
    minHeight: 40,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    padding: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
});
