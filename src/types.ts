export type PromotionTier = 'premium' | 'gold' | 'silver' | 'none';

export type BusinessCategory = 'restaurant' | 'entertainment' | 'shopping' | 'service' | 'nightlife';

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  businessId: string;
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  image: string;
  promotionTier: PromotionTier;
  rating: number;
  reviewCount: number;
  address: string;
  phone?: string;
  website?: string;
  tags: string[];
  products?: Product[];
}

export type UserType = 'customer' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  businessId?: string;
  createdAt: string;
}

export type EventCategory = 'cinema' | 'theater';

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  image: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  userId: string;
  businessId?: string;
  createdAt: string;
}

export type PackageStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface Package {
  id: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  packageDescription: string;
  weight: number;
  dimensions: string;
  status: PackageStatus;
  price: number;
  createdAt: string;
  deliveredAt?: string;
}

export type SearchResultType = 'business' | 'product';

export interface SearchResult {
  type: SearchResultType;
  business?: Business;
  product?: Product;
  parentBusiness?: Business;
}
