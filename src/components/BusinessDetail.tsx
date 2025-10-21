import { X, MapPin, Phone, Globe, Star } from 'lucide-react';
import { Business, Review, User } from '../types';
import { StarRating } from './StarRating';
import { PromotionBadge } from './PromotionBadge';
import { useState } from 'react';

interface BusinessDetailProps {
  business: Business;
  reviews: Review[];
  currentUser: User | null;
  onClose: () => void;
  onAddReview: (rating: number, comment: string) => void;
}

export function BusinessDetail({ business, reviews, currentUser, onClose, onAddReview }: BusinessDetailProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Debes iniciar sesión para dejar una valoración');
      return;
    }
    onAddReview(rating, comment);
    setRating(5);
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">{business.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative h-80 rounded-xl overflow-hidden mb-6">
            <img
              src={business.image}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <PromotionBadge tier={business.promotionTier} />
            </div>
          </div>

          <div className="mb-6">
            <StarRating rating={business.rating} reviewCount={business.reviewCount} size="lg" />
          </div>

          <p className="text-gray-700 text-lg mb-6">{business.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{business.address}</span>
            </div>

            {business.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>{business.phone}</span>
              </div>
            )}

            {business.website && (
              <div className="flex items-center gap-3 text-blue-600">
                <Globe className="w-5 h-5" />
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {business.website}
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {business.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Valoraciones ({reviews.length})
            </h3>

            {currentUser && (
              <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3">Deja tu valoración</h4>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Tu calificación:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoveredStar || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comparte tu experiencia..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  rows={3}
                  required
                />

                <button
                  type="submit"
                  className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Publicar valoración
                </button>
              </form>
            )}

            {!currentUser && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <p className="text-blue-700">
                  Inicia sesión para dejar tu valoración
                </p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aún no hay valoraciones. ¡Sé el primero en dejar una!
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{review.userName}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
