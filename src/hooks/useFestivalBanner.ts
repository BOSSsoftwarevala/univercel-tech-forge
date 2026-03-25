import { useEffect, useState } from 'react';

type SupportedLanguage = 'en' | 'hi' | 'ar' | 'fr' | 'es' | 'de';

interface FestivalBanner {
  title: string;
  subtitle: string;
  note: string;
  compactText: string;
  emoji: string;
  gradient: string;
  festivalName: string;
  language: SupportedLanguage;
  country: string;
  countryName: string;
  isGlobal: boolean;
}

interface FestivalWindow {
  name: string;
  emoji: string;
  month: number;
  dayStart: number;
  dayEnd: number;
}

interface BannerCopy {
  title: string;
  subtitle: string;
  note: string;
  compact: string;
}

interface FallbackCopy {
  title: string;
  compact: string;
  festivalName: string;
}

const BANNER_SEEN_DATE_KEY = 'banner_seen_date';
const BANNER_GRADIENT_KEY = 'banner_gradient';
const BANNER_GRADIENT_SESSION_KEY = 'banner_gradient_session';
const BANNER_GRADIENT_SESSION_DATE_KEY = 'banner_gradient_session_date';
const BANNER_LANG_KEY = 'banner_lang';
const FIXED_OFFER_TEXT = '65% OFF for 7 Days';

const GRADIENTS = [
  'from-pink-500 to-yellow-500',
  'from-blue-500 to-purple-500',
  'from-green-400 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-fuchsia-600 to-rose-500',
  'from-cyan-500 to-indigo-500',
  'from-emerald-500 to-teal-600',
];

const COUNTRY_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  IN: 'hi',
  US: 'en',
  AE: 'ar',
  FR: 'fr',
  ES: 'es',
  DE: 'de',
};

const COUNTRY_NAME_MAP: Record<string, string> = {
  IN: 'India',
  US: 'United States',
  AE: 'UAE',
  FR: 'France',
  ES: 'Spain',
  DE: 'Germany',
  GB: 'United Kingdom',
};

const COUNTRY_FESTIVALS: Record<string, FestivalWindow[]> = {
  IN: [
    { name: 'Holi', emoji: '🎨', month: 3, dayStart: 10, dayEnd: 20 },
    { name: 'Independence Day', emoji: '🇮🇳', month: 8, dayStart: 13, dayEnd: 18 },
    { name: 'Diwali', emoji: '🪔', month: 11, dayStart: 1, dayEnd: 7 },
  ],
  US: [
    { name: 'Independence Day', emoji: '🇺🇸', month: 7, dayStart: 1, dayEnd: 7 },
    { name: 'Black Friday', emoji: '🛍️', month: 11, dayStart: 24, dayEnd: 30 },
    { name: 'Christmas', emoji: '🎄', month: 12, dayStart: 20, dayEnd: 26 },
  ],
  AE: [
    { name: 'Eid', emoji: '🌙', month: 3, dayStart: 28, dayEnd: 31 },
    { name: 'National Day', emoji: '🇦🇪', month: 12, dayStart: 1, dayEnd: 4 },
  ],
};

const GLOBAL_FESTIVALS: FestivalWindow[] = [
  { name: 'New Year', emoji: '🎆', month: 1, dayStart: 1, dayEnd: 7 },
  { name: 'Christmas', emoji: '🎄', month: 12, dayStart: 20, dayEnd: 31 },
];

const BANNER_TEXT: Record<SupportedLanguage, BannerCopy> = {
  en: {
    title: '🎉 {festival} Special',
    subtitle: 'Get 65% OFF for 7 Days',
    note: 'Limited time offer for {country}',
    compact: '{festival}: 65% OFF for 7 Days',
  },
  hi: {
    title: '🎉 {festival} स्पेशल',
    subtitle: '7 दिनों के लिए 65% छूट',
    note: '{country} के लिए सीमित समय ऑफर',
    compact: '{festival}: 7 दिनों के लिए 65% छूट',
  },
  ar: {
    title: '🎉 عرض خاص {festival}',
    subtitle: 'خصم 65٪ لمدة 7 أيام',
    note: 'عرض لفترة محدودة في {country}',
    compact: '{festival}: خصم 65٪ لمدة 7 أيام',
  },
  fr: {
    title: '🎉 Offre spéciale {festival}',
    subtitle: '65 % de réduction pendant 7 jours',
    note: 'Offre à durée limitée pour {country}',
    compact: '{festival} : 65 % de réduction pendant 7 jours',
  },
  es: {
    title: '🎉 Especial de {festival}',
    subtitle: '65 % de descuento por 7 días',
    note: 'Oferta por tiempo limitado para {country}',
    compact: '{festival}: 65 % de descuento por 7 días',
  },
  de: {
    title: '🎉 {festival}-Spezial',
    subtitle: '65 % Rabatt für 7 Tage',
    note: 'Zeitlich begrenztes Angebot für {country}',
    compact: '{festival}: 65 % Rabatt für 7 Tage',
  },
};

const FALLBACK_TEXT: Record<SupportedLanguage, FallbackCopy> = {
  en: {
    title: '🎉 Special Offer',
    compact: 'Special Offer: 65% OFF for 7 Days',
    festivalName: 'Special Offer',
  },
  hi: {
    title: '🎉 स्पेशल ऑफर',
    compact: 'स्पेशल ऑफर: 7 दिनों के लिए 65% छूट',
    festivalName: 'स्पेशल ऑफर',
  },
  ar: {
    title: '🎉 عرض خاص',
    compact: 'عرض خاص: خصم 65٪ لمدة 7 أيام',
    festivalName: 'عرض خاص',
  },
  fr: {
    title: '🎉 Offre spéciale',
    compact: 'Offre spéciale : 65 % de réduction pendant 7 jours',
    festivalName: 'Offre spéciale',
  },
  es: {
    title: '🎉 Oferta especial',
    compact: 'Oferta especial: 65 % de descuento por 7 días',
    festivalName: 'Oferta especial',
  },
  de: {
    title: '🎉 Sonderangebot',
    compact: 'Sonderangebot: 65 % Rabatt für 7 Tage',
    festivalName: 'Sonderangebot',
  },
};

const isFestivalActive = (festival: FestivalWindow, now: Date) => {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return festival.month === month && day >= festival.dayStart && day <= festival.dayEnd;
};

const applyTemplate = (template: string, festival: string, country: string) => template
  .replace('{festival}', festival)
  .replace('{country}', country);

const getBannerGradient = (dateKey: string) => {
  const sessionDate = window.sessionStorage.getItem(BANNER_GRADIENT_SESSION_DATE_KEY);
  const sessionGradient = window.sessionStorage.getItem(BANNER_GRADIENT_SESSION_KEY);
  if (sessionDate === dateKey && sessionGradient) {
    return sessionGradient;
  }

  const nextGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  window.sessionStorage.setItem(BANNER_GRADIENT_SESSION_KEY, nextGradient);
  window.sessionStorage.setItem(BANNER_GRADIENT_SESSION_DATE_KEY, dateKey);
  window.localStorage.setItem(BANNER_SEEN_DATE_KEY, dateKey);
  window.localStorage.setItem(BANNER_GRADIENT_KEY, nextGradient);
  return nextGradient;
};

const getBannerLanguage = (country: string): SupportedLanguage => {
  const localLang = COUNTRY_LANGUAGE_MAP[country] || 'en';
  if (localLang === 'en' || !BANNER_TEXT[localLang]) {
    window.localStorage.setItem(BANNER_LANG_KEY, 'en');
    return 'en';
  }

  const lastLang = window.localStorage.getItem(BANNER_LANG_KEY);
  const currentLang: SupportedLanguage = lastLang === 'en' ? localLang : 'en';
  window.localStorage.setItem(BANNER_LANG_KEY, currentLang);
  return currentLang;
};

export function useFestivalBanner(country: string, countryName?: string): FestivalBanner | null {
  const [banner, setBanner] = useState<FestivalBanner | null>(null);

  useEffect(() => {
    if (!country) {
      setBanner(null);
      return;
    }

    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    const matchedFestival = (COUNTRY_FESTIVALS[country] || []).find((festival) => isFestivalActive(festival, now));
    const globalFestival = GLOBAL_FESTIVALS.find((festival) => isFestivalActive(festival, now));
    const activeFestival = matchedFestival || globalFestival || {
      name: 'Special Offer',
      emoji: '🎉',
      month: now.getMonth() + 1,
      dayStart: now.getDate(),
      dayEnd: now.getDate(),
    };
    const resolvedCountryName = countryName || COUNTRY_NAME_MAP[country] || country;
    const currentLanguage = getBannerLanguage(country);
    const content = BANNER_TEXT[currentLanguage] || BANNER_TEXT.en;
    const fallbackContent = FALLBACK_TEXT[currentLanguage] || FALLBACK_TEXT.en;
    const gradient = getBannerGradient(dateKey);
    const isFallbackOnly = !matchedFestival && !globalFestival;
    const festivalName = isFallbackOnly ? fallbackContent.festivalName : activeFestival.name;

    setBanner({
      title: isFallbackOnly ? fallbackContent.title : applyTemplate(content.title, festivalName, resolvedCountryName),
      subtitle: content.subtitle,
      note: applyTemplate(content.note, activeFestival.name, resolvedCountryName),
      compactText: isFallbackOnly ? fallbackContent.compact : applyTemplate(content.compact, festivalName, resolvedCountryName),
      emoji: activeFestival.emoji,
      gradient,
      festivalName,
      language: currentLanguage,
      country,
      countryName: resolvedCountryName,
      isGlobal: !matchedFestival,
    });
  }, [country, countryName]);

  return banner;
}

export { FIXED_OFFER_TEXT };
