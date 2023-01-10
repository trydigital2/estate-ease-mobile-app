import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useApp } from '../../store/AppContext';
import { EmptyState } from '../../components/common/EmptyState';

export const NotificationsScreen = () => {
  const navigation = useNavigation<any>();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const getNotificationIconName = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'saved_search':
        return 'search';
      case 'new_property':
        return 'home';
      case 'visit_reminder':
        return 'calendar';
      default:
        return 'notifications';
    }
  };

  const handlePress = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.propertyId) {
      navigation.navigate('PropertyDetail', { propertyId: notif.propertyId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={markAllNotificationsRead}>
            <Text style={styles.readAllText}>Mark all</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications.length === 0 ? (
          <EmptyState
            iconName="notifications-outline"
            title="No Notifications"
            message="You're all caught up! Updates regarding properties and visits will appear here."
            actionLabel="Explore Properties"
            onAction={() => navigation.navigate('Explore')}
          />
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.notificationCard, !item.read && styles.unreadCard]}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={getNotificationIconName(item.type)}
                  size={20}
                  color={!item.read ? colors.accentDark : colors.textSecondary}
                />
              </View>

              <View style={styles.contentContainer}>
                <View style={styles.topRow}>
                  <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
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
  readAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.accentDark,
    fontWeight: typography.fontWeight.semibold,
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  unreadCard: {
    backgroundColor: '#F0FDF4',
    borderColor: colors.accent,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: typography.fontWeight.bold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginLeft: spacing.xs,
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
});
