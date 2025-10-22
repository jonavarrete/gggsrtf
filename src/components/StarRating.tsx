import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

export function StarRating({ rating, reviewCount, size = 'md', theme = 'dark' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const textColor = theme === 'light' ? 'text-white' : 'text-gray-700 dark:text-gray-300';
  const countColor = theme === 'light' ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - rating < 1
                ? 'fill-yellow-400 text-yellow-400 opacity-50'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
      <span className={`${textSizes[size]} font-semibold ${textColor}`}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} ${countColor}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
