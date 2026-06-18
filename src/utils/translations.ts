export const translations: Record<string, { fr: string; en: string }> = {
  // Navigation
  home: { fr: 'Accueil', en: 'Home' },
  favorites: { fr: 'Favoris', en: 'Favorites' },
  account: { fr: 'Compte', en: 'Account' },
  contact: { fr: 'Contact', en: 'Contact' },

  // Hero
  heroTitle: { fr: 'Make Your Best Choice.', en: 'Make Your Best Choice.' },

  // Search form
  rental: { fr: 'Location', en: 'Rental' },
  purchase: { fr: 'Achat', en: 'Purchase' },
  country: { fr: 'Pays', en: 'Country' },
  city: { fr: 'Ville', en: 'City' },
  category: { fr: 'Catégorie', en: 'Category' },
  brand: { fr: 'Marque', en: 'Brand' },
  model: { fr: 'Modèle', en: 'Model' },
  engine: { fr: 'Moteur', en: 'Engine' },
  budget: { fr: 'Budget', en: 'Budget' },
  duration: { fr: 'Durée', en: 'Duration' },
  date: { fr: 'Date', en: 'Date' },
  newUsed: { fr: 'Neuf / Occasion', en: 'New / Used' },
  search: { fr: 'Rechercher', en: 'Search' },
  validate: { fr: 'Valider', en: 'Validate' },

  // Categories
  moto: { fr: 'Moto', en: 'Motorcycle' },
  berline: { fr: 'Berline', en: 'Sedan' },
  suv: { fr: 'SUV', en: 'SUV' },

  // Engines
  essence: { fr: 'Essence', en: 'Gasoline' },
  diesel: { fr: 'Diesel', en: 'Diesel' },
  hybride: { fr: 'Hybride', en: 'Hybrid' },
  electrique: { fr: 'Électrique', en: 'Electric' },

  // Status
  neuf: { fr: 'Neuf', en: 'New' },
  occasion: { fr: 'Occasion', en: 'Used' },
  importé: { fr: 'Importé', en: 'Imported' },

  // Announcements
  postAnnouncement: { fr: 'Déposer une annonce', en: 'Post Announcement' },
  loginRequired: { fr: 'Connexion requise', en: 'Login Required' },

  // Auth
  login: { fr: 'Se connecter', en: 'Login' },
  register: { fr: 'S\'inscrire', en: 'Register' },
  particulier: { fr: 'Particulier', en: 'Individual' },
  professionnel: { fr: 'Professionnel', en: 'Professional' },
  name: { fr: 'Nom', en: 'Name' },
  email: { fr: 'Email', en: 'Email' },
  phone: { fr: 'Téléphone', en: 'Phone' },
  company: { fr: 'Entreprise', en: 'Company' },
  address: { fr: 'Adresse', en: 'Address' },

  // Common
  close: { fr: 'Fermer', en: 'Close' },
  save: { fr: 'Enregistrer', en: 'Save' },
  cancel: { fr: 'Annuler', en: 'Cancel' },
  loading: { fr: 'Chargement...', en: 'Loading...' },
  geolocation: { fr: 'Géolocalisation', en: 'Geolocation' },
};

export const getTranslation = (key: string, lang: 'fr' | 'en'): string => {
  return translations[key]?.[lang] || key;
};