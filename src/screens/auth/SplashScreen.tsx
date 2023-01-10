import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../../theme';
import { useApp } from '../../store/AppContext';

export const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const { onboardingCompleted } = useApp();

  useEffect(() => {
    setTimeout(() => {
      if (onboardingCompleted) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🏡 EstateEase</Text>
      <Text style={styles.tagline}>Find Your Dream Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.fontSize.lg,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
