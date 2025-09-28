import { CurrencyCode } from './currency';

export interface ExchangeRateResponse {
  date: string;
  [currencyCode: string]:
    | {
        [targetCurrency: string]: number;
      }
    | string;
}

export interface ConversionResult {
  convertedAmount: number;
  rate: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  date: string;
}

/**
 * Currency conversion service using fawazahmed0 API
 * API: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{currency}.json
 */
export class CurrencyConverter {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  constructor() {
    // Clear any existing cache on initialization
    this.clearCache();
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Build API URL for currency conversion
   * Always uses @latest for real-time rates
   */
  private buildApiUrl(fromCurrency: CurrencyCode): string {
    const currency = fromCurrency.toLowerCase();
    return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`;
  }

  /**
   * Fetch exchange rates for a currency (always uses latest rates)
   */
  private async fetchExchangeRates(fromCurrency: CurrencyCode): Promise<any> {
    const cacheKey = `${fromCurrency}-latest`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    try {
      const url = this.buildApiUrl(fromCurrency);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates: ${response.status}`);
      }

      const data = await response.json();

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        expiry: Date.now() + this.CACHE_DURATION,
      });

      return data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw new Error('Unable to fetch exchange rates');
    }
  }

  /**
   * Convert amount from one currency to another (always uses latest rates)
   */
  async convertCurrency(
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): Promise<ConversionResult> {
    // If currencies are the same, no conversion needed
    if (fromCurrency === toCurrency) {
      return {
        convertedAmount: amount,
        rate: 1,
        fromCurrency,
        toCurrency,
        date: this.getTodayDate(),
      };
    }

    try {
      const ratesData = await this.fetchExchangeRates(fromCurrency);
      const currencyRates = ratesData[fromCurrency.toLowerCase()];

      if (!currencyRates) {
        throw new Error(`No rates found for currency: ${fromCurrency}`);
      }

      const rate = currencyRates[toCurrency.toLowerCase()];

      if (typeof rate !== 'number') {
        throw new Error(
          `No conversion rate found for ${fromCurrency} to ${toCurrency}`
        );
      }

      const convertedAmount = amount * rate;

      return {
        convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
        rate,
        fromCurrency,
        toCurrency,
        date: ratesData.date || this.getTodayDate(),
      };
    } catch (error) {
      console.error('Currency conversion error:', error);

      // Fallback: return original amount with rate 1
      return {
        convertedAmount: amount,
        rate: 1,
        fromCurrency,
        toCurrency,
        date: this.getTodayDate(),
      };
    }
  }

  /**
   * Get multiple conversion rates at once (always uses latest rates)
   */
  async getMultipleRates(
    fromCurrency: CurrencyCode,
    toCurrencies: CurrencyCode[]
  ): Promise<Record<CurrencyCode, number>> {
    try {
      const ratesData = await this.fetchExchangeRates(fromCurrency);
      const currencyRates = ratesData[fromCurrency.toLowerCase()];

      if (!currencyRates) {
        throw new Error(`No rates found for currency: ${fromCurrency}`);
      }

      const rates: Record<string, number> = {};

      toCurrencies.forEach((currency) => {
        const rate = currencyRates[currency.toLowerCase()];
        rates[currency] = typeof rate === 'number' ? rate : 1;
      });

      return rates;
    } catch (error) {
      console.error('Error getting multiple rates:', error);

      // Fallback: return rates of 1 for all currencies
      const fallbackRates: Record<string, number> = {};
      toCurrencies.forEach((currency) => {
        fallbackRates[currency] = 1;
      });
      return fallbackRates;
    }
  }

  /**
   * Clear cache (useful for testing or forcing fresh data)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Check if conversion is supported between two currencies
   */
  async isConversionSupported(
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): Promise<boolean> {
    if (fromCurrency === toCurrency) return true;

    try {
      const ratesData = await this.fetchExchangeRates(fromCurrency);
      const currencyRates = ratesData[fromCurrency.toLowerCase()];
      return (
        currencyRates &&
        typeof currencyRates[toCurrency.toLowerCase()] === 'number'
      );
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const currencyConverter = new CurrencyConverter();

/**
 * Helper function for quick currency conversion (always uses latest rates)
 */
export async function convertAmount(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  const result = await currencyConverter.convertCurrency(
    amount,
    fromCurrency,
    toCurrency
  );
  return result.convertedAmount;
}
