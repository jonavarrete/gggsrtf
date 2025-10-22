import { Business, PromotionTier, SearchResult } from '../types';

const promotionPriority: Record<PromotionTier, number> = {
  premium: 3,
  gold: 2,
  silver: 1,
  none: 0,
};

export const searchService = {
  search(query: string, businesses: Business[]): SearchResult[] {
    if (!query.trim()) {
      return this.sortByPromotion(businesses).map(business => ({
        type: 'business' as const,
        business,
      }));
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    businesses.forEach(business => {
      const businessMatches =
        business.name.toLowerCase().includes(lowerQuery) ||
        business.description.toLowerCase().includes(lowerQuery) ||
        business.category.toLowerCase().includes(lowerQuery) ||
        business.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

      if (businessMatches) {
        results.push({
          type: 'business',
          business,
        });
      }

      if (business.products) {
        business.products.forEach(product => {
          const productMatches =
            product.name.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery);

          if (productMatches) {
            results.push({
              type: 'product',
              product,
              parentBusiness: business,
            });
          }
        });
      }
    });

    return this.sortResults(results);
  },

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

  sortResults(results: SearchResult[]): SearchResult[] {
    return [...results].sort((a, b) => {
      if (a.type === 'business' && b.type === 'product') return -1;
      if (a.type === 'product' && b.type === 'business') return 1;

      if (a.type === 'business' && b.type === 'business' && a.business && b.business) {
        const tierDiff = promotionPriority[b.business.promotionTier] - promotionPriority[a.business.promotionTier];
        if (tierDiff !== 0) return tierDiff;
        return b.business.rating - a.business.rating;
      }

      return 0;
    });
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
