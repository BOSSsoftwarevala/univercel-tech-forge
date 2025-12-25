import { memo } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroAiWoman from '@/assets/hero-ai-woman.png';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const FuturisticHero = memo(function FuturisticHero() {
  const { performanceMode } = useNetworkStatus();
  const isLite = performanceMode !== 'full';

  const ctaButtons = [
    { label: 'Explore Live Demos', href: '/demos/public', icon: Rocket, variant: 'primary' },
    { label: 'Upgrade to Prime', href: '/auth', icon: Crown, variant: 'gold' },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Fullscreen Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroAiWoman} 
          alt="AI and I - Can Make a Difference" 
          className="w-full h-full object-cover object-center"
          style={{ 
            filter: 'brightness(1.1) contrast(1.05) saturate(1.1)'
          }}
          loading="eager"
        />
        {/* Dark overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,30%,3%)] via-[hsl(220,30%,3%)/0.4] to-[hsl(220,30%,5%)/0.6]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,30%,3%)/0.5] via-transparent to-[hsl(220,30%,3%)/0.5]" />
      </div>

      {/* Static particles for lite mode, animated for full mode */}
      {!isLite && (
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[hsl(210,100%,60%)]"
              style={{
                left: `${10 + i * 9}%`,
                top: `${15 + (i % 4) * 20}%`,
                opacity: 0.4,
                boxShadow: '0 0 8px hsl(210 100% 60% / 0.6)'
              }}
            />
          ))}
        </div>
      )}

      {/* Static Neon Edge Glow Lines */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(45,100%,50%)] to-transparent opacity-40" />
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-30" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-end min-h-screen pb-12 sm:pb-16 lg:pb-20">
        
        {/* CTA Buttons */}
        <motion.div
          initial={isLite ? {} : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {ctaButtons.map((btn, index) => (
              <motion.div
                key={btn.label}
                initial={isLite ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={isLite ? {} : { scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={btn.href}
                  className={`
                    group relative inline-flex items-center gap-2 
                    px-5 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-4
                    rounded-full
                    text-sm sm:text-base font-bold uppercase tracking-wide
                    transition-all duration-200 overflow-hidden
                    backdrop-blur-md
                    ${btn.variant === 'primary' 
                      ? 'bg-gradient-to-r from-[hsl(187,100%,50%)] to-[hsl(210,100%,55%)] text-[hsl(220,30%,5%)] shadow-[0_0_20px_hsl(187_100%_50%/0.4)] border-2 border-[hsl(187,100%,60%)]' 
                      : 'bg-[hsl(220,30%,8%)/0.8] border-2 border-[hsl(45,100%,50%)] text-[hsl(45,100%,55%)] shadow-[0_0_20px_hsl(45_100%_50%/0.4)]'
                    }
                  `}
                >
                  <btn.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{btn.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-[hsl(210,100%,55%)/0.4] z-[5]" />
      <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-[hsl(210,100%,55%)/0.4] z-[5]" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-[hsl(45,100%,50%)/0.4] z-[5]" />
      <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-[hsl(45,100%,50%)/0.4] z-[5]" />
    </section>
  );
});

export default FuturisticHero;
