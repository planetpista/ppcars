import React from 'react';
import { Heart, MapPin, Calendar, Fuel, Settings } from 'lucide-react';
import { Vehicle, Currency } from '../types';
import { getTranslation } from '../utils/translations';
import { getCurrencySymbol, convertPrice } from '../data/currencies';

interface AnnouncementsListProps {
  language: 'fr' | 'en';
  currency: Currency;
  vehicles: Vehicle[];
  loading?: boolean;
  onCreateAnnouncement: () => void;
  onVehicleClick: (vehicle: Vehicle) => void;
  isLoggedIn: boolean;
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  language,
  currency,
  vehicles,
  loading = false,
  onCreateAnnouncement,
  onVehicleClick,
  isLoggedIn
}) => {
  const formatPrice = (price: number, type: string) => {
    const convertedPrice = convertPrice(price, 'XOF', currency);
    const currencySymbol = getCurrencySymbol(currency);
    return type === 'location' ? `${convertedPrice}${currencySymbol}/jour` : `${convertedPrice.toLocaleString()}${currencySymbol}`;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Véhicules Disponibles
          </h2>
          <p className="text-gray-600 text-lg">
            Découvrez une large sélection de véhicules pour tous vos besoins
          </p>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center gap-3 pt-3 mt-4 border-t border-gray-100">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] overflow-hidden"
                onClick={() => onVehicleClick(vehicle)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                  {vehicle.images && vehicle.images[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Settings size={32} className="mx-auto mb-2" />
                        <span className="text-sm">{vehicle.brand} {vehicle.model}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button 
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle favorite toggle
                    }}
                  >
                    <Heart size={18} className="text-gray-600" />
                  </button>

                  {/* Type Badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.type === 'location' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getTranslation(vehicle.type, language)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        {formatPrice(vehicle.price, vehicle.type)}
                      </div>
                      {vehicle.type === 'location' && vehicle.dailyRate && (
                        <div className="text-sm text-gray-500">
                          Min. {vehicle.minDuration} jours
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{vehicle.city}, {vehicle.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel size={14} />
                      <span>{getTranslation(vehicle.engine, language)} • {vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings size={14} />
                      <span>{vehicle.mileage.toLocaleString()} km • {getTranslation(vehicle.status, language)}</span>
                    </div>
                  </div>

                  {/* User */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {vehicle.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {vehicle.user.type === 'professionnel' ? vehicle.user.company : vehicle.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getTranslation(vehicle.user.type, language)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && vehicles.length === 0 && (
          <div className="text-center py-16">
            <Settings size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Aucun véhicule trouvé
            </h3>
            <p className="text-gray-500">
              {language === 'fr' 
                ? 'Aucun véhicule ne correspond à vos critères de recherche.'
                : 'No vehicles match your search criteria.'
              }
            </p>
          </div>
        )}

      </div>
    </section>
  );
};