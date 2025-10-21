import { Business, Review, User } from '../types';

const STORAGE_KEYS = {
  BUSINESSES: 'businesses',
  REVIEWS: 'reviews',
  CURRENT_USER: 'currentUser',
};

export const storageService = {
  getBusinesses(): Business[] {
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return data ? JSON.parse(data) : [];
  },

  setBusinesses(businesses: Business[]): void {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  },

  getReviews(): Review[] {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  },

  setReviews(reviews: Review[]): void {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  },

  addReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.push(review);
    this.setReviews(reviews);
    this.updateBusinessRating(review.businessId);
  },

  updateBusinessRating(businessId: string): void {
    const businesses = this.getBusinesses();
    const reviews = this.getReviews().filter(r => r.businessId === businessId);

    const businessIndex = businesses.findIndex(b => b.id === businessId);
    if (businessIndex !== -1 && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      businesses[businessIndex].rating = Math.round(avgRating * 10) / 10;
      businesses[businessIndex].reviewCount = reviews.length;
      this.setBusinesses(businesses);
    }
  },

  getReviewsByBusiness(businessId: string): Review[] {
    return this.getReviews().filter(r => r.businessId === businessId);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  initializeSampleData(): void {
    if (this.getBusinesses().length === 0) {
      const sampleBusinesses: Business[] = [
        {
          id: '1',
          name: 'La Parrilla del Chef',
          category: 'restaurant',
          description: 'Restaurante de carnes premium con ambiente acogedor',
          image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'premium',
          rating: 4.8,
          reviewCount: 127,
          address: 'Calle Principal 123',
          phone: '+1 234 567 890',
          tags: ['carnes', 'parrilla', 'premium'],
        },
        {
          id: '2',
          name: 'Club Nocturno Eclipse',
          category: 'nightlife',
          description: 'La mejor vida nocturna de la ciudad',
          image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'premium',
          rating: 4.5,
          reviewCount: 89,
          address: 'Avenida Central 456',
          tags: ['club', 'música', 'fiesta'],
        },
        {
          id: '3',
          name: 'Café Bohemio',
          category: 'restaurant',
          description: 'Café artesanal con postres caseros',
          image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'gold',
          rating: 4.6,
          reviewCount: 203,
          address: 'Plaza Mayor 789',
          tags: ['café', 'postres', 'artesanal'],
        },
        {
          id: '4',
          name: 'Cine Multiplex',
          category: 'entertainment',
          description: 'Complejo de cines con tecnología 4DX',
          image: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'gold',
          rating: 4.3,
          reviewCount: 156,
          address: 'Centro Comercial Norte',
          tags: ['cine', 'entretenimiento', '4DX'],
        },
        {
          id: '5',
          name: 'Boutique Elegance',
          category: 'shopping',
          description: 'Moda exclusiva y accesorios de diseñador',
          image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'silver',
          rating: 4.4,
          reviewCount: 67,
          address: 'Calle Fashion 321',
          tags: ['moda', 'ropa', 'accesorios'],
        },
        {
          id: '6',
          name: 'Spa Relax Total',
          category: 'service',
          description: 'Centro de bienestar y masajes terapéuticos',
          image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'silver',
          rating: 4.7,
          reviewCount: 94,
          address: 'Zona Wellness 555',
          tags: ['spa', 'masajes', 'relajación'],
        },
        {
          id: '7',
          name: 'Pizzería Napoletana',
          category: 'restaurant',
          description: 'Auténtica pizza italiana en horno de leña',
          image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'none',
          rating: 4.2,
          reviewCount: 178,
          address: 'Calle Italia 888',
          tags: ['pizza', 'italiana', 'horno de leña'],
        },
        {
          id: '8',
          name: 'Bar Deportivo Champions',
          category: 'entertainment',
          description: 'Bar deportivo con pantallas gigantes',
          image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'none',
          rating: 4.0,
          reviewCount: 112,
          address: 'Estadio Municipal',
          tags: ['deportes', 'bar', 'futbol'],
        },
      ];
      this.setBusinesses(sampleBusinesses);
    }
  },
};
