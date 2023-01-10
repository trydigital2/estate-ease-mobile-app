import { Property, FilterState } from '../types';

export const filterProperties = (properties: Property[], filters: FilterState, searchQuery: string = ''): Property[] => {
  let result = [...properties];

  // Search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.neighborhood.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query)
    );
  }

  // Listing type
  if (filters.listingType !== 'all') {
    result = result.filter((p) => p.listingType === filters.listingType);
  }

  // Property types
  if (filters.propertyTypes.length > 0) {
    result = result.filter((p) => filters.propertyTypes.includes(p.propertyType));
  }

  // Price range
  if (filters.minPrice !== null) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  // Bedrooms
  if (filters.minBedrooms !== null) {
    result = result.filter((p) => p.bedrooms >= filters.minBedrooms!);
  }

  // Bathrooms
  if (filters.minBathrooms !== null) {
    result = result.filter((p) => p.bathrooms >= filters.minBathrooms!);
  }

  // Area
  if (filters.minArea !== null) {
    result = result.filter((p) => p.area >= filters.minArea!);
  }

  // City
  if (filters.city) {
    result = result.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
  }

  // Sorting
  switch (filters.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popularity':
      result.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
  }

  return result;
};
