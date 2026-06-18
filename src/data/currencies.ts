import { CurrencyRate } from '../types';

export const currencies: CurrencyRate[] = [
  {
    code: 'XOF',
    symbol: 'CFA',
    name: 'West African CFA franc',
    rate: 1,
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 0.0015,
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 0.0014,
  },
];

export const getCurrencySymbol = (currency: string): string => {
  return currencies.find(c => c.code === currency)?.symbol || currency;
};

export const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
  return Math.round((price / fromRate) * toRate * 100) / 100;
};
