import { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Settings, LogOut, ChevronDown, Store, Calendar } from 'lucide-react';
import { User } from '../types';

interface UserMenuProps {
  user: User;
  onSettings: () => void;
  onLogout: () => void;
  onBusinessDashboard?: () => void;
  onEvents?: () => void;
}

export function UserMenu({ user, onSettings, onLogout, onBusinessDashboard, onEvents }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <UserIcon className="w-5 h-5 text-gray-700" />
        <div className="flex flex-col items-start">
          <span className="font-medium text-gray-700 text-sm">{user.name}</span>
          <span className="text-xs text-gray-500">
            {user.type === 'business' ? 'Negocio' : 'Cliente'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              {user.type === 'business' ? 'Cuenta de Negocio' : 'Cuenta Normal'}
            </p>
          </div>

          <div className="py-1">
            {user.type === 'business' && onBusinessDashboard && (
              <button
                onClick={() => {
                  onBusinessDashboard();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
              >
                <Store className="w-4 h-4" />
                <span>Mi Negocio</span>
              </button>
            )}

            {onEvents && (
              <button
                onClick={() => {
                  onEvents();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
              >
                <Calendar className="w-4 h-4" />
                <span>Mis Eventos</span>
              </button>
            )}

            <button
              onClick={() => {
                onSettings();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </div>

          <div className="border-t border-gray-200 py-1">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
