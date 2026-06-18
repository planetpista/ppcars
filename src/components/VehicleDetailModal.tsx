import React from 'react';
import { X, MapPin, Settings, User, Building, Phone, Mail } from 'lucide-react';
import { Vehicle } from '../types';
import { getTranslation } from '../utils/translations';
import { ContactModal } from './ContactModal';
import { PaymentModal } from './PaymentModal';

interface VehicleDetailModalProps {
  language: 'fr' | 'en';
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  language,
  vehicle,
  isOpen,
  onClose,
  userEmail,
  userName
}) => {
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

  if (!isOpen || !vehicle) return null;

  const formatPrice = (price: number, type: string) => {
    return type === 'location' ? `${price}€/jour` : `${price.toLocaleString()}€`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.brand} {vehicle.model}
              </h2>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{vehicle.city}, {vehicle.country}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.type === 'location' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {getTranslation(vehicle.type, language)}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Images and Description */}
            <div>
              {/* Image Gallery */}
              <div className="mb-6">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                  {vehicle.images && vehicle.images[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <Settings size={48} className="mx-auto mb-2" />
                      <span>Photo du véhicule</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            </div>

            {/* Right Column - Details and Contact */}
            <div>
              {/* Price */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(vehicle.price, vehicle.type)}
                  </div>
                  {vehicle.type === 'location' && (
                    <div className="text-gray-600">
                      Durée minimum: {vehicle.minDuration} jour(s)
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Année:</span>
                    <div className="font-medium">{vehicle.year}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Kilométrage:</span>
                    <div className="font-medium">{vehicle.mileage.toLocaleString()} km</div>
                  </div>
                  <div>
                    <span className="text-gray-500">État:</span>
                    <div className="font-medium">{getTranslation(vehicle.status, language)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Catégorie:</span>
                    <div className="font-medium">{getTranslation(vehicle.category, language)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Moteur:</span>
                    <div className="font-medium">{getTranslation(vehicle.engine, language)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Puissance:</span>
                    <div className="font-medium">{vehicle.power} {vehicle.powerUnit}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Transmission:</span>
                    <div className="font-medium">{getTranslation(vehicle.transmission, language)}</div>
                  </div>
                  {vehicle.seats && (
                    <div>
                      <span className="text-gray-500">Places:</span>
                      <div className="font-medium">{vehicle.seats}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Contact */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {vehicle.user.type === 'professionnel' ? (
                      <Building size={20} className="text-blue-600" />
                    ) : (
                      <User size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {vehicle.user.type === 'professionnel' ? vehicle.user.company : vehicle.user.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {getTranslation(vehicle.user.type, language)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{vehicle.user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{vehicle.user.email}</span>
                      </div>
                      {vehicle.user.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{vehicle.user.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Contacter le vendeur
                  </button>
                  {vehicle.type === 'location' && (
                    <button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      {language === 'fr' ? 'Réserver maintenant' : 'Book Now'}
                    </button>
                  )}
                  <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Ajouter aux favoris
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        language={language}
        vehicle={vehicle}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        userEmail={userEmail}
        userName={userName}
      />

      <PaymentModal
        language={language}
        vehicle={vehicle}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={(transactionId) => {
          console.log('Payment successful:', transactionId);
          alert(language === 'fr' ? 'Paiement réussi !' : 'Payment successful!');
        }}
      />
    </div>
  );
};