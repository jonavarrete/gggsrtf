import { useState, useEffect } from 'react';
import { X, Store, Star, TrendingUp, MessageSquare, Edit2, Save } from 'lucide-react';
import { Business, User } from '../types';
import { storageService } from '../services/storage';
import { StarRating } from './StarRating';

interface BusinessDashboardProps {
  user: User;
  onClose: () => void;
}

export function BusinessDashboard({ user, onClose }: BusinessDashboardProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (user.businessId) {
      const businesses = storageService.getBusinesses();
      const userBusiness = businesses.find(b => b.id === user.businessId);
      if (userBusiness) {
        setBusiness(userBusiness);
        setEditedBusiness(userBusiness);
      }
    }
  }, [user.businessId]);

  const handleSave = () => {
    if (editedBusiness) {
      const businesses = storageService.getBusinesses();
      const index = businesses.findIndex(b => b.id === editedBusiness.id);
      if (index !== -1) {
        businesses[index] = editedBusiness;
        storageService.setBusinesses(businesses);
        setBusiness(editedBusiness);
        setIsEditing(false);
      }
    }
  };

  if (!business) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No hay negocio asociado
          </h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta no tiene un negocio vinculado
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const reviews = storageService.getReviewsByBusiness(business.id);
  const recentReviews = reviews.slice(-5).reverse();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="bg-white rounded-xl max-w-4xl mx-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Store className="w-7 h-7 text-blue-600" />
              Panel de Negocio
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Rating Promedio</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">{business.rating}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Total Reseñas</span>
                </div>
                <p className="text-3xl font-bold text-green-900">{business.reviewCount}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Nivel</span>
                </div>
                <p className="text-2xl font-bold text-orange-900 capitalize">{business.promotionTier}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Información del Negocio</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                )}
              </div>

              {isEditing && editedBusiness ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={editedBusiness.name}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={editedBusiness.description}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      value={editedBusiness.address}
                      onChange={(e) => setEditedBusiness({ ...editedBusiness, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={editedBusiness.phone || ''}
                        onChange={(e) => setEditedBusiness({ ...editedBusiness, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                      <input
                        type="text"
                        value={editedBusiness.website || ''}
                        onChange={(e) => setEditedBusiness({ ...editedBusiness, website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nombre:</span>
                    <p className="text-gray-800">{business.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Descripción:</span>
                    <p className="text-gray-800">{business.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Dirección:</span>
                    <p className="text-gray-800">{business.address}</p>
                  </div>
                  {business.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                      <p className="text-gray-800">{business.phone}</p>
                    </div>
                  )}
                  {business.website && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Sitio Web:</span>
                      <p className="text-gray-800">{business.website}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reseñas Recientes</h3>
              {recentReviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay reseñas todavía</p>
              ) : (
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{review.userName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
