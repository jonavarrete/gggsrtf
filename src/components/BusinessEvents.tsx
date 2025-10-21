import { Calendar, Clock, MapPin, DollarSign, Plus } from 'lucide-react';
import { Event, Business } from '../types';

interface BusinessEventsProps {
  business: Business;
  events: Event[];
  onAddEvent?: () => void;
  canAddEvent: boolean;
}

export function BusinessEvents({ business, events, onAddEvent, canAddEvent }: BusinessEventsProps) {
  const isCinemaOrTheater = business.category === 'entertainment' &&
    (business.tags.some(tag => tag.toLowerCase().includes('cine') || tag.toLowerCase().includes('teatro')));

  if (!isCinemaOrTheater) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Eventos y Funciones
        </h3>
        {canAddEvent && onAddEvent && (
          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar Evento
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No hay eventos programados</p>
          {canAddEvent && (
            <p className="text-gray-400 text-sm mt-1">Sé el primero en agregar un evento</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.category === 'cinema'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {event.category === 'cinema' ? 'Cine' : 'Teatro'}
                  </span>
                </div>

                <h4 className="font-bold text-gray-800 mb-2">{event.title}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-semibold">${event.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
