import { motion } from 'framer-motion';
import { Sparkles, Rocket, Users, Code, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FuturisticHero = () => {
  const ctaButtons = [
    { label: 'Explore Live Demos', href: '/demo-manager', icon: Rocket, variant: 'primary' },
    { label: 'Join as Franchise', href: '/franchise-landing', icon: Users, variant: 'gold' },
    { label: 'Become Reseller', href: '/reseller-landing', icon: Users, variant: 'secondary' },
    { label: 'Apply Developer', href: '/auth', icon: Code, variant: 'secondary' },
    { label: 'Upgrade to Prime', href: '/auth', icon: Crown, variant: 'gold' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
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

      {/* Hologram globe background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10">
        <div className="w-full h-full rounded-full border border-[hsl(210,100%,55%)] animate-rotate-slow" 
             style={{ boxShadow: '0 0 60px hsl(210 100% 55% / 0.3)' }}>
          <div className="absolute inset-8 rounded-full border border-[hsl(210,100%,55%)] opacity-50 animate-rotate-slow"
               style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
          <div className="absolute inset-16 rounded-full border border-[hsl(210,100%,55%)] opacity-30" />
        </div>
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full 
                       border border-[hsl(210,100%,55%)/0.3] bg-[hsl(210,100%,55%)/0.1]"
          >
            <Sparkles className="w-4 h-4 text-[hsl(210,100%,55%)]" />
            <span className="text-sm font-medium text-[hsl(210,100%,55%)]">AI-Powered Business Ecosystem</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">Software Vala —</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]"
                  style={{ textShadow: '0 0 40px hsl(210 100% 55% / 0.5)' }}>
              Fixed Price. No Advance.
            </span>
            <span className="block text-[hsl(45,100%,50%)]" 
                  style={{ textShadow: '0 0 30px hsl(45 100% 50% / 0.4)' }}>
              Lifetime Updates.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl">
            AI-Driven, Multi-Role, Masked & Secure Business Ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            {ctaButtons.map((btn, index) => (
              <motion.div
                key={btn.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={btn.href}
                  className={`
                    group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                    transition-all duration-300 overflow-hidden
                    ${btn.variant === 'primary' 
                      ? 'bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)] text-white shadow-[0_0_30px_hsl(210_100%_55%/0.4)]' 
                      : btn.variant === 'gold'
                      ? 'bg-transparent border-2 border-[hsl(45,100%,50%)] text-[hsl(45,100%,50%)] hover:bg-[hsl(45,100%,50%)/0.1] shadow-[0_0_20px_hsl(45_100%_50%/0.3)]'
                      : 'bg-transparent border-2 border-[hsl(210,100%,55%)/0.5] text-[hsl(210,100%,55%)] hover:border-[hsl(210,100%,55%)] hover:bg-[hsl(210,100%,55%)/0.1]'
                    }
                    hover:scale-105 active:scale-95
                  `}
                >
                  <btn.icon className="w-5 h-5" />
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
      </div>
    </section>
  );
};

export default FuturisticHero;
