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
}

export interface User {
  id: string;
  name: string;
  email: string;
}
