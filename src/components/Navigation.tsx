import React, { useState } from 'react';
import { Menu, Globe, X, DollarSign, LogOut, Plus } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { Currency } from '../types';
import { currencies, getCurrencySymbol } from '../data/currencies';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  onAuthClick: () => void;
  onCreateAnnouncement: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  currentPage,
  onPageChange,
  onAuthClick,
  onCreateAnnouncement
}) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const handleMenuItemClick = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    onPageChange('home');
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { key: 'home', page: 'home' },
    ...(isAuthenticated ? [{ key: 'favorites', page: 'favorites' }] : []),
    { key: 'account', page: 'account' },
    { key: 'contact', page: 'contact' }
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 px-4 py-3 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Translate Button */}
            <button
              onClick={() => onLanguageChange(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-medium hidden sm:block">
                {language === 'fr' ? 'English' : 'Français'}
              </span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
              >
                <DollarSign size={18} />
                <span className="text-sm font-medium hidden sm:block">
                  {getCurrencySymbol(currency)}
                </span>
              </button>

              {isCurrencyOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-100 z-40 min-w-max">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        onCurrencyChange(curr.code as Currency);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                        currency === curr.code ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {curr.symbol} - {curr.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logo/Brand */}
          <button
            onClick={() => onPageChange('home')}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Planet Pista
          </button>

          {/* Right side: Post Announcement + Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateAnnouncement}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              <span className="hidden sm:block">
                {getTranslation('postAnnouncement', language)}
              </span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="text-sm font-medium hidden sm:block">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-xl border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto py-2">
            {/* User Info */}
            {isAuthenticated && user?.profile && (
              <div className="px-6 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {user.profile.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {user.profile.type === 'professionnel' ? user.profile.company : user.profile.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email}
                      {user.phone && (
                        <>
                          <span className="mx-1">•</span>
                          {user.phone}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleMenuItemClick(item.page)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors ${
                  currentPage === item.page ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {getTranslation(item.key, language)}
              </button>
            ))}

            {/* Auth Actions */}
            <div className="border-t border-gray-100 pt-2">
              {isAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors text-red-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  {language === 'fr' ? 'Se déconnecter' : 'Sign Out'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors text-blue-600"
                >
                  {language === 'fr' ? 'Se connecter' : 'Sign In'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};