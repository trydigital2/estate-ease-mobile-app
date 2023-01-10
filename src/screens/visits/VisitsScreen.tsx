import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useApp } from '../../store/AppContext';
import { EmptyState } from '../../components/common/EmptyState';

export const VisitsScreen = () => {
  const navigation = useNavigation<any>();
  const { appointments, cancelAppointment } = useApp();

  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const past = appointments.filter((a) => a.status === 'past' || a.status === 'cancelled');

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Visit', 'Are you sure you want to cancel this visit?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => cancelAppointment(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Visits</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Upcoming ({upcoming.length})</Text>
        {upcoming.length === 0 ? (
          <EmptyState
            iconName="calendar-outline"
            title="No Upcoming Visits"
            message="Schedule a visit to see your appointments here"
            actionLabel="Explore Properties"
            onAction={() => navigation.navigate('Explore')}
          />
        ) : (
          upcoming.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Text style={styles.appointmentTitle}>{appointment.propertyTitle}</Text>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={15} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.appointmentDate}>{appointment.date} at {appointment.time}</Text>
              </View>
              <Text style={styles.demoNote}>* Demo booking - not a real appointment</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(appointment.id)}>
                <Text style={styles.cancelButtonText}>Cancel Visit</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Past & Cancelled ({past.length})</Text>
        {past.map((appointment) => (
          <View key={appointment.id} style={[styles.appointmentCard, styles.pastCard]}>
            <Text style={styles.appointmentTitle}>{appointment.propertyTitle}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={styles.appointmentDate}>{appointment.date} at {appointment.time}</Text>
            </View>
            <Text style={[styles.status, appointment.status === 'cancelled' && styles.cancelledStatus]}>
              {appointment.status === 'cancelled' ? 'Cancelled' : 'Past'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  appointmentCard: {
    backgroundColor: colors.card,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pastCard: {
    opacity: 0.7,
  },
  appointmentTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  appointmentDate: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  demoNote: {
    fontSize: typography.fontSize.xs,
    color: colors.warning,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  cancelButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  status: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  cancelledStatus: {
    color: colors.error,
  },
});
