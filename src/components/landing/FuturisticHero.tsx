import { motion } from 'framer-motion';
import { Sparkles, Rocket, Users, Code, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroAiWoman from '@/assets/hero-ai-woman.png';

const FuturisticHero = () => {
  const ctaButtons = [
    { label: 'Explore Live Demos', href: '/demo-manager', icon: Rocket, variant: 'primary' },
    { label: 'Join as Franchise', href: '/franchise-landing', icon: Users, variant: 'gold' },
    { label: 'Become Reseller', href: '/reseller-landing', icon: Users, variant: 'secondary' },
    { label: 'Apply Developer', href: '/auth', icon: Code, variant: 'secondary' },
    { label: 'Upgrade to Prime', href: '/auth', icon: Crown, variant: 'gold' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-8 sm:py-12 lg:py-16">
      {/* Background - Deep charcoal with circuit pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,20%,6%)] via-[hsl(220,25%,4%)] to-[hsl(220,30%,2%)]" />
      
      {/* Neon edge glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-40" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-40" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsl(210,100%,55%)] to-transparent opacity-40" />
      </div>

      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10 L90 10 M10 50 L40 50 M60 50 L90 50 M10 90 L90 90" 
                    stroke="hsl(210 100% 55%)" strokeWidth="0.5" fill="none"/>
              <circle cx="10" cy="10" r="3" fill="hsl(210 100% 55%)"/>
              <circle cx="90" cy="10" r="3" fill="hsl(210 100% 55%)"/>
              <circle cx="50" cy="50" r="4" fill="hsl(210 100% 55%)"/>
              <circle cx="10" cy="90" r="3" fill="hsl(210 100% 55%)"/>
              <circle cx="90" cy="90" r="3" fill="hsl(210 100% 55%)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      {/* Hero Image - Responsive sizing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto flex-shrink-0"
      >
        <img 
          src={heroAiWoman} 
          alt="AI and I - Can Make a Difference" 
          className="w-full h-auto object-contain"
          style={{ 
            filter: 'brightness(1.05) contrast(1.02)'
          }}
        />
        {/* Gradient overlays for blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,4%)] via-transparent to-transparent opacity-70 pointer-events-none" />
      </motion.div>

      {/* CTA Buttons - Below image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 w-full max-w-4xl mx-auto mt-6 sm:mt-8 lg:mt-10"
      >
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center">
          {ctaButtons.map((btn, index) => (
            <motion.div
              key={btn.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Link
                to={btn.href}
                className={`
                  group relative inline-flex items-center gap-1.5 sm:gap-2 
                  px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 
                  rounded-lg sm:rounded-xl 
                  text-xs sm:text-sm lg:text-base font-semibold
                  transition-all duration-300 overflow-hidden whitespace-nowrap
                  ${btn.variant === 'primary' 
                    ? 'bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)] text-white shadow-[0_0_20px_hsl(210_100%_55%/0.3)] sm:shadow-[0_0_30px_hsl(210_100%_55%/0.4)]' 
                    : btn.variant === 'gold'
                    ? 'bg-transparent border border-[hsl(45,100%,50%)] sm:border-2 text-[hsl(45,100%,50%)] hover:bg-[hsl(45,100%,50%)/0.1] shadow-[0_0_15px_hsl(45_100%_50%/0.2)] sm:shadow-[0_0_20px_hsl(45_100%_50%/0.3)]'
                    : 'bg-transparent border border-[hsl(210,100%,55%)/0.5] sm:border-2 text-[hsl(210,100%,55%)] hover:border-[hsl(210,100%,55%)] hover:bg-[hsl(210,100%,55%)/0.1]'
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                <btn.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                {btn.label}
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-200%] 
                                group-hover:translate-x-[200%] transition-transform duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FuturisticHero;
