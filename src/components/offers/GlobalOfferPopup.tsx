import { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Trophy, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface GlobalOffer {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number;
  event_type: 'festival' | 'sports' | 'custom';
  event_name: string | null;
  banner_text: string | null;
  icon: string | null;
  theme_primary_color: string;
  theme_secondary_color: string;
  theme_accent_color: string;
  start_date: string;
  end_date: string;
}

interface FestivalCalendar {
  id: string;
  name: string;
  description: string | null;
  month: number;
  day: number;
  duration_days: number;
  country_codes: string[];
  default_discount: number;
  theme_primary: string;
  theme_secondary: string;
  icon: string | null;
}

const ADMIN_ROLES = ['super_admin', 'master_admin'];
const STORAGE_KEY = 'offer_banner_admin_daily';
const MAX_SHOWS_PER_DAY = 2;

// Helper to get today's date key
const getTodayKey = () => new Date().toISOString().split('T')[0];

// Helper to check/update daily show count for admins
const getAdminShowCount = (): number => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return 0;
    const parsed = JSON.parse(data);
    if (parsed.date !== getTodayKey()) return 0;
    return parsed.count || 0;
  } catch {
    return 0;
  }
};

const incrementAdminShowCount = () => {
  const todayKey = getTodayKey();
  const currentCount = getAdminShowCount();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey, count: currentCount + 1 }));
};

const GlobalOfferPopupInner = forwardRef<HTMLDivElement, object>((_, ref) => {
  const { userRole } = useAuth();
  const [currentOffer, setCurrentOffer] = useState<GlobalOffer | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  // Check if admin has reached daily limit
  useEffect(() => {
    if (ADMIN_ROLES.includes(userRole || '')) {
      const showCount = getAdminShowCount();
      if (showCount >= MAX_SHOWS_PER_DAY) {
        setHasReachedLimit(true);
      }
    }
  }, [userRole]);

  useEffect(() => {
    if (!hasReachedLimit) {
      fetchActiveOffer();
    }
  }, [hasReachedLimit]);

  const fetchActiveOffer = async () => {
    // First check for active manual offers
    const { data: manualOffers } = await supabase
      .from('global_offers')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (manualOffers && manualOffers.length > 0) {
      setCurrentOffer(manualOffers[0] as GlobalOffer);
      return;
    }

    // Check for auto-detected festivals
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const { data: festivals } = await supabase
      .from('festival_calendar')
      .select('*')
      .eq('is_active', true);

    if (festivals) {
      const activeFestival = festivals.find((festival: FestivalCalendar) => {
        const festivalStart = new Date(today.getFullYear(), festival.month - 1, festival.day);
        const festivalEnd = new Date(festivalStart);
        festivalEnd.setDate(festivalEnd.getDate() + festival.duration_days);
        
        return today >= festivalStart && today <= festivalEnd;
      });

      if (activeFestival) {
        const fest = activeFestival as FestivalCalendar;
        setCurrentOffer({
          id: fest.id,
          title: `${fest.name} Special Offer!`,
          description: fest.description || `Celebrate ${fest.name} with exclusive discounts!`,
          discount_percentage: fest.default_discount,
          event_type: 'festival',
          event_name: fest.name,
          banner_text: `🎊 ${fest.name} Sale - ${fest.default_discount}% OFF! 🎊`,
          icon: fest.icon,
          theme_primary_color: fest.theme_primary,
          theme_secondary_color: fest.theme_secondary,
          theme_accent_color: '#F59E0B',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
        });
      }
    }
  };

  // Don't show for admin roles if daily limit reached
  if (!currentOffer || !isVisible || hasReachedLimit) return null;

  const handleDismiss = () => {
    if (ADMIN_ROLES.includes(userRole || '')) {
      incrementAdminShowCount();
      const newCount = getAdminShowCount();
      if (newCount >= MAX_SHOWS_PER_DAY) {
        setHasReachedLimit(true);
      }
    }
    setIsMinimized(true);
  };
  const handleClose = () => {
    if (ADMIN_ROLES.includes(userRole || '')) {
      incrementAdminShowCount();
      const newCount = getAdminShowCount();
      if (newCount >= MAX_SHOWS_PER_DAY) {
        setHasReachedLimit(true);
      }
      setIsVisible(false);
    } else {
      setIsMinimized(true);
    }
  };

  const getIcon = () => {
    if (currentOffer.icon) {
      return <span className="text-2xl">{currentOffer.icon}</span>;
    }
    switch (currentOffer.event_type) {
      case 'sports':
        return <Trophy className="w-5 h-5" />;
      case 'festival':
        return <Gift className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          ref={ref}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentOffer.theme_primary_color}, ${currentOffer.theme_secondary_color})`,
          }}
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-30"
                style={{
                  backgroundColor: currentOffer.theme_accent_color,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Left: Icon and Title */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm"
                >
                  {getIcon()}
                </motion.div>
                <div className="hidden sm:block">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {currentOffer.title}
                  </h3>
                  <p className="text-white/80 text-xs hidden md:block">
                    {currentOffer.description}
                  </p>
                </div>
              </div>

              {/* Center: Banner Text with Discount */}
              <motion.div
                className="flex-1 text-center"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold text-white text-sm sm:text-lg">
                    {currentOffer.banner_text || `${currentOffer.discount_percentage}% OFF`}
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </div>
              </motion.div>

              {/* Right: Discount Badge and Close */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg"
                  style={{ backgroundColor: currentOffer.theme_accent_color }}
                  animate={{ 
                    boxShadow: [
                      `0 0 10px ${currentOffer.theme_accent_color}`,
                      `0 0 20px ${currentOffer.theme_accent_color}`,
                      `0 0 10px ${currentOffer.theme_accent_color}`,
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-white">{currentOffer.discount_percentage}%</span>
                  <span className="text-white/80 text-sm">OFF</span>
                </motion.div>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Running text animation */}
          <div className="bg-black/20 py-1 overflow-hidden">
            <motion.div
              className="whitespace-nowrap text-white/90 text-xs font-medium"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {currentOffer.icon} {currentOffer.banner_text || currentOffer.title} • 
              Get {currentOffer.discount_percentage}% discount on all services! • 
              Limited time offer • Valid till {new Date(currentOffer.end_date).toLocaleDateString()} • 
              {currentOffer.icon} {currentOffer.banner_text || currentOffer.title} •
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-4 right-4 z-[100] p-3 rounded-full shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${currentOffer.theme_primary_color}, ${currentOffer.theme_secondary_color})`,
          }}
          onClick={() => setIsMinimized(false)}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Gift className="w-5 h-5 text-white" />
          </motion.div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {currentOffer.discount_percentage}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

GlobalOfferPopupInner.displayName = 'GlobalOfferPopup';

export const GlobalOfferPopup = GlobalOfferPopupInner;
export default GlobalOfferPopup;
