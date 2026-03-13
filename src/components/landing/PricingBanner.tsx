import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, CheckCircle, Gift, ShieldCheck, 
  RefreshCw, ArrowRight, Zap, Star, LucideIcon
} from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useOfferEngine } from '@/hooks/useOfferEngine';

interface Benefit {
  icon: LucideIcon;
  text: string;
  color: string;
}

export function PricingBanner() {
  const { t } = useTranslation();
  const { offer, countryOffer, loading } = useOfferEngine();

  const benefits: Benefit[] = [
    { icon: CheckCircle, text: t('pricing_no_hidden'), color: 'text-emerald-400' },
    { icon: Gift, text: t('pricing_no_advance'), color: 'text-cyan-400' },
    { icon: Sparkles, text: t('pricing_free_demo'), color: 'text-purple-400' },
    { icon: RefreshCw, text: t('pricing_free_update'), color: 'text-amber-400' },
  ];

  const isMega = offer.type === 'worldwide_mega';
  const isCountry = offer.type === 'country_specific';
  const hasDiscount = isMega || isCountry;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative py-12 my-8 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 rounded-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]" />
      
      {/* Animated Glow Effect */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-amber-500/20 rounded-full blur-[80px]"
      />

      {/* Floating Stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [-10, 10, -10], rotate: [0, 180, 360], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          className="absolute"
          style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
        >
          <Star className="w-4 h-4 text-amber-400/50" />
        </motion.div>
      ))}

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          {/* Dynamic Offer Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
              isMega 
                ? 'bg-gradient-to-r from-red-500/20 to-amber-500/20 border-red-500/30'
                : isCountry
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30'
            }`}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Zap className={`w-4 h-4 ${isMega ? 'text-red-400' : 'text-amber-400'}`} />
            </motion.div>
            <span className={`text-sm font-bold tracking-wider uppercase ${
              isMega ? 'text-red-300' : isCountry ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {isMega ? `🔥 ${offer.icon} ${offer.eventName} — 75% OFF WORLDWIDE! 🔥` 
               : isCountry ? `${offer.icon} ${offer.eventName} Special — 50% OFF!`
               : '🎉 Special Lifetime Offer 🎉'}
            </span>
          </motion.div>

          {/* Price Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-2">
              {offer.title || t('pricing_title')}
            </h2>
            <div className="flex items-center justify-center gap-3">
              {hasDiscount && (
                <span className="text-3xl md:text-4xl font-bold text-slate-500 line-through">
                  ${offer.basePrice}
                </span>
              )}
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-6xl md:text-8xl font-black bg-clip-text text-transparent ${
                  isMega 
                    ? 'bg-gradient-to-r from-red-400 via-amber-400 to-yellow-400'
                    : isCountry
                    ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400'
                    : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500'
                }`}
              >
                ${hasDiscount ? offer.offerPrice : offer.basePrice}
              </motion.span>
              <div className="text-left">
                <div className="text-xl font-bold text-white">
                  {hasDiscount ? `${offer.discountPercent}% OFF` : t('pricing_lifetime')}
                </div>
                {hasDiscount ? (
                  <div className="text-sm text-amber-400 font-semibold">{offer.expiresLabel}</div>
                ) : (
                  <div className="text-sm text-slate-400 line-through">$999 Regular Price</div>
                )}
              </div>
            </div>

            {/* Country offer secondary banner (when viewing mega event but country also has offer) */}
            {isMega && countryOffer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-lg">{countryOffer.icon}</span>
                <span className="text-sm text-slate-300">
                  Also today: <span className="font-bold text-emerald-400">{countryOffer.countryName} {countryOffer.eventName}</span> — ${countryOffer.offerPrice}
                </span>
              </motion.div>
            )}

            {/* Show country-specific alternate when base offer is showing */}
            {offer.type === 'base' && countryOffer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
              >
                <span className="text-2xl">{countryOffer.icon}</span>
                <div className="text-left">
                  <span className="text-sm font-bold text-emerald-300 block">
                    {countryOffer.countryName} — {countryOffer.eventName} Today!
                  </span>
                  <span className="text-xs text-slate-400">
                    Special Price: <span className="font-bold text-white text-base">${countryOffer.offerPrice}</span> (50% OFF)
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <IconComponent className={`w-5 h-5 ${benefit.color}`} />
                  <span className="text-sm font-medium text-white">{benefit.text}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mb-8 text-sm text-slate-400"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Money Back Guarantee • Trusted by 10,000+ Businesses</span>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <Link
              to="/demos"
              className={`group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold overflow-hidden transition-all hover:scale-105 shadow-2xl ${
                isMega
                  ? 'bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500 shadow-red-500/30'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-cyan-500/30'
              }`}
            >
              <motion.div
                animate={{ x: [-200, 400] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              <Sparkles className="relative w-5 h-5" />
              <span className="relative">
                {hasDiscount ? `Grab at $${offer.offerPrice} Now!` : t('pricing_cta')}
              </span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
