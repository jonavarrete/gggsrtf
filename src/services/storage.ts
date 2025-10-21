import { Business, Review, User, Event } from '../types';

const STORAGE_KEYS = {
  BUSINESSES: 'businesses',
  REVIEWS: 'reviews',
  CURRENT_USER: 'currentUser',
  USERS: 'users',
  EVENTS: 'events',
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

  createBusinessUser(name: string, email: string, businessId: string): User {
    const user: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      email,
      type: 'business',
      businessId,
      createdAt: new Date().toISOString(),
    };
    return user;
  },

  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  setUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.setUsers(users);
  },

  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.setUsers(users);
    }
    if (this.getCurrentUser()?.id === updatedUser.id) {
      this.setCurrentUser(updatedUser);
    }
  },

  upgradeUserToBusiness(userId: string, businessData: Omit<Business, 'id' | 'rating' | 'reviewCount'>): { user: User; business: Business } {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    const businessId = Date.now().toString();
    const business: Business = {
      ...businessData,
      id: businessId,
      rating: 0,
      reviewCount: 0,
    };

    const businesses = this.getBusinesses();
    businesses.push(business);
    this.setBusinesses(businesses);

    users[userIndex] = {
      ...users[userIndex],
      type: 'business',
      businessId,
    };
    this.setUsers(users);
    this.setCurrentUser(users[userIndex]);

    return { user: users[userIndex], business };
  },

  getEvents(): Event[] {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },

  setEvents(events: Event[]): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getEventsByUser(userId: string): Event[] {
    return this.getEvents().filter(e => e.userId === userId);
  },

  getEventsByBusiness(businessId: string): Event[] {
    return this.getEvents().filter(e => e.businessId === businessId);
  },

  getCinemaAndTheaterBusinesses(): Business[] {
    return this.getBusinesses().filter(b =>
      b.category === 'entertainment' &&
      (b.tags.some(tag => tag.toLowerCase().includes('cine') || tag.toLowerCase().includes('teatro')))
    );
  },

  addEvent(event: Event): void {
    const events = this.getEvents();
    events.push(event);
    this.setEvents(events);
  },

  updateEvent(updatedEvent: Event): void {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      this.setEvents(events);
    }
  },

  deleteEvent(eventId: string): void {
    const events = this.getEvents().filter(e => e.id !== eventId);
    this.setEvents(events);
  },

  initializeSampleData(): void {
    if (this.getUsers().length === 0) {
      const sampleUsers: User[] = [
        {
          id: 'user-1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          type: 'customer',
          createdAt: new Date().toISOString(),
        },
      ];
      this.setUsers(sampleUsers);
    }

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
        {
          id: '9',
          name: 'Teatro Nacional',
          category: 'entertainment',
          description: 'Teatro clásico con obras de talla mundial',
          image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=800',
          promotionTier: 'gold',
          rating: 4.8,
          reviewCount: 234,
          address: 'Avenida de las Artes 100',
          phone: '+1 234 567 891',
          tags: ['teatro', 'cultura', 'entretenimiento'],
        },
      ];
      this.setBusinesses(sampleBusinesses);
    }
  },
};
