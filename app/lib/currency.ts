export const CURRENCIES = {
  // Major Currencies
  USD: { symbol: '$', name: 'US Dollar', code: 'USD', flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR', flag: '🇪🇺' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP', flag: '🇬🇧' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY', flag: '🇯🇵' },

  // Americas
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD', flag: '🇨🇦' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD', flag: '🇦🇺' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', code: 'NZD', flag: '🇳🇿' },
  MXN: { symbol: '$', name: 'Mexican Peso', code: 'MXN', flag: '🇲🇽' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL', flag: '🇧🇷' },
  ARS: { symbol: '$', name: 'Argentine Peso', code: 'ARS', flag: '🇦🇷' },
  CLP: { symbol: '$', name: 'Chilean Peso', code: 'CLP', flag: '🇨🇱' },
  COP: { symbol: '$', name: 'Colombian Peso', code: 'COP', flag: '🇨🇴' },
  PEN: { symbol: 'S/', name: 'Peruvian Sol', code: 'PEN', flag: '🇵🇪' },
  UYU: { symbol: '$U', name: 'Uruguayan Peso', code: 'UYU', flag: '🇺🇾' },

  // Europe
  CHF: { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF', flag: '🇨🇭' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', code: 'SEK', flag: '🇸🇪' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK', flag: '🇳🇴' },
  DKK: { symbol: 'kr', name: 'Danish Krone', code: 'DKK', flag: '🇩🇰' },
  PLN: { symbol: 'zł', name: 'Polish Złoty', code: 'PLN', flag: '🇵🇱' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna', code: 'CZK', flag: '🇨🇿' },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint', code: 'HUF', flag: '🇭🇺' },
  RON: { symbol: 'lei', name: 'Romanian Leu', code: 'RON', flag: '🇷🇴' },
  BGN: { symbol: 'лв', name: 'Bulgarian Lev', code: 'BGN', flag: '🇧🇬' },
  HRK: { symbol: 'kn', name: 'Croatian Kuna', code: 'HRK', flag: '🇭🇷' },
  RSD: { symbol: 'дин', name: 'Serbian Dinar', code: 'RSD', flag: '🇷🇸' },
  TRY: { symbol: '₺', name: 'Turkish Lira', code: 'TRY', flag: '🇹🇷' },
  RUB: { symbol: '₽', name: 'Russian Ruble', code: 'RUB', flag: '🇷🇺' },
  UAH: { symbol: '₴', name: 'Ukrainian Hryvnia', code: 'UAH', flag: '🇺🇦' },

  // Asia Pacific
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY', flag: '🇨🇳' },
  KRW: { symbol: '₩', name: 'South Korean Won', code: 'KRW', flag: '🇰🇷' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', code: 'SGD', flag: '🇸🇬' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', code: 'HKD', flag: '🇭🇰' },
  TWD: { symbol: 'NT$', name: 'Taiwan Dollar', code: 'TWD', flag: '🇹🇼' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR', flag: '🇮🇳' },
  PKR: { symbol: '₨', name: 'Pakistani Rupee', code: 'PKR', flag: '🇵🇰' },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka', code: 'BDT', flag: '🇧🇩' },
  LKR: { symbol: '₨', name: 'Sri Lankan Rupee', code: 'LKR', flag: '🇱🇰' },
  NPR: { symbol: '₨', name: 'Nepalese Rupee', code: 'NPR', flag: '🇳🇵' },
  THB: { symbol: '฿', name: 'Thai Baht', code: 'THB', flag: '🇹🇭' },
  VND: { symbol: '₫', name: 'Vietnamese Dong', code: 'VND', flag: '🇻🇳' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', code: 'IDR', flag: '🇮🇩' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', code: 'MYR', flag: '🇲🇾' },
  PHP: { symbol: '₱', name: 'Philippine Peso', code: 'PHP', flag: '🇵🇭' },

  // Middle East & Africa
  SAR: { symbol: '﷼', name: 'Saudi Riyal', code: 'SAR', flag: '🇸🇦' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', code: 'AED', flag: '🇦🇪' },
  QAR: { symbol: '﷼', name: 'Qatari Riyal', code: 'QAR', flag: '🇶🇦' },
  KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar', code: 'KWD', flag: '🇰🇼' },
  BHD: { symbol: '.د.ب', name: 'Bahraini Dinar', code: 'BHD', flag: '🇧🇭' },
  OMR: { symbol: '﷼', name: 'Omani Rial', code: 'OMR', flag: '🇴🇲' },
  JOD: { symbol: 'د.ا', name: 'Jordanian Dinar', code: 'JOD', flag: '🇯🇴' },
  EGP: { symbol: '£', name: 'Egyptian Pound', code: 'EGP', flag: '🇪🇬' },
  ZAR: { symbol: 'R', name: 'South African Rand', code: 'ZAR', flag: '🇿🇦' },
  NGN: { symbol: '₦', name: 'Nigerian Naira', code: 'NGN', flag: '🇳🇬' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi', code: 'GHS', flag: '🇬🇭' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', code: 'KES', flag: '🇰🇪' },
  UGX: { symbol: 'USh', name: 'Ugandan Shilling', code: 'UGX', flag: '🇺🇬' },
  TZS: { symbol: 'TSh', name: 'Tanzanian Shilling', code: 'TZS', flag: '🇹🇿' },

  // Other Notable
  ISK: { symbol: 'kr', name: 'Icelandic Króna', code: 'ISK', flag: '🇮🇸' },
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
