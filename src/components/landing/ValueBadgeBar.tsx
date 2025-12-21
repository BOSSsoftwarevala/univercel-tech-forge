import { motion } from 'framer-motion';
import { 
  Banknote, DollarSign, RefreshCcw, Sparkles, Shield, Clock, Wallet 
} from 'lucide-react';

const ValueBadgeBar = () => {
  const badges = [
    { icon: Banknote, label: 'No Advance Payment', tooltip: 'Start your project with zero upfront cost' },
    { icon: DollarSign, label: 'Fixed Pricing', tooltip: 'Know exactly what you pay, no surprises' },
    { icon: RefreshCcw, label: 'Lifetime Free Updates', tooltip: 'Continuous improvements at no extra cost' },
    { icon: Sparkles, label: 'AI Automation Everywhere', tooltip: 'Intelligent automation across all modules' },
    { icon: Shield, label: 'Masked Communication', tooltip: 'Privacy-first masked identity system' },
    { icon: Clock, label: '2-Hour Development Promise', tooltip: 'Rapid development with accountability' },
    { icon: Wallet, label: 'Wallet Protection', tooltip: 'Secure wallet system with escrow protection' },
  ];

  return (
    <section className="relative py-4 sm:py-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(220,25%,4%)]" />
      
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)/0.5] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(210,100%,55%)/0.3] to-transparent" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-xl
                            bg-[hsl(220,20%,8%)] border-2 border-[hsl(45,100%,50%)/0.3]
                            hover:border-[hsl(45,100%,50%)/0.6] transition-all duration-300
                            hover:shadow-[0_0_25px_hsl(45_100%_50%/0.2)]
                            cursor-pointer animate-neon-pulse"
                   style={{ animationDelay: `${index * 0.2}s` }}>
                {/* Icon with neon blue */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[hsl(210,100%,55%)/0.1] 
                              flex items-center justify-center border border-[hsl(210,100%,55%)/0.3]
                              group-hover:bg-[hsl(210,100%,55%)/0.2] transition-colors flex-shrink-0">
                  <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(210,100%,55%)]" 
                              style={{ filter: 'drop-shadow(0 0 8px hsl(210 100% 55% / 0.6))' }} />
                </div>
                
                {/* Label */}
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition-colors whitespace-nowrap">
                  <span className="hidden sm:inline">{badge.label}</span>
                  <span className="sm:hidden">{badge.label.split(' ').slice(0, 2).join(' ')}</span>
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                            rounded-lg bg-[hsl(220,20%,12%)] border border-[hsl(210,100%,55%)/0.3]
                            text-xs text-slate-300 whitespace-nowrap
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            pointer-events-none shadow-xl z-10">
                {badge.tooltip}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                              border-4 border-transparent border-t-[hsl(220,20%,12%)]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueBadgeBar;
