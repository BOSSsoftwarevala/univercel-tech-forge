import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActiveOffer {
  type: 'worldwide_mega' | 'country_specific' | 'base';
  title: string;
  icon: string;
  basePrice: number;
  discountPercent: number;
  offerPrice: number;
  eventName: string;
  countryName?: string;
  countryCode?: string;
  expiresLabel?: string;
}

const BASE_PRICE = 99;

// Mega worldwide events: Holi, Diwali, Boss Birthday (75% off)
const MEGA_EVENTS = [
  { name: 'Holi', icon: '🎨', month: 3, day: 25, duration: 2 },
  { name: 'Diwali', icon: '🪔', month: 11, day: 1, duration: 5 },
  { name: 'Boss Birthday', icon: '🎂', month: 8, day: 6, duration: 1 },
];

function getTodayOffer(userCountryCode?: string): ActiveOffer {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // 1. Check mega worldwide events first (75% off)
  for (const evt of MEGA_EVENTS) {
    if (month === evt.month && day >= evt.day && day < evt.day + evt.duration) {
      const offerPrice = Math.round(BASE_PRICE * 0.25 * 100) / 100;
      return {
        type: 'worldwide_mega',
        title: `🌍 ${evt.name} Mega Sale!`,
        icon: evt.icon,
        basePrice: BASE_PRICE,
        discountPercent: 75,
        offerPrice,
        eventName: evt.name,
        expiresLabel: `Ends ${evt.month}/${evt.day + evt.duration - 1}`,
      };
    }
  }

  // 2. Return base price (country-specific offers loaded from DB separately)
  return {
    type: 'base',
    title: 'All Software',
    icon: '💻',
    basePrice: BASE_PRICE,
    discountPercent: 0,
    offerPrice: BASE_PRICE,
    eventName: 'Lifetime Deal',
  };
}

export function useOfferEngine() {
  const [offer, setOffer] = useState<ActiveOffer>(getTodayOffer());
  const [countryOffer, setCountryOffer] = useState<ActiveOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCountry, setUserCountry] = useState<string>('');

  useEffect(() => {
    async function detectAndFetch() {
      try {
        // Detect user country
        let countryCode = '';
        try {
          const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
          const data = await res.json();
          countryCode = data?.country_code || '';
          setUserCountry(countryCode);
        } catch { /* fallback: no country */ }

        // Set base/mega offer
        const baseOffer = getTodayOffer(countryCode);
        setOffer(baseOffer);

        // If already mega event, skip country-specific
        if (baseOffer.type === 'worldwide_mega') {
          setLoading(false);
          return;
        }

        // Check country-specific daily offer from DB
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const { data: countryOffers } = await supabase
          .from('country_daily_offers')
          .select('*')
          .eq('month', month)
          .eq('day', day)
          .eq('is_active', true);

        if (countryOffers && countryOffers.length > 0) {
          // Check if user's country matches
          const userMatch = countryCode
            ? countryOffers.find(o => o.country_code === countryCode)
            : null;

          const displayOffer = userMatch || countryOffers[0];

          setCountryOffer({
            type: 'country_specific',
            title: `${displayOffer.icon} ${displayOffer.country_name} ${displayOffer.national_day_name}!`,
            icon: displayOffer.icon || '🎉',
            basePrice: BASE_PRICE,
            discountPercent: displayOffer.discount_percentage,
            offerPrice: Number(displayOffer.offer_price),
            eventName: displayOffer.national_day_name,
            countryName: displayOffer.country_name,
            countryCode: displayOffer.country_code,
            expiresLabel: 'Today Only!',
          });

          // If user is from that country, make it the primary offer
          if (userMatch) {
            setOffer({
              type: 'country_specific',
              title: `${userMatch.icon} Happy ${userMatch.national_day_name}!`,
              icon: userMatch.icon || '🎉',
              basePrice: BASE_PRICE,
              discountPercent: userMatch.discount_percentage,
              offerPrice: Number(userMatch.offer_price),
              eventName: userMatch.national_day_name,
              countryName: userMatch.country_name,
              countryCode: userMatch.country_code,
              expiresLabel: 'Today Only!',
            });
          }
        }
      } catch (err) {
        console.error('Offer engine error:', err);
      } finally {
        setLoading(false);
      }
    }

    detectAndFetch();
  }, []);

  return { offer, countryOffer, loading, userCountry, basePrice: BASE_PRICE };
}
