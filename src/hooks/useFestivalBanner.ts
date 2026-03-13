/**
 * useFestivalBanner - Country-specific festival/occasion banners
 * Shows relevant festivals based on user's detected country + current date
 */
import { useMemo } from 'react';

interface FestivalBanner {
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  offer?: string;
}

interface FestivalEntry {
  countries: string[];
  month: number;       // 1-12
  dayStart: number;
  dayEnd: number;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  offer?: string;
}

// Comprehensive festival calendar
const FESTIVALS: FestivalEntry[] = [
  // INDIA
  { countries: ['IN'], month: 1, dayStart: 14, dayEnd: 15, title: 'Happy Makar Sankranti! 🪁', subtitle: 'Celebrate with special offers on business software', emoji: '🪁', gradient: 'from-orange-600 via-yellow-500 to-orange-600', offer: '25% OFF' },
  { countries: ['IN'], month: 1, dayStart: 26, dayEnd: 26, title: 'Happy Republic Day! 🇮🇳', subtitle: 'Proud to serve Indian businesses', emoji: '🇮🇳', gradient: 'from-orange-500 via-white to-green-600', offer: '26% OFF' },
  { countries: ['IN'], month: 3, dayStart: 1, dayEnd: 31, title: 'Happy Holi! 🎨', subtitle: 'Color your business with powerful software', emoji: '🎨', gradient: 'from-pink-500 via-purple-500 to-cyan-500', offer: '30% OFF' },
  { countries: ['IN'], month: 8, dayStart: 15, dayEnd: 15, title: 'Happy Independence Day! 🇮🇳', subtitle: 'Freedom to grow your business digitally', emoji: '🇮🇳', gradient: 'from-orange-500 via-white to-green-600', offer: '15% OFF' },
  { countries: ['IN'], month: 10, dayStart: 1, dayEnd: 31, title: 'Navratri & Dussehra Offers! 🪔', subtitle: 'Victory of digital transformation', emoji: '🪔', gradient: 'from-red-600 via-orange-500 to-yellow-500', offer: '35% OFF' },
  { countries: ['IN'], month: 11, dayStart: 1, dayEnd: 15, title: 'Happy Diwali! 🪔✨', subtitle: 'Light up your business with our software solutions', emoji: '🪔', gradient: 'from-amber-500 via-orange-600 to-red-600', offer: '40% OFF' },

  // KENYA
  { countries: ['KE'], month: 6, dayStart: 1, dayEnd: 1, title: 'Happy Madaraka Day! 🇰🇪', subtitle: 'Empowering Kenyan businesses digitally', emoji: '🇰🇪', gradient: 'from-black via-red-600 to-green-600', offer: '20% OFF' },
  { countries: ['KE'], month: 10, dayStart: 20, dayEnd: 20, title: 'Happy Mashujaa Day! 🇰🇪', subtitle: 'Heroes of digital business', emoji: '🇰🇪', gradient: 'from-black via-red-600 to-green-600', offer: '20% OFF' },
  { countries: ['KE'], month: 12, dayStart: 12, dayEnd: 12, title: 'Happy Jamhuri Day! 🇰🇪', subtitle: 'Building Kenya\'s digital future', emoji: '🇰🇪', gradient: 'from-green-700 via-red-600 to-black', offer: '25% OFF' },

  // NIGERIA
  { countries: ['NG'], month: 10, dayStart: 1, dayEnd: 1, title: 'Happy Independence Day! 🇳🇬', subtitle: 'Powering Nigerian businesses', emoji: '🇳🇬', gradient: 'from-green-600 via-white to-green-600', offer: '20% OFF' },

  // UAE / SAUDI
  { countries: ['AE', 'SA'], month: 3, dayStart: 10, dayEnd: 10, title: 'Ramadan Mubarak! 🌙', subtitle: 'Special blessings on your business journey', emoji: '🌙', gradient: 'from-emerald-700 via-teal-600 to-emerald-800', offer: '30% OFF' },
  { countries: ['AE'], month: 12, dayStart: 2, dayEnd: 2, title: 'Happy National Day UAE! 🇦🇪', subtitle: 'Growing with the Emirates', emoji: '🇦🇪', gradient: 'from-red-600 via-green-600 to-black', offer: '25% OFF' },
  { countries: ['SA'], month: 9, dayStart: 23, dayEnd: 23, title: 'Happy Saudi National Day! 🇸🇦', subtitle: 'Digital transformation for the Kingdom', emoji: '🇸🇦', gradient: 'from-green-700 to-green-900', offer: '23% OFF' },

  // USA
  { countries: ['US'], month: 7, dayStart: 4, dayEnd: 4, title: 'Happy 4th of July! 🇺🇸', subtitle: 'Independence Day special offers', emoji: '🇺🇸', gradient: 'from-blue-700 via-red-600 to-blue-700', offer: '30% OFF' },
  { countries: ['US'], month: 11, dayStart: 24, dayEnd: 30, title: 'Black Friday Deals! 🛒', subtitle: 'Biggest software sale of the year', emoji: '🛒', gradient: 'from-black via-gray-900 to-black', offer: '50% OFF' },

  // UK
  { countries: ['GB'], month: 11, dayStart: 24, dayEnd: 30, title: 'Black Friday Deals! 🛒', subtitle: 'Massive savings on business software', emoji: '🛒', gradient: 'from-black via-gray-900 to-black', offer: '50% OFF' },

  // GLOBAL - Christmas & New Year (all countries)
  { countries: ['*'], month: 12, dayStart: 20, dayEnd: 31, title: 'Season\'s Greetings! 🎄', subtitle: 'End the year strong with powerful software', emoji: '🎄', gradient: 'from-red-700 via-green-700 to-red-700', offer: '35% OFF' },
  { countries: ['*'], month: 1, dayStart: 1, dayEnd: 5, title: 'Happy New Year 2026! 🎆', subtitle: 'Start the year with the right tools', emoji: '🎆', gradient: 'from-indigo-700 via-purple-600 to-pink-600', offer: '30% OFF' },
];

export function useFestivalBanner(country: string): FestivalBanner | null {
  return useMemo(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Find matching festival for this country + date
    const match = FESTIVALS.find(f => {
      const countryMatch = f.countries.includes('*') || f.countries.includes(country);
      const dateMatch = f.month === month && day >= f.dayStart && day <= f.dayEnd;
      return countryMatch && dateMatch;
    });

    if (!match) return null;

    return {
      title: match.title,
      subtitle: match.subtitle,
      emoji: match.emoji,
      gradient: match.gradient,
      offer: match.offer,
    };
  }, [country]);
}
