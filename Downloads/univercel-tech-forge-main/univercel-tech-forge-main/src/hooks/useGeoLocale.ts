/**
 * useGeoLocale - Auto-detect user's country, language, and currency
 * Uses free IP geolocation API with fallback
 */
import { useState, useEffect } from 'react';

interface GeoLocale {
  country: string;       // e.g. "IN", "KE", "US"
  countryName: string;   // e.g. "India", "Kenya", "United States"
  language: string;      // e.g. "hi", "sw", "en"
  currency: string;      // e.g. "INR", "KES", "USD"
  currencySymbol: string;// e.g. "₹", "KSh", "$"
  exchangeRate: number;  // relative to INR (base)
  loading: boolean;
}

const COUNTRY_CONFIG: Record<string, { language: string; currency: string; symbol: string; rate: number; name: string }> = {
  IN: { language: 'hi', currency: 'INR', symbol: '₹', rate: 1, name: 'India' },
  US: { language: 'en', currency: 'USD', symbol: '$', rate: 0.012, name: 'United States' },
  GB: { language: 'en', currency: 'GBP', symbol: '£', rate: 0.0095, name: 'United Kingdom' },
  KE: { language: 'sw', currency: 'KES', symbol: 'KSh', rate: 1.55, name: 'Kenya' },
  NG: { language: 'en', currency: 'NGN', symbol: '₦', rate: 18.5, name: 'Nigeria' },
  AE: { language: 'ar', currency: 'AED', symbol: 'د.إ', rate: 0.044, name: 'UAE' },
  SA: { language: 'ar', currency: 'SAR', symbol: '﷼', rate: 0.045, name: 'Saudi Arabia' },
  CA: { language: 'en', currency: 'CAD', symbol: 'C$', rate: 0.016, name: 'Canada' },
  AU: { language: 'en', currency: 'AUD', symbol: 'A$', rate: 0.018, name: 'Australia' },
  DE: { language: 'de', currency: 'EUR', symbol: '€', rate: 0.011, name: 'Germany' },
  FR: { language: 'fr', currency: 'EUR', symbol: '€', rate: 0.011, name: 'France' },
  JP: { language: 'ja', currency: 'JPY', symbol: '¥', rate: 1.78, name: 'Japan' },
  CN: { language: 'zh', currency: 'CNY', symbol: '¥', rate: 0.086, name: 'China' },
  BR: { language: 'pt', currency: 'BRL', symbol: 'R$', rate: 0.059, name: 'Brazil' },
  ZA: { language: 'en', currency: 'ZAR', symbol: 'R', rate: 0.22, name: 'South Africa' },
  MX: { language: 'es', currency: 'MXN', symbol: 'MX$', rate: 0.21, name: 'Mexico' },
  SG: { language: 'en', currency: 'SGD', symbol: 'S$', rate: 0.016, name: 'Singapore' },
  MY: { language: 'ms', currency: 'MYR', symbol: 'RM', rate: 0.053, name: 'Malaysia' },
  PH: { language: 'tl', currency: 'PHP', symbol: '₱', rate: 0.67, name: 'Philippines' },
  BD: { language: 'bn', currency: 'BDT', symbol: '৳', rate: 1.31, name: 'Bangladesh' },
  PK: { language: 'ur', currency: 'PKR', symbol: 'Rs', rate: 3.34, name: 'Pakistan' },
  LK: { language: 'si', currency: 'LKR', symbol: 'Rs', rate: 3.6, name: 'Sri Lanka' },
  NP: { language: 'ne', currency: 'NPR', symbol: 'Rs', rate: 1.59, name: 'Nepal' },
  TZ: { language: 'sw', currency: 'TZS', symbol: 'TSh', rate: 30.5, name: 'Tanzania' },
  UG: { language: 'en', currency: 'UGX', symbol: 'USh', rate: 44.7, name: 'Uganda' },
  GH: { language: 'en', currency: 'GHS', symbol: 'GH₵', rate: 0.15, name: 'Ghana' },
  EG: { language: 'ar', currency: 'EGP', symbol: 'E£', rate: 0.58, name: 'Egypt' },
};

const DEFAULT_LOCALE: GeoLocale = {
  country: 'IN',
  countryName: 'India',
  language: 'en',
  currency: 'INR',
  currencySymbol: '₹',
  exchangeRate: 1,
  loading: false,
};

const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'asia/kolkata': 'IN',
  'asia/dubai': 'AE',
  'asia/riyadh': 'SA',
  'america/new_york': 'US',
  'america/chicago': 'US',
  'america/denver': 'US',
  'america/los_angeles': 'US',
  'europe/london': 'GB',
  'europe/paris': 'FR',
  'europe/berlin': 'DE',
  'africa/nairobi': 'KE',
  'africa/lagos': 'NG',
  'asia/singapore': 'SG',
  'australia/sydney': 'AU',
};

const detectCountryFromNavigator = () => {
  const browserLang = navigator.language || 'en-IN';
  const parts = browserLang.split('-');
  if (parts.length > 1 && COUNTRY_CONFIG[parts[1].toUpperCase()]) {
    return parts[1].toUpperCase();
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase();
  if (timeZone && TIMEZONE_COUNTRY_MAP[timeZone]) {
    return TIMEZONE_COUNTRY_MAP[timeZone];
  }

  return 'IN';
};

export function useGeoLocale(): GeoLocale {
  const [locale, setLocale] = useState<GeoLocale>({ ...DEFAULT_LOCALE, loading: true });

  useEffect(() => {
    let cancelled = false;

    const detect = async () => {
      try {
        // Try multiple free geo APIs with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        let countryCode = 'IN';

        try {
          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          if (res.ok) {
            const data = await res.json();
            countryCode = data.country_code || 'IN';
          }
        } catch {
          countryCode = detectCountryFromNavigator();
        }

        clearTimeout(timeout);

        if (cancelled) return;

        const config = COUNTRY_CONFIG[countryCode] || COUNTRY_CONFIG[detectCountryFromNavigator()] || COUNTRY_CONFIG['IN'];

        setLocale({
          country: countryCode,
          countryName: config.name,
          language: config.language,
          currency: config.currency,
          currencySymbol: config.symbol,
          exchangeRate: config.rate,
          loading: false,
        });
      } catch {
        if (!cancelled) {
          setLocale({ ...DEFAULT_LOCALE, loading: false });
        }
      }
    };

    detect();
    return () => { cancelled = true; };
  }, []);

  return locale;
}

/** Convert INR price to local currency */
export function convertPrice(inrPrice: number, rate: number, symbol: string): string {
  const converted = Math.round(inrPrice * rate);
  return `${symbol}${converted.toLocaleString()}`;
}

/** Parse price string like "₹59,999" to number */
export function parseINRPrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[₹,]/g, ''), 10) || 0;
}
