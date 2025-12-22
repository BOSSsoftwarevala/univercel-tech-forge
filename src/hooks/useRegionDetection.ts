import { useState, useEffect, useCallback } from 'react';

interface RegionInfo {
  code: string;
  currency: string;
  language: string;
  timezone: string;
}

// Currency mapping by region
const REGION_CURRENCY: Record<string, string> = {
  IN: "INR", US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", 
  AE: "AED", SA: "SAR", SG: "SGD", AU: "AUD", CA: "CAD", 
  JP: "JPY", CN: "CNY", NG: "NGN", KE: "KES", ZA: "ZAR", 
  BR: "BRL", MX: "MXN", PK: "PKR", BD: "BDT", ID: "IDR",
};

// Default region if detection fails
const DEFAULT_REGION: RegionInfo = {
  code: "IN",
  currency: "INR",
  language: "en",
  timezone: "Asia/Kolkata",
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
        "Asia/Karachi": "PK",
        "Asia/Dhaka": "BD",
        "Asia/Jakarta": "ID",
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

      // If language has country suffix, use it
      if (countryFromLang && REGION_CURRENCY[countryFromLang]) {
        detectedCode = countryFromLang;
      }

      const currency = REGION_CURRENCY[detectedCode] || "USD";

      setRegion({
        code: detectedCode,
        currency,
        language,
        timezone,
      });

      // Store in localStorage for persistence
      localStorage.setItem("sv_region", JSON.stringify({
        code: detectedCode,
        currency,
        language,
        timezone,
        detectedAt: new Date().toISOString(),
      }));

    } catch (err) {
      console.error("Region detection failed:", err);
      setError("Failed to detect region");
      
      // Try to load from localStorage as fallback
      const stored = localStorage.getItem("sv_region");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRegion({
            code: parsed.code || DEFAULT_REGION.code,
            currency: parsed.currency || DEFAULT_REGION.currency,
            language: parsed.language || DEFAULT_REGION.language,
            timezone: parsed.timezone || DEFAULT_REGION.timezone,
          });
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
    const newRegion = {
      code,
      currency,
      language: region.language,
      timezone: region.timezone,
    };
    setRegion(newRegion);
    localStorage.setItem("sv_region", JSON.stringify({
      ...newRegion,
      manual: true,
      detectedAt: new Date().toISOString(),
    }));
  }, [region.language, region.timezone]);

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

  // Format currency based on detected region
  const formatCurrency = useCallback((amount: number): string => {
    try {
      return new Intl.NumberFormat(`en-${region.code}`, {
        style: "currency",
        currency: region.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${region.currency} ${amount.toFixed(2)}`;
    }
  }, [region.code, region.currency]);

  useEffect(() => {
    detectRegion();
  }, [detectRegion]);

  return {
    region,
    isLoading,
    error,
    setManualRegion,
    setManualCurrency,
    formatCurrency,
    refresh: detectRegion,
  };
}
