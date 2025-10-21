import { useState } from 'react';
import { User, Settings, TrendingUp } from 'lucide-react';
import { User as UserType } from '../types';

interface UserSettingsProps {
  user: UserType;
  onClose: () => void;
  onUpgrade: () => void;
  onUpdateUser: (updatedUser: UserType) => void;
}

export function UserSettings({ user, onClose, onUpgrade, onUpdateUser }: UserSettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    const updatedUser = { ...user, name, email };
    onUpdateUser(updatedUser);
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Información Personal</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Cuenta
                  </label>
                  <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                    <span className="font-medium">
                      {user.type === 'business' ? 'Usuario de Negocio' : 'Usuario Normal'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>

            {user.type === 'customer' && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Actualiza tu Cuenta</h3>
                </div>

                <p className="text-gray-700 mb-4">
                  Conviértete en usuario de negocio y obtén acceso a funcionalidades exclusivas:
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span className="text-gray-700">Crea y gestiona tu perfil de negocio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span className="text-gray-700">Accede a promociones y destacados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span className="text-gray-700">Gestiona reseñas de clientes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span className="text-gray-700">Actualiza información en tiempo real</span>
                  </li>
                </ul>

                <button
                  onClick={onUpgrade}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all transform hover:scale-105 font-semibold"
                >
                  Actualizar a Usuario de Negocio
                </button>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Información de la Cuenta</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Miembro desde: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>ID de Usuario: {user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
