import { MapPin, Phone } from 'lucide-react';
import { Business } from '../types';
import { StarRating } from './StarRating';
import { PromotionBadge } from './PromotionBadge';

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <PromotionBadge tier={business.promotionTier} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {business.name}
        </h3>

        <StarRating rating={business.rating} reviewCount={business.reviewCount} />

        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
          {business.description}
        </p>

        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{business.address}</span>
          </div>

          {business.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{business.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {business.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
