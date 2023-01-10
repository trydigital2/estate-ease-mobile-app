import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useApp } from '../../store/AppContext';
import { PrimaryButton } from '../../components/common/PrimaryButton';

const dates = ['Oct 23, 2026', 'Oct 24, 2026', 'Oct 25, 2026', 'Oct 26, 2026'];
const times = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

export const ScheduleVisitScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { propertyId } = route.params;
  const { properties, addAppointment } = useApp();
  
  const property = properties.find((p) => p.id === propertyId);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }

    const appointment = {
      id: `appt-${Date.now()}`,
      propertyId: property!.id,
      propertyTitle: property!.title,
      propertyImage: property!.images[0],
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming' as const,
    };

    await addAppointment(appointment);
    Alert.alert('Success', 'Visit scheduled successfully! (Demo booking)', [
      { text: 'View Visits', onPress: () => navigation.navigate('MainTabs', { screen: 'Visits' }) },
      { text: 'OK' },
    ]);
  };

  if (!property) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Schedule Visit</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
          <Ionicons name="location-outline" size={15} color={colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.propertyLocation}>{property.neighborhood}, {property.city}</Text>
        </View>
        <Text style={styles.demoNote}>* This is a demo booking. No real appointment will be made.</Text>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.optionsGrid}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date}
              style={[styles.option, selectedDate === date && styles.optionActive]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.optionText, selectedDate === date && styles.optionTextActive]}>{date}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.optionsGrid}>
          {times.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.option, selectedTime === time && styles.optionActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.optionText, selectedTime === time && styles.optionTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton title="Confirm Booking" onPress={handleSchedule} />
      </View>
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
    padding: spacing.lg,
  },
  backIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  propertyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  propertyLocation: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  demoNote: {
    fontSize: typography.fontSize.sm,
    color: colors.warning,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
    marginTop: spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '45%',
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  bottomBar: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
