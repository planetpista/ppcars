export interface User {
  id: string;
  type: 'particulier' | 'professionnel';
  name: string;
  email: string;
  phone: string;
  profilePicture?: string;
  // Professionnel fields
  company?: string;
  address?: string;
  logo?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  user: User;
  type: 'location' | 'achat';
  status: 'neuf' | 'occasion' | 'importé';
  
  // Location
  country: string;
  city: string;
  
  // Vehicle details
  category: 'moto' | 'berline' | 'suv';
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  
  // Engine
  engine: 'essence' | 'diesel' | 'hybride' | 'electrique';
  power: number;
  powerUnit: 'ch' | 'kW';
  transmission: 'manuelle' | 'automatique';
  consumption?: number;
  autonomy?: number;
  seats?: number;
  
  // Additional
  description: string;
  images: string[];
  
  // Rental specific
  dailyRate?: number;
  minDuration?: number;
  maxDuration?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  type: 'location' | 'achat';
  region?: string;
  country?: string;
  city?: string;
  category?: string;
  brand?: string;
  model?: string;
  engine?: string[];
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  startDate?: Date;
  status?: 'neuf' | 'occasion' | 'importé';
}

export interface Translation {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export type Currency = 'XOF' | 'USD' | 'EUR';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  name: string;
  rate: number;
}