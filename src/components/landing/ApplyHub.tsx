import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, Code, Megaphone, Crown, 
  Sparkles, DollarSign, CheckCircle, ArrowRight, Brain
} from 'lucide-react';

const ApplyHub = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const applyCards = [
    {
      id: 'franchise',
      icon: Building2,
      title: 'Apply as Franchise',
      description: 'Own a territory. Lead the market.',
      benefits: ['Exclusive territory rights', 'Commission on all sales', 'Full support & training'],
      earnings: '$5,000 - $25,000/month',
      href: '/franchise-landing',
      gradient: 'from-amber-500 to-yellow-600',
    },
    {
      id: 'reseller',
      icon: Users,
      title: 'Apply as Reseller',
      description: 'Sell demos. Earn commissions.',
      benefits: ['No inventory needed', 'Instant demo access', 'Real-time tracking'],
      earnings: '$1,000 - $8,000/month',
      href: '/reseller-landing',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'developer',
      icon: Code,
      title: 'Apply as Developer',
      description: 'Build. Promise. Get paid.',
      benefits: ['Fixed task payments', 'Flexible hours', 'Skill-based matching'],
      earnings: '$2,000 - $12,000/month',
      href: '/auth',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      id: 'influencer',
      icon: Megaphone,
      title: 'Apply as Influencer',
      description: 'Promote. Track. Earn.',
      benefits: ['Custom tracking links', 'Performance bonuses', 'Content support'],
      earnings: '$500 - $5,000/month',
      href: '/auth',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'prime',
      icon: Crown,
      title: 'Join as Prime Customer',
      description: 'Priority. VIP. Fast delivery.',
      benefits: ['24/7 priority support', '2-hour development SLA', 'Dedicated manager'],
      earnings: 'Save 40% on development',
      href: '/auth',
      gradient: 'from-amber-400 to-yellow-500',
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,25%,4%)] to-[hsl(220,20%,6%)]" />
      
      {/* Circuit pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="applyCircuit" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L30 25 M30 35 L30 60 M0 30 L25 30 M35 30 L60 30" 
                    stroke="hsl(210 100% 55%)" strokeWidth="0.5" fill="none"/>
              <circle cx="30" cy="30" r="4" fill="none" stroke="hsl(45 100% 50%)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#applyCircuit)"/>
        </svg>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full 
                         border border-[hsl(45,100%,50%)/0.3] bg-[hsl(45,100%,50%)/0.1]">
            <Sparkles className="w-4 h-4 text-[hsl(45,100%,50%)]" />
            <span className="text-sm font-medium text-[hsl(45,100%,50%)]">Choose Your Path</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ textShadow: '0 0 40px hsl(210 100% 55% / 0.3)' }}>
            Begin Your Journey With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]">
              Software Vala
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Select a Path. AI Guides You Forward.
          </p>
        </motion.div>

        {/* Apply Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {applyCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group"
            >
              <Link to={card.href}>
                <div className={`
                  relative h-full p-6 rounded-2xl overflow-hidden
                  bg-[hsl(220,20%,8%)] 
                  border-2 border-[hsl(45,100%,50%)/0.4]
                  hover:border-[hsl(45,100%,50%)/0.8]
                  transition-all duration-500
                  ${hoveredCard === card.id ? 'shadow-[0_0_50px_hsl(210_100%_55%/0.3),0_0_30px_hsl(45_100%_50%/0.2)]' : ''}
                `}>
                  {/* Holographic ripple effect */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-transparent via-white/5 to-transparent
                    -translate-x-full group-hover:translate-x-full
                    transition-all duration-1000 ease-in-out
                  `} />
                  
                  {/* Neon pulse border animation */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-2xl animate-neon-pulse" />
                  </div>

                  {/* Icon */}
                  <div className={`
                    relative w-14 h-14 rounded-xl mb-4 flex items-center justify-center
                    bg-gradient-to-br ${card.gradient}
                    shadow-[0_0_20px_hsl(45_100%_50%/0.3)]
                    group-hover:shadow-[0_0_35px_hsl(45_100%_50%/0.5)]
                    transition-shadow duration-300
                  `}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[hsl(45,100%,50%)] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    {card.description}
                  </p>

                  {/* Benefits (shown on hover) */}
                  <div className={`
                    space-y-2 mb-4 transition-all duration-300
                    ${hoveredCard === card.id ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'}
                  `}>
                    {card.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3 h-3 text-[hsl(142,76%,50%)]" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Earnings badge */}
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <DollarSign className="w-4 h-4 text-[hsl(45,100%,50%)]" />
                    <span className="text-[hsl(45,100%,50%)] font-medium">{card.earnings}</span>
                  </div>

                  {/* CTA links */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <button className="w-full text-xs text-slate-400 hover:text-[hsl(210,100%,55%)] 
                                     transition-colors flex items-center justify-center gap-1">
                      Know Your Benefits <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* AI Eligibility CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl
                           bg-gradient-to-r from-[hsl(210,100%,55%)/0.2] to-[hsl(187,100%,50%)/0.2]
                           border border-[hsl(210,100%,55%)/0.5] text-white font-medium
                           hover:border-[hsl(210,100%,55%)] hover:shadow-[0_0_30px_hsl(210_100%_55%/0.3)]
                           transition-all duration-300 text-sm sm:text-base">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(210,100%,55%)]" />
            <span className="hidden sm:inline">AI Eligibility Check — Find Your Best Role</span>
            <span className="sm:hidden">AI Eligibility Check</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(45,100%,50%)]" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplyHub;
