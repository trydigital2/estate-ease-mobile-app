export type ListingType = 'buy' | 'rent';

export type PropertyType = 'apartment' | 'house' | 'villa' | 'studio' | 'condo' | 'townhouse';

export interface Agent {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  agency: string;
  bio: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  currency: string;
  city: string;
  neighborhood: string;
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqft' | 'sqm';
  amenities: string[];
  images: string[];
  agentId: string;
  featured: boolean;
  createdAt: string;
  availabilityStatus: 'available' | 'pending' | 'sold';
  popularityScore: number;
}

export interface VisitAppointment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  date: string;
  time: string;
  status: 'upcoming' | 'past' | 'cancelled';
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'saved_search' | 'new_property' | 'visit_reminder';
  read: boolean;
  createdAt: string;
  propertyId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  preferredLocation: string;
  preferredPropertyTypes: PropertyType[];
  notificationEnabled: boolean;
}

export interface FilterState {
  listingType: ListingType | 'all';
  propertyTypes: PropertyType[];
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  minArea: number | null;
  city: string | null;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
}
