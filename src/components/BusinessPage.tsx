import { ArrowLeft, MapPin, Phone, Globe, Star, ShoppingCart } from 'lucide-react';
import { Business, Review, User, Event, Product } from '../types';
import { StarRating } from './StarRating';
import { PromotionBadge } from './PromotionBadge';
import { BusinessEvents } from './BusinessEvents';
import { useState } from 'react';

interface BusinessPageProps {
  business: Business;
  reviews: Review[];
  events: Event[];
  currentUser: User | null;
  onBack: () => void;
  onAddReview: (rating: number, comment: string) => void;
  onAddEvent?: () => void;
}

export function BusinessPage({ business, reviews, events, currentUser, onBack, onAddReview, onAddEvent }: BusinessPageProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'events'>('menu');

  const isCinemaOrTheater = business.category === 'entertainment' &&
    (business.tags.some(tag => tag.toLowerCase().includes('cine') || tag.toLowerCase().includes('teatro')));
  const canAddEvent = currentUser !== null && isCinemaOrTheater;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative h-80 sm:h-96 bg-gradient-to-b from-gray-900 to-gray-800">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover opacity-60"
        />

        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>

        <div className="absolute top-4 right-4">
          <PromotionBadge tier={business.promotionTier} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{business.name}</h1>
            <StarRating rating={business.rating} reviewCount={business.reviewCount} size="lg" theme="light" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Acerca de</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{business.description}</p>

              <div className="flex flex-wrap gap-2 mt-6">
                {business.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  {business.products && business.products.length > 0 && (
                    <button
                      onClick={() => setActiveTab('menu')}
                      className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                        activeTab === 'menu'
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      Menú
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                      activeTab === 'reviews'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Valoraciones ({reviews.length})
                  </button>
                  {isCinemaOrTheater && (
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                        activeTab === 'events'
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      Cartelera
                    </button>
                  )}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'menu' && business.products && business.products.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Nuestros Productos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.products.map((product: Product) => (
                        <div key={product.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{product.name}</h4>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap ml-2">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{product.description}</p>
                            <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                              <ShoppingCart className="w-4 h-4" />
                              Ordenar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    {currentUser && (
                      <form onSubmit={handleSubmitReview} className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-lg">Deja tu valoración</h4>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Tu calificación:</span>
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
                                  className={`w-7 h-7 ${
                                    star <= (hoveredStar || rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
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
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                          rows={4}
                          required
                        />

                        <button
                          type="submit"
                          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Publicar valoración
                        </button>
                      </form>
                    )}

                    {!currentUser && (
                      <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl text-center">
                        <p className="text-blue-700 dark:text-blue-300 font-medium">
                          Inicia sesión para dejar tu valoración
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                          Aún no hay valoraciones. ¡Sé el primero en dejar una!
                        </p>
                      ) : (
                        reviews.map((review) => (
                          <div key={review.id} className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{review.userName}</p>
                                <StarRating rating={review.rating} size="sm" />
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'events' && isCinemaOrTheater && (
                  <BusinessEvents
                    business={business}
                    events={events}
                    onAddEvent={onAddEvent}
                    canAddEvent={canAddEvent}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Información</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Dirección</p>
                    <p>{business.address}</p>
                  </div>
                </div>

                {business.phone && (
                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Teléfono</p>
                      <a href={`tel:${business.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <Globe className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Sitio web</p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                      >
                        Visitar sitio
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calificación general</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{business.rating}</span>
                    <span className="text-gray-600 dark:text-gray-400 mb-2">/ 5</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Basado en {business.reviewCount} valoraciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
