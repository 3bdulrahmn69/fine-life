export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', code: 'SEK' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', code: 'NZD' },
  MXN: { symbol: '$', name: 'Mexican Peso', code: 'MXN' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', code: 'HKD' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW' },
  TRY: { symbol: '₺', name: 'Turkish Lira', code: 'TRY' },
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const formatCurrency = (
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  showSymbol: boolean = true
): string => {
  const currency = CURRENCIES[currencyCode];

  if (!currency) {
    return amount.toFixed(2);
  }

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (!showSymbol) {
    return formattedAmount;
  }

  return `${currency.symbol}${formattedAmount}`;
};

export const parseCurrencyInput = (input: string): number => {
  // Remove all non-numeric characters except decimal point and minus sign
  const cleaned = input.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const getCurrencySymbol = (currencyCode: CurrencyCode): string => {
  return CURRENCIES[currencyCode]?.symbol || '$';
};

export const getAllCurrencies = () => {
  return Object.entries(CURRENCIES).map(([code, currency]) => ({
    currencyCode: code as CurrencyCode,
    ...currency,
  }));
};
