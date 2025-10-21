import { Business, PromotionTier } from '../types';

const promotionPriority: Record<PromotionTier, number> = {
  premium: 3,
  gold: 2,
  silver: 1,
  none: 0,
};

export const searchService = {
  searchBusinesses(query: string, businesses: Business[]): Business[] {
    if (!query.trim()) {
      return this.sortByPromotion(businesses);
    }

    const lowerQuery = query.toLowerCase();
    const filtered = businesses.filter(business => {
      return (
        business.name.toLowerCase().includes(lowerQuery) ||
        business.description.toLowerCase().includes(lowerQuery) ||
        business.category.toLowerCase().includes(lowerQuery) ||
        business.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });

    return this.sortByPromotion(filtered);
  },

  sortByPromotion(businesses: Business[]): Business[] {
    return [...businesses].sort((a, b) => {
      const tierDiff = promotionPriority[b.promotionTier] - promotionPriority[a.promotionTier];
      if (tierDiff !== 0) return tierDiff;
      return b.rating - a.rating;
    });
  },

  groupByPromotionTier(businesses: Business[]): Record<PromotionTier | 'regular', Business[]> {
    const groups: Record<PromotionTier | 'regular', Business[]> = {
      premium: [],
      gold: [],
      silver: [],
      none: [],
      regular: [],
    };

    businesses.forEach(business => {
      if (business.promotionTier === 'none') {
        groups.regular.push(business);
      } else {
        groups[business.promotionTier].push(business);
      }
    });

    return groups;
  },
};
