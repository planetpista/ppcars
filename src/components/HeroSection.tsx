import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { SearchFilters } from '../types';
import { countries } from '../data/countries';
import { carBrands } from '../data/carBrands';

interface HeroSectionProps {
  language: 'fr' | 'en';
  onSearch: (filters: SearchFilters) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language, onSearch }) => {
  const [searchType, setSearchType] = useState<'location' | 'achat'>('location');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'location'
  });

  const categories = ['moto', 'berline', 'suv'];
  const engines = ['essence', 'diesel', 'hybride', 'electrique'];

  const selectedBrand = carBrands.find(b => b.name === filters.brand);
  const brandModels = selectedBrand?.models || [];

  const regions = Array.from(new Set(countries.map(c => c.region)));
  const filteredCountries = filters.region
    ? countries.filter(c => c.region === filters.region)
    : countries;

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'brand') {
        updated.model = '';
      }
      if (field === 'region') {
        updated.country = '';
      }
      return updated;
    });
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        // Simulate reverse geocoding
        const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        handleInputChange('city', randomCity);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ ...filters, type: searchType });
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
          Make Your Best Choice.
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Type Selection */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setSearchType('location');
                handleInputChange('type', 'location');
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                searchType === 'location'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getTranslation('rental', language)}
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchType('achat');
                handleInputChange('type', 'achat');
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                searchType === 'achat'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getTranslation('purchase', language)}
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'fr' ? 'Région' : 'Region'}
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.region || ''}
                onChange={(e) => handleInputChange('region', e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Toutes régions' : 'All regions'}</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('country', language)}
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Sélectionner' : 'Select'}</option>
                {filteredCountries.map(country => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('city', language)}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrer une ville"
                  value={filters.city || ''}
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('category', language)}
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {getTranslation(cat, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('brand', language)}
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Toutes marques' : 'All brands'}</option>
                {carBrands.map(brand => (
                  <option key={brand.name} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('model', language)}
              </label>
              <select
                disabled={!filters.brand}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                value={filters.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
              >
                <option value="">{language === 'fr' ? 'Sélectionner un modèle' : 'Select a model'}</option>
                {brandModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTranslation('budget', language)} (€)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Conditional Fields */}
            {searchType === 'location' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation('duration', language)} (jours)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Durée souhaitée"
                  value={filters.duration || ''}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation('newUsed', language)}
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value as 'neuf' | 'occasion' | 'importé')}
                >
                  <option value="">{language === 'fr' ? 'Indifférent' : 'Any'}</option>
                  <option value="neuf">{getTranslation('neuf', language)}</option>
                  <option value="occasion">{getTranslation('occasion', language)}</option>
                  <option value="importé">{getTranslation('importé', language)}</option>
                </select>
              </div>
            )}
          </div>

          {/* Engine Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('engine', language)} (optionnel)
            </label>
            <div className="flex flex-wrap gap-2">
              {engines.map(engine => (
                <button
                  key={engine}
                  type="button"
                  onClick={() => {
                    const currentEngines = filters.engine || [];
                    const newEngines = currentEngines.includes(engine)
                      ? currentEngines.filter(e => e !== engine)
                      : [...currentEngines, engine];
                    handleInputChange('engine', newEngines);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.engine?.includes(engine)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getTranslation(engine, language)}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Search size={20} />
            {getTranslation('search', language)}
          </button>
        </form>
      </div>
    </section>
  );
};