import { useEffect, useMemo, useState } from 'react';
import { Gift, Globe, Sparkles, TicketPercent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useGeoLocale } from '@/hooks/useGeoLocale';
import { FIXED_OFFER_TEXT, useFestivalBanner } from '@/hooks/useFestivalBanner';

interface GlobalOfferRow {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number;
  event_name: string | null;
  banner_text: string | null;
  icon: string | null;
  theme_primary_color: string;
  theme_secondary_color: string;
  start_date: string;
  end_date: string;
}

interface CountryOfferRow {
  id: string;
  country_code: string;
  country_name: string;
  national_day_name: string;
  discount_percentage: number;
  offer_price: number;
  icon: string | null;
}

const MarketplaceOffersPage = () => {
  const navigate = useNavigate();
  const geoLocale = useGeoLocale();
  const festivalBanner = useFestivalBanner(geoLocale.country, geoLocale.countryName);
  const [globalOffers, setGlobalOffers] = useState<GlobalOfferRow[]>([]);
  const [countryOffers, setCountryOffers] = useState<CountryOfferRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (geoLocale.loading) {
      return;
    }

    let cancelled = false;

    const fetchOffers = async () => {
      setLoading(true);
      const nowIso = new Date().toISOString();
      const today = new Date();

      const [globalResponse, countryResponse] = await Promise.all([
        supabase
          .from('global_offers')
          .select('id, title, description, discount_percentage, event_name, banner_text, icon, theme_primary_color, theme_secondary_color, start_date, end_date')
          .eq('is_active', true)
          .lte('start_date', nowIso)
          .gte('end_date', nowIso)
          .order('created_at', { ascending: false }),
        supabase
          .from('country_daily_offers')
          .select('id, country_code, country_name, national_day_name, discount_percentage, offer_price, icon')
          .eq('is_active', true)
          .eq('month', today.getMonth() + 1)
          .eq('day', today.getDate())
          .eq('country_code', geoLocale.country),
      ]);

      if (!cancelled) {
        setGlobalOffers(((globalResponse.data as GlobalOfferRow[] | null) || []));
        setCountryOffers(((countryResponse.data as CountryOfferRow[] | null) || []));
        setLoading(false);
      }
    };

    void fetchOffers();

    return () => {
      cancelled = true;
    };
  }, [geoLocale.country, geoLocale.countryName, geoLocale.loading]);

  const primaryCountryOffer = useMemo(() => countryOffers[0] || null, [countryOffers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08111f] via-[#0c1d35] to-[#08111f] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="grid gap-6 p-8 md:grid-cols-[1.3fr_0.7fr] md:p-10">
            <div className="space-y-4">
              <Badge className="bg-cyan-500/10 text-cyan-300">
                <Globe className="mr-2 h-3.5 w-3.5" />
                Offers for {geoLocale.countryName}
              </Badge>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">Marketplace Offers</h1>
              <p className="max-w-2xl text-base text-slate-300 md:text-lg">
                Country-aware discounts are loaded from the real offer tables so the banner, price messaging, and landing route stay aligned.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/marketplace')} className="bg-cyan-600 hover:bg-cyan-500">
                  Browse marketplace
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/notifications')} className="border-white/20 text-white hover:bg-white/10">
                  Open notifications
                </Button>
              </div>
            </div>

            <Card className="border-white/10 bg-slate-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TicketPercent className="h-5 w-5 text-amber-300" />
                  Live country filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                  <span>Country</span>
                  <span className="font-semibold text-white">{geoLocale.countryName}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                  <span>Currency</span>
                  <span className="font-semibold text-white">{geoLocale.currency}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                  <span>Offer banner</span>
                  <span className="font-semibold text-white">{festivalBanner?.festivalName || 'Special Offer'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {festivalBanner && (
          <section className={`rounded-3xl bg-gradient-to-r ${festivalBanner.gradient} p-8 shadow-2xl`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Festival banner</p>
                <h2 className="text-3xl font-black text-white">{festivalBanner.title}</h2>
                <p className="text-white/85">{festivalBanner.subtitle}</p>
                <p className="text-sm text-white/70">{festivalBanner.note}</p>
              </div>
              <div className="space-y-3 text-center">
                <Badge className="border-0 bg-white px-5 py-3 text-lg font-extrabold text-emerald-700">{FIXED_OFFER_TEXT}</Badge>
                <div className="text-sm font-semibold text-white/80">Filtered for {festivalBanner.countryName}</div>
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                Country-specific offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-slate-400">Loading country offers...</div>
              ) : primaryCountryOffer ? (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl">{primaryCountryOffer.icon || '🎉'}</div>
                      <h3 className="mt-2 text-xl font-bold text-white">{primaryCountryOffer.country_name} {primaryCountryOffer.national_day_name}</h3>
                      <p className="mt-1 text-slate-300">{primaryCountryOffer.discount_percentage}% off for visitors from {primaryCountryOffer.country_name}.</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-300">{geoLocale.currencySymbol}{primaryCountryOffer.offer_price}</Badge>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-slate-400">
                  No dedicated offer is active for {geoLocale.countryName} today. The global/festival offer still applies.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Gift className="h-5 w-5 text-amber-300" />
                Global manual offers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-slate-400">Loading manual offers...</div>
              ) : globalOffers.length > 0 ? (
                globalOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="rounded-2xl border border-white/10 p-5"
                    style={{
                      background: `linear-gradient(135deg, ${offer.theme_primary_color}22, ${offer.theme_secondary_color}22)`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-2xl">{offer.icon || '✨'}</div>
                        <h3 className="mt-2 text-xl font-bold text-white">{offer.title}</h3>
                        <p className="mt-1 text-slate-300">{offer.description || offer.banner_text || 'Live marketplace promotion'}</p>
                      </div>
                      <Badge className="bg-white/10 text-white">{offer.discount_percentage}% OFF</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-slate-400">
                  No manual offer is active right now.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default MarketplaceOffersPage;