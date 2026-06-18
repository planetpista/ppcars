import React from 'react';
import { Heart, Settings } from 'lucide-react';
import { ProtectedRoute } from './ProtectedRoute';

interface FavoritesPageProps {
  language: 'fr' | 'en';
  onAuthClick: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ language, onAuthClick }) => {
  return (
    <ProtectedRoute
      fallback={
        <div className="min-h-screen bg-gray-50 pt-8">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <Heart size={64} className="mx-auto text-gray-300 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'fr' ? 'Mes Favoris' : 'My Favorites'}
              </h1>
              <p className="text-gray-600 mb-8">
                {language === 'fr' 
                  ? 'Connectez-vous pour voir vos véhicules favoris' 
                  : 'Sign in to see your favorite vehicles'
                }
              </p>
              <button
                onClick={onAuthClick}
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <Heart size={48} className="mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Mes Favoris' : 'My Favorites'}
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'fr' 
                ? 'Retrouvez ici tous vos véhicules favoris' 
                : 'Find all your favorite vehicles here'
              }
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
              <Settings size={64} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-600 mb-3">
                {language === 'fr' ? 'Aucun favori pour le moment' : 'No favorites yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'fr' 
                  ? 'Parcourez les annonces et ajoutez vos véhicules préférés en cliquant sur le cœur' 
                  : 'Browse listings and add your favorite vehicles by clicking the heart'
                }
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {language === 'fr' ? 'Parcourir les annonces' : 'Browse Listings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};