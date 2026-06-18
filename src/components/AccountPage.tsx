import React, { useState } from 'react';
import { User as UserIcon, Building, Plus, Car, Phone, Check, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { useUserVehicles } from '../hooks/useUserVehicles';
import { AdminDashboard } from './AdminDashboard';

interface AccountPageProps {
  language: 'fr' | 'en';
  onLogin: () => void;
  onCreateVehicle: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ language, onLogin, onCreateVehicle }) => {
  const { user, updateProfile, isAdmin } = useAuth();
  const { vehicles: userVehicles, loading: vehiclesLoading } = useUserVehicles();
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  if (isAdmin) {
    return <AdminDashboard language={language} />;
  }

  const handleEditPhone = () => {
    setPhoneValue(user?.phone || '');
    setPhoneError(null);
    setEditingPhone(true);
  };

  const handleSavePhone = async () => {
    if (!phoneValue.trim()) {
      setPhoneError(language === 'fr' ? 'Le numéro est requis' : 'Phone number is required');
      return;
    }
    setPhoneLoading(true);
    setPhoneError(null);
    const { error } = await updateProfile({ phone: phoneValue.trim() });
    setPhoneLoading(false);
    if (error) {
      setPhoneError(language === 'fr' ? 'Erreur lors de la mise à jour' : 'Update failed');
    } else {
      setEditingPhone(false);
    }
  };

  const handleCancelPhone = () => {
    setEditingPhone(false);
    setPhoneError(null);
  };

  return (
    <ProtectedRoute
      fallback={
        <div className="min-h-screen bg-gray-50 pt-8">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <UserIcon size={64} className="mx-auto text-gray-300 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'fr' ? 'Mon Compte' : 'My Account'}
              </h1>
              <p className="text-gray-600 mb-8">
                {language === 'fr'
                  ? 'Connectez-vous pour accéder à votre compte et gérer vos annonces'
                  : 'Sign in to access your account and manage your listings'}
              </p>
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {language === 'fr' ? 'Se connecter' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                {user?.profile?.type === 'professionnel' ? (
                  <Building size={32} className="text-blue-600" />
                ) : (
                  <UserIcon size={32} className="text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {user?.profile?.type === 'professionnel' ? user.profile.company : user?.profile?.name}
                </h1>
                <div className="flex items-center gap-3 text-gray-500 text-sm flex-wrap">
                  <span className="capitalize">
                    {user?.profile?.type === 'particulier'
                      ? (language === 'fr' ? 'Particulier' : 'Individual')
                      : (language === 'fr' ? 'Professionnel' : 'Professional')}
                  </span>
                  <span>•</span>
                  <span>{user?.email}</span>
                  {user?.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone size={13} />
                        {user.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {language === 'fr' ? 'Informations du profil' : 'Profile Information'}
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {language === 'fr' ? 'Nom' : 'Name'}
                    </label>
                    <div className="text-gray-900 font-medium mt-1">{user?.profile?.name}</div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</label>
                    <div className="text-gray-900 font-medium mt-1">{user?.email}</div>
                  </div>

                  {/* Editable Phone */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {language === 'fr' ? 'Téléphone' : 'Phone'}
                    </label>
                    {editingPhone ? (
                      <div className="mt-1 space-y-2">
                        <input
                          type="tel"
                          autoFocus
                          className="w-full p-2 border border-blue-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={phoneValue}
                          onChange={(e) => setPhoneValue(e.target.value)}
                          placeholder="+229 00 00 00 00"
                        />
                        {phoneError && (
                          <p className="text-red-500 text-xs">{phoneError}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={handleSavePhone}
                            disabled={phoneLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {phoneLoading ? (
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check size={13} />
                            )}
                            {language === 'fr' ? 'Enregistrer' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancelPhone}
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <X size={13} />
                            {language === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-900 font-medium">
                          {user?.phone || (
                            <span className="text-gray-400 italic text-sm">
                              {language === 'fr' ? 'Non renseigné' : 'Not set'}
                            </span>
                          )}
                        </span>
                        <button
                          onClick={handleEditPhone}
                          className="text-xs text-blue-600 hover:underline ml-2"
                        >
                          {language === 'fr' ? 'Modifier' : 'Edit'}
                        </button>
                      </div>
                    )}
                  </div>

                  {user?.profile?.company && (
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {language === 'fr' ? 'Entreprise' : 'Company'}
                      </label>
                      <div className="text-gray-900 font-medium mt-1">{user.profile.company}</div>
                    </div>
                  )}

                  {user?.profile?.address && (
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {language === 'fr' ? 'Adresse' : 'Address'}
                      </label>
                      <div className="text-gray-900 font-medium mt-1">{user.profile.address}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'fr' ? 'Statistiques' : 'Stats'}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      {language === 'fr' ? 'Annonces actives' : 'Active listings'}
                    </span>
                    <span className="font-bold text-blue-600">{userVehicles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      {language === 'fr' ? 'Réservations' : 'Bookings'}
                    </span>
                    <span className="font-bold text-green-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Messages</span>
                    <span className="font-bold text-purple-600">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* My Listings */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === 'fr' ? 'Mes Annonces' : 'My Listings'}
                  </h2>
                  <button
                    onClick={onCreateVehicle}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>{language === 'fr' ? 'Nouvelle annonce' : 'New Listing'}</span>
                  </button>
                </div>

                {vehiclesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-300 rounded-lg" />
                          <div className="flex-1">
                            <div className="h-5 bg-gray-300 rounded mb-2" />
                            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userVehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <Car size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      {language === 'fr' ? 'Aucune annonce pour le moment' : 'No listings yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {language === 'fr'
                        ? 'Créez votre première annonce pour commencer à louer ou vendre vos véhicules'
                        : 'Create your first listing to start renting or selling your vehicles'}
                    </p>
                    <button
                      onClick={onCreateVehicle}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {language === 'fr' ? 'Créer une annonce' : 'Create Listing'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            {vehicle.images && vehicle.images[0] ? (
                              <img
                                src={vehicle.images[0]}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {vehicle.brand} {vehicle.model}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {vehicle.city}, {vehicle.country} • {vehicle.year}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-blue-600">
                                {vehicle.type === 'location'
                                  ? `${vehicle.price.toLocaleString()} XOF/jour`
                                  : `${vehicle.price.toLocaleString()} XOF`}
                              </span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                vehicle.type === 'location'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {language === 'fr'
                                  ? (vehicle.type === 'location' ? 'Location' : 'Vente')
                                  : (vehicle.type === 'location' ? 'Rental' : 'Sale')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};