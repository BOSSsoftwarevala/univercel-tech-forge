import { useState, useEffect, useCallback } from 'react';

interface RegionInfo {
  code: string;
  currency: string;
  language: string;
  timezone: string;
  isRTL: boolean;
}

// Currency mapping by region
const REGION_CURRENCY: Record<string, string> = {
  IN: "INR", US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", 
  AE: "AED", SA: "SAR", SG: "SGD", AU: "AUD", CA: "CAD", 
  JP: "JPY", CN: "CNY", NG: "NGN", KE: "KES", ZA: "ZAR", 
  BR: "BRL", MX: "MXN", PK: "PKR", BD: "BDT", ID: "IDR",
  EG: "EGP", KW: "KWD", QA: "QAR", BH: "BHD", OM: "OMR",
};

// RTL language codes
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Locale mapping for proper Intl formatting (region code → locale)
const REGION_LOCALE: Record<string, string> = {
  IN: "en-IN", US: "en-US", GB: "en-GB", DE: "de-DE", FR: "fr-FR",
  AE: "ar-AE", SA: "ar-SA", SG: "en-SG", AU: "en-AU", CA: "en-CA",
  JP: "ja-JP", CN: "zh-CN", NG: "en-NG", KE: "en-KE", ZA: "en-ZA",
  BR: "pt-BR", MX: "es-MX", PK: "ur-PK", BD: "bn-BD", ID: "id-ID",
  EG: "ar-EG", KW: "ar-KW", QA: "ar-QA", BH: "ar-BH", OM: "ar-OM",
};

// Default region if detection fails
const DEFAULT_REGION: RegionInfo = {
  code: "IN",
  currency: "INR",
  language: "en",
  timezone: "Asia/Kolkata",
  isRTL: false,
};

export function useRegionDetection() {
  const [region, setRegion] = useState<RegionInfo>(DEFAULT_REGION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectRegion = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Method 1: Try timezone-based detection
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detectedCode = "IN";

      // Map timezones to country codes
      const timezoneToCountry: Record<string, string> = {
        "Asia/Kolkata": "IN",
        "Asia/Mumbai": "IN",
        "America/New_York": "US",
        "America/Los_Angeles": "US",
        "America/Chicago": "US",
        "Europe/London": "GB",
        "Europe/Berlin": "DE",
        "Europe/Paris": "FR",
        "Asia/Dubai": "AE",
        "Asia/Riyadh": "SA",
        "Asia/Singapore": "SG",
        "Australia/Sydney": "AU",
        "America/Toronto": "CA",
        "Asia/Tokyo": "JP",
        "Asia/Shanghai": "CN",
        "Africa/Lagos": "NG",
        "Africa/Nairobi": "KE",
        "Africa/Johannesburg": "ZA",
        "America/Sao_Paulo": "BR",
        "America/Mexico_City": "MX",
        "Asia/Karachi": "PK",
        "Asia/Dhaka": "BD",
        "Asia/Jakarta": "ID",
        "Africa/Cairo": "EG",
        "Asia/Kuwait": "KW",
        "Asia/Qatar": "QA",
        "Asia/Bahrain": "BH",
        "Asia/Muscat": "OM",
      };

      // Check if timezone maps to a known country
      for (const [tz, code] of Object.entries(timezoneToCountry)) {
        if (timezone.includes(tz.split("/")[1]) || timezone === tz) {
          detectedCode = code;
          break;
        }
      }

      // Method 2: Use browser language as fallback
      const browserLang = navigator.language || navigator.languages?.[0] || "en-US";
      const langParts = browserLang.split("-");
      const language = langParts[0].toLowerCase();
      const countryFromLang = langParts[1]?.toUpperCase();

      // If language has country suffix, use it (but don't override timezone detection)
      if (countryFromLang && REGION_CURRENCY[countryFromLang] && detectedCode === "IN") {
        detectedCode = countryFromLang;
      }

      const currency = REGION_CURRENCY[detectedCode] || "USD";
      const isRTL = RTL_LANGUAGES.includes(language);

      const newRegion: RegionInfo = {
        code: detectedCode,
        currency,
        language,
        timezone,
        isRTL,
      };

      setRegion(newRegion);

      // Store in localStorage for persistence
      localStorage.setItem("sv_region", JSON.stringify({
        ...newRegion,
        detectedAt: new Date().toISOString(),
      }));

      // Apply RTL direction to document if needed
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    } catch (err) {
      console.error("Region detection failed:", err);
      setError("Failed to detect region");
      
      // Try to load from localStorage as fallback
      const stored = localStorage.getItem("sv_region");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const fallbackRegion: RegionInfo = {
            code: parsed.code || DEFAULT_REGION.code,
            currency: parsed.currency || DEFAULT_REGION.currency,
            language: parsed.language || DEFAULT_REGION.language,
            timezone: parsed.timezone || DEFAULT_REGION.timezone,
            isRTL: parsed.isRTL || false,
          };
          setRegion(fallbackRegion);
          document.documentElement.dir = fallbackRegion.isRTL ? 'rtl' : 'ltr';
        } catch {
          setRegion(DEFAULT_REGION);
        }
      } else {
        setRegion(DEFAULT_REGION);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Override region manually
  const setManualRegion = useCallback((code: string) => {
    const currency = REGION_CURRENCY[code] || "USD";
    const newRegion: RegionInfo = {
      code,
      currency,
      language: region.language,
      timezone: region.timezone,
      isRTL: region.isRTL,
    };
    setRegion(newRegion);
    localStorage.setItem("sv_region", JSON.stringify({
      ...newRegion,
      manual: true,
      detectedAt: new Date().toISOString(),
    }));
  }, [region.language, region.timezone, region.isRTL]);

  // Override currency manually
  const setManualCurrency = useCallback((currency: string) => {
    const newRegion = { ...region, currency };
    setRegion(newRegion);
    localStorage.setItem("sv_region", JSON.stringify({
      ...newRegion,
      manualCurrency: true,
      detectedAt: new Date().toISOString(),
    }));
  }, [region]);

  // Set language manually (with RTL detection)
  const setManualLanguage = useCallback((languageCode: string) => {
    const isRTL = RTL_LANGUAGES.includes(languageCode);
    const newRegion = { ...region, language: languageCode, isRTL };
    setRegion(newRegion);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem("sv_region", JSON.stringify({
      ...newRegion,
      manualLanguage: true,
      detectedAt: new Date().toISOString(),
    }));
  }, [region]);

  // Format currency based on detected region - FIXED: Use proper locale
  const formatCurrency = useCallback((amount: number): string => {
    try {
      const locale = REGION_LOCALE[region.code] || 'en-US';
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: region.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback for unsupported currency
      return `${region.currency} ${amount.toFixed(2)}`;
    }
  }, [region.code, region.currency]);

  // Format date based on detected region
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const locale = REGION_LOCALE[region.code] || 'en-US';
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }, [region.code]);

  // Format time based on detected region
  const formatTime = useCallback((date: Date, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const locale = REGION_LOCALE[region.code] || 'en-US';
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        ...options,
      }).format(date);
    } catch {
      return date.toLocaleTimeString();
    }
  }, [region.code]);

  // Get the proper locale string for this region
  const getLocale = useCallback((): string => {
    return REGION_LOCALE[region.code] || 'en-US';
  }, [region.code]);

  useEffect(() => {
    detectRegion();
  }, [detectRegion]);

  return {
    region,
    isLoading,
    error,
    setManualRegion,
    setManualCurrency,
    setManualLanguage,
    formatCurrency,
    formatDate,
    formatTime,
    getLocale,
    refresh: detectRegion,
  };
}
