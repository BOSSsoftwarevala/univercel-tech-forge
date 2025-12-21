import { motion } from 'framer-motion';
import { Rocket, Users, Code, Crown } from 'lucide-react';
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
        />
        {/* Dark overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,30%,3%)] via-[hsl(220,30%,3%)/0.4] to-[hsl(220,30%,5%)/0.6]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,30%,3%)/0.5] via-transparent to-[hsl(220,30%,3%)/0.5]" />
      </div>

      {/* Animated Particle Grid */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[hsl(210,100%,60%)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px hsl(210 100% 60% / 0.8), 0 0 20px hsl(210 100% 60% / 0.4)'
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Neon Edge Glow Lines */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)] to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(45,100%,50%)] to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[hsl(210,100%,55%)] to-transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[hsl(210,100%,55%)] to-transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Holographic Scan Lines */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(210 100% 60% / 0.03) 2px, hsl(210 100% 60% / 0.03) 4px)',
        }}
        animate={{ backgroundPositionY: ['0px', '100px'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-[hsl(210,100%,55%)/0.3] rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-24 h-24 border border-[hsl(45,100%,50%)/0.2]"
          style={{ transform: 'rotate(45deg)' }}
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-[hsl(187,100%,50%)/0.2]"
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            borderRadius: ['0%', '50%', '0%', '50%', '0%']
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-end min-h-screen pb-12 sm:pb-16 lg:pb-20">
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full"
        >
          {/* First row - 4 buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-3 sm:mb-4">
            {ctaButtons.slice(0, 4).map((btn, index) => (
              <motion.div
                key={btn.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={btn.href}
                  className={`
                    group relative inline-flex items-center gap-2 
                    px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-3.5
                    rounded-full
                    text-sm sm:text-base font-bold uppercase tracking-wide
                    transition-all duration-300 overflow-hidden
                    backdrop-blur-md
                    ${btn.variant === 'primary' 
                      ? 'bg-gradient-to-r from-[hsl(187,100%,50%)] to-[hsl(210,100%,55%)] text-[hsl(220,30%,5%)] shadow-[0_0_30px_hsl(187_100%_50%/0.5),0_0_60px_hsl(210_100%_55%/0.3)] border-2 border-[hsl(187,100%,60%)]' 
                      : btn.variant === 'gold'
                      ? 'bg-[hsl(220,30%,8%)/0.8] border-2 border-[hsl(45,100%,50%)] text-[hsl(45,100%,55%)] shadow-[0_0_25px_hsl(45_100%_50%/0.4),inset_0_0_20px_hsl(45_100%_50%/0.1)]'
                      : 'bg-[hsl(220,30%,8%)/0.8] border-2 border-[hsl(210,100%,55%)/0.6] text-[hsl(210,100%,70%)] shadow-[0_0_20px_hsl(210_100%_55%/0.2),inset_0_0_15px_hsl(210_100%_55%/0.1)]'
                    }
                  `}
                >
                  <btn.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{btn.label}</span>
                  
                  {/* Shine effect */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Second row - 1 button centered */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={ctaButtons[4].href}
                className="
                  group relative inline-flex items-center gap-2 
                  px-6 py-3 sm:px-8 sm:py-3.5 lg:px-10 lg:py-4
                  rounded-full
                  text-sm sm:text-base font-bold uppercase tracking-wide
                  transition-all duration-300 overflow-hidden
                  backdrop-blur-md
                  bg-[hsl(220,30%,8%)/0.8] border-2 border-[hsl(45,100%,50%)] text-[hsl(45,100%,55%)] 
                  shadow-[0_0_30px_hsl(45_100%_50%/0.5),inset_0_0_25px_hsl(45_100%_50%/0.15)]
                "
              >
                <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{ctaButtons[4].label}</span>
                
                {/* Crown glow animation */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,200,50,0.2), transparent)',
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </Link>
            </motion.div>
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
};

export default FuturisticHero;
