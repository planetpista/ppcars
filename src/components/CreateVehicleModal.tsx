import React, { useState } from 'react';
import { X, Upload, MapPin } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { countries } from '../data/countries';
import { carBrands } from '../data/carBrands';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ImageUploader } from './ImageUploader';

interface CreateVehicleModalProps {
  language: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateVehicleModal: React.FC<CreateVehicleModalProps> = ({
  language,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'location' as 'location' | 'achat',
    status: 'occasion' as 'neuf' | 'occasion' | 'importé',
    country: '',
    city: '',
    category: 'berline' as 'moto' | 'berline' | 'suv',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    engine: 'essence' as 'essence' | 'diesel' | 'hybride' | 'electrique',
    power: 0,
    powerUnit: 'ch' as 'ch' | 'kW',
    transmission: 'manuelle' as 'manuelle' | 'automatique',
    consumption: 0,
    autonomy: 0,
    seats: 5,
    description: '',
    images: [] as string[],
    dailyRate: 0,
    minDuration: 1,
    maxDuration: 30
  });

  if (!isOpen) return null;

  const maxImages = user?.profile?.type === 'professionnel' ? 14 : 3;

  const categories = ['moto', 'berline', 'suv'];
  const engines = ['essence', 'diesel', 'hybride', 'electrique'];
  const transmissions = ['manuelle', 'automatique'];
  const statuses = ['neuf', 'occasion', 'importé'];

  const selectedBrand = carBrands.find(b => b.name === formData.brand);
  const brandModels = selectedBrand?.models || [];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'brand') {
        updated.model = '';
      }
      return updated;
    });
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Simulate reverse geocoding for Benin cities
        const cities = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Djougou'];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        handleInputChange('city', randomCity);
        handleInputChange('country', 'Benin');
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.type && formData.country && formData.city);
      case 2:
        return !!(formData.category && formData.brand && formData.model && formData.year);
      case 3:
        return !!(formData.engine && formData.power && formData.transmission && formData.price);
      case 4:
        return !!formData.description.trim();
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError(null);
    } else {
      setError(language === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError(language === 'fr' ? 'Vous devez être connecté' : 'You must be logged in');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const vehicleData = {
        user_id: user.id,
        type: formData.type,
        status: formData.status,
        country: formData.country,
        city: formData.city,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        price: formData.price,
        engine: formData.engine,
        power: formData.power,
        power_unit: formData.powerUnit,
        transmission: formData.transmission,
        consumption: formData.consumption || null,
        autonomy: formData.autonomy || null,
        seats: formData.seats || null,
        description: formData.description,
        images: formData.images,
        daily_rate: formData.type === 'location' ? formData.dailyRate : null,
        min_duration: formData.type === 'location' ? formData.minDuration : null,
        max_duration: formData.type === 'location' ? formData.maxDuration : null
      };

      const { error: insertError } = await supabase
        .from('vehicles')
        .insert([vehicleData]);

      if (insertError) {
        throw insertError;
      }

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        type: 'location',
        status: 'occasion',
        country: '',
        city: '',
        category: 'berline',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: 0,
        price: 0,
        engine: 'essence',
        power: 0,
        powerUnit: 'ch',
        transmission: 'manuelle',
        consumption: 0,
        autonomy: 0,
        seats: 5,
        description: '',
        images: [],
        dailyRate: 0,
        minDuration: 1,
        maxDuration: 30
      });
      setCurrentStep(1);
    } catch (err: any) {
      console.error('Error creating vehicle:', err);
      setError(err.message || (language === 'fr' ? 'Erreur lors de la création' : 'Error creating listing'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'fr' ? 'Type et localisation' : 'Type and Location'}
            </h3>
            
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Type d\'annonce' : 'Listing Type'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'location')}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    formData.type === 'location'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{getTranslation('rental', language)}</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'achat')}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    formData.type === 'achat'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{getTranslation('purchase', language)}</div>
                </button>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('country', language)} *
              </label>
              <select
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Sélectionner' : 'Select'}</option>
                {countries.map(country => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('city', language)} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'fr' ? 'Entrer une ville' : 'Enter a city'}
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleGeolocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <MapPin size={18} />
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'fr' ? 'Détails du véhicule' : 'Vehicle Details'}
            </h3>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('category', language)} *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleInputChange('category', cat)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.category === cat
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{getTranslation(cat, language)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('brand', language)} *
              </label>
              <select
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Sélectionner' : 'Select'}</option>
                {carBrands.map(brand => (
                  <option key={brand.name} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('model', language)} *
              </label>
              <select
                required
                disabled={!formData.brand}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Sélectionner un modèle' : 'Select a model'}</option>
                {brandModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Année' : 'Year'} *
              </label>
              <input
                type="number"
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'État' : 'Condition'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {statuses.map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleInputChange('status', status)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.status === status
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{getTranslation(status, language)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'fr' ? 'Spécifications techniques' : 'Technical Specifications'}
            </h3>

            {/* Engine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('engine', language)} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {engines.map(engine => (
                  <button
                    key={engine}
                    type="button"
                    onClick={() => handleInputChange('engine', engine)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.engine === engine
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{getTranslation(engine, language)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Power */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Puissance' : 'Power'} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.power}
                  onChange={(e) => handleInputChange('power', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Unité' : 'Unit'}
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.powerUnit}
                  onChange={(e) => handleInputChange('powerUnit', e.target.value)}
                >
                  <option value="ch">ch</option>
                  <option value="kW">kW</option>
                </select>
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Transmission' : 'Transmission'} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {transmissions.map(trans => (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => handleInputChange('transmission', trans)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.transmission === trans
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{getTranslation(trans, language)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Kilométrage' : 'Mileage'} (km)
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Seats */}
            {formData.category !== 'moto' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Nombre de places' : 'Number of seats'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.seats}
                  onChange={(e) => handleInputChange('seats', parseInt(e.target.value) || 5)}
                />
              </div>
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'location' 
                  ? (language === 'fr' ? 'Prix par jour (€)' : 'Price per day (€)')
                  : (language === 'fr' ? 'Prix de vente (€)' : 'Sale price (€)')
                } *
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Rental specific fields */}
            {formData.type === 'location' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'fr' ? 'Durée min. (jours)' : 'Min. duration (days)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.minDuration}
                    onChange={(e) => handleInputChange('minDuration', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'fr' ? 'Durée max. (jours)' : 'Max. duration (days)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.maxDuration}
                    onChange={(e) => handleInputChange('maxDuration', parseInt(e.target.value) || 30)}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'fr' ? 'Description et photos' : 'Description and Photos'}
            </h3>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={language === 'fr' 
                  ? 'Décrivez votre véhicule en détail...'
                  : 'Describe your vehicle in detail...'
                }
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Photos du véhicule' : 'Vehicle Photos'}
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({language === 'fr' ? `max ${maxImages} photos` : `max ${maxImages} photos`})
                </span>
              </label>
              {user && (
                <ImageUploader
                  userId={user.id}
                  images={formData.images}
                  maxImages={maxImages}
                  language={language}
                  onChange={(imgs) => handleInputChange('images', imgs)}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'fr' ? 'Créer une annonce' : 'Create Listing'}
              </h2>
              <p className="text-gray-600 mt-1">
                {language === 'fr' ? `Étape ${currentStep} sur 4` : `Step ${currentStep} of 4`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'fr' ? 'Précédent' : 'Previous'}
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === 'fr' ? 'Suivant' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(4)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'fr' ? 'Création...' : 'Creating...'}
                  </>
                ) : (
                  language === 'fr' ? 'Créer l\'annonce' : 'Create Listing'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};