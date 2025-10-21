import { X } from 'lucide-react';
import { useState } from 'react';
import { User, UserType } from '../types';
import { storageService } from '../services/storage';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('customer');
  const [selectedBusinessId, setSelectedBusinessId] = useState('');

  const businesses = storageService.getBusinesses();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let user: User;

    if (userType === 'business' && selectedBusinessId) {
      user = storageService.createBusinessUser(name, email, selectedBusinessId);
    } else {
      user = {
        id: Date.now().toString(),
        name,
        email,
        type: 'customer',
      };
    }

    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuario
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="customer"
                  checked={userType === 'customer'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="mr-2"
                />
                <span>Cliente</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="business"
                  checked={userType === 'business'}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="mr-2"
                />
                <span>Negocio</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {userType === 'business' && (
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona tu Negocio
              </label>
              <select
                id="business"
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Selecciona un negocio</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
