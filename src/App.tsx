import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AnnouncementsList } from './components/AnnouncementsList';
import { AuthModal } from './components/AuthModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { FavoritesPage } from './components/FavoritesPage';
import { AccountPage } from './components/AccountPage';
import { ContactPage } from './components/ContactPage';
import { CreateVehicleModal } from './components/CreateVehicleModal';
import { Vehicle, SearchFilters, Currency } from './types';
import { getCurrencySymbol } from './data/currencies';
import { useAuth } from './hooks/useAuth';
import { useVehicles } from './hooks/useVehicles';

function App() {
  const { user, isAuthenticated } = useAuth();
  const { vehicles, loading: vehiclesLoading, refetch: refetchVehicles } = useVehicles();
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [currentPage, setCurrentPage] = useState('home');
  const [currency, setCurrency] = useState<Currency>('XOF');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleDetailOpen, setIsVehicleDetailOpen] = useState(false);
  const [isCreateVehicleOpen, setIsCreateVehicleOpen] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  // Update filtered vehicles when vehicles or search filters change
  React.useEffect(() => {
    if (!searchFilters) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = vehicles.filter(vehicle => {
      // Type filter
      if (searchFilters.type !== vehicle.type) return false;

      // Location filters
      if (searchFilters.country && !vehicle.country.toLowerCase().includes(searchFilters.country.toLowerCase())) return false;
      if (searchFilters.city && !vehicle.city.toLowerCase().includes(searchFilters.city.toLowerCase())) return false;

      // Vehicle filters
      if (searchFilters.category && vehicle.category !== searchFilters.category) return false;
      if (searchFilters.brand && !vehicle.brand.toLowerCase().includes(searchFilters.brand.toLowerCase())) return false;
      if (searchFilters.engine && searchFilters.engine.length > 0 && !searchFilters.engine.includes(vehicle.engine)) return false;

      // Price filters
      if (searchFilters.minPrice && vehicle.price < searchFilters.minPrice) return false;
      if (searchFilters.maxPrice && vehicle.price > searchFilters.maxPrice) return false;

      // Status filter
      if (searchFilters.status && vehicle.status !== searchFilters.status) return false;

      return true;
    });

    setFilteredVehicles(filtered);
  }, [vehicles, searchFilters]);
  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleCreateAnnouncement = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreateVehicleOpen(true);
    }
  };

  const handleCreateVehicleSuccess = () => {
    // Refresh vehicles list
    refetchVehicles();
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleDetailOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div>
            <HeroSection language={language} onSearch={handleSearch} />
            <AnnouncementsList
              language={language}
              currency={currency}
              vehicles={filteredVehicles}
              loading={vehiclesLoading}
              onCreateAnnouncement={handleCreateAnnouncement}
              onVehicleClick={handleVehicleClick}
              isLoggedIn={!!user}
            />
          </div>
        );
      
      case 'favorites':
        return (
          <FavoritesPage language={language} onAuthClick={() => setIsAuthModalOpen(true)} />
        );
      
      case 'account':
        return (
          <AccountPage 
            language={language} 
            onLogin={() => setIsAuthModalOpen(true)} 
            onCreateVehicle={handleCreateAnnouncement}
          />
        );
      
      case 'contact':
        return (
          <ContactPage language={language} />
        );
      
      default:
        return (
          <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Page en construction</h1>
              <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onCreateAnnouncement={handleCreateAnnouncement}
      />
      
      {renderPage()}

      <AuthModal
        language={language}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <VehicleDetailModal
        language={language}
        vehicle={selectedVehicle}
        isOpen={isVehicleDetailOpen}
        onClose={() => setIsVehicleDetailOpen(false)}
        userEmail={user?.email}
        userName={user?.profile?.name}
      />

      <CreateVehicleModal
        language={language}
        isOpen={isCreateVehicleOpen}
        onClose={() => setIsCreateVehicleOpen(false)}
        onSuccess={handleCreateVehicleSuccess}
      />
    </div>
  );
}

export default App;