import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property, VisitAppointment, UserProfile, Notification } from '../types';
import { properties as mockProperties, notifications as mockNotifications } from '../data';

interface AppContextType {
  properties: Property[];
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  appointments: VisitAppointment[];
  addAppointment: (appointment: VisitAppointment) => void;
  cancelAppointment: (appointmentId: string) => void;
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  recentlyViewed: string[];
  addToRecentlyViewed: (propertyId: string) => void;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  clearAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  preferredLocation: 'New York',
  preferredPropertyTypes: ['apartment', 'house'],
  notificationEnabled: true,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [properties] = useState<Property[]>(mockProperties);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<VisitAppointment[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [favs, appts, prof, recent, onboard] = await Promise.all([
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('appointments'),
        AsyncStorage.getItem('profile'),
        AsyncStorage.getItem('recentlyViewed'),
        AsyncStorage.getItem('onboardingCompleted'),
      ]);
      if (favs) setFavorites(JSON.parse(favs));
      if (appts) setAppointments(JSON.parse(appts));
      if (prof) setProfile(JSON.parse(prof));
      if (recent) setRecentlyViewed(JSON.parse(recent));
      if (onboard) setOnboardingCompleted(JSON.parse(onboard));
    } catch (e) {
      // ignore
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  const addAppointment = async (appointment: VisitAppointment) => {
    setAppointments((prev) => {
      const newAppts = [...prev, appointment];
      AsyncStorage.setItem('appointments', JSON.stringify(newAppts));
      return newAppts;
    });
  };

  const cancelAppointment = async (appointmentId: string) => {
    setAppointments((prev) => {
      const newAppts = prev.map((a) => (a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a));
      AsyncStorage.setItem('appointments', JSON.stringify(newAppts));
      return newAppts;
    });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updates };
      AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addToRecentlyViewed = async (propertyId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== propertyId);
      const newRecent = [propertyId, ...filtered].slice(0, 10);
      AsyncStorage.setItem('recentlyViewed', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const completeOnboarding = async () => {
    setOnboardingCompleted(true);
    await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(true));
  };

  const clearAllData = async () => {
    await AsyncStorage.multiRemove(['favorites', 'appointments', 'profile', 'recentlyViewed', 'onboardingCompleted']);
    setFavorites([]);
    setAppointments([]);
    setProfile(defaultProfile);
    setRecentlyViewed([]);
    setOnboardingCompleted(false);
  };

  return (
    <AppContext.Provider
      value={{
        properties,
        favorites,
        toggleFavorite,
        isFavorite,
        appointments,
        addAppointment,
        cancelAppointment,
        profile,
        updateProfile,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        recentlyViewed,
        addToRecentlyViewed,
        onboardingCompleted,
        completeOnboarding,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
