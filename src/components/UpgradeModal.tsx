import { useState } from 'react';
import { Store, CheckCircle } from 'lucide-react';
import { Business } from '../types';

interface UpgradeModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: (businessData: Omit<Business, 'id' | 'rating' | 'reviewCount'>) => void;
}

export function UpgradeModal({ userName, onClose, onConfirm }: UpgradeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant' as Business['category'],
    description: '',
    image: '',
    address: '',
    phone: '',
    website: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const businessData: Omit<Business, 'id' | 'rating' | 'reviewCount'> = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      promotionTier: 'none',
      address: formData.address,
      phone: formData.phone,
      website: formData.website,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    onConfirm(businessData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-8 h-8 text-orange-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Actualizar a Usuario de Negocio</h2>
              <p className="text-gray-600">Completa los datos de tu negocio</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Beneficios incluidos:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Perfil de negocio público en el directorio</li>
                  <li>• Panel de gestión de información</li>
                  <li>• Recepción de reseñas y calificaciones</li>
                  <li>• Opción de promoción (Premium, Gold, Silver)</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: Restaurante El Sabor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Business['category'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="restaurant">Restaurante</option>
                <option value="entertainment">Entretenimiento</option>
                <option value="shopping">Compras</option>
                <option value="service">Servicios</option>
                <option value="nightlife">Vida Nocturna</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe tu negocio..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Calle Principal 123"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web (opcional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://minegocio.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas (separadas por comas)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="comida, italiano, pasta"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all font-semibold"
              >
                Confirmar Actualización
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
