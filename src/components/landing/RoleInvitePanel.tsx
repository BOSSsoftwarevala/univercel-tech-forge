import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Users, Code, Megaphone, Crown, ArrowRight } from 'lucide-react';

const RoleInvitePanel = () => {
  const roles = [
    {
      icon: Building2,
      name: 'Franchise',
      description: 'Own a territory. Lead the market. Earn commissions.',
      href: '/franchise-landing',
      color: 'gold',
      gradient: 'from-amber-500 to-yellow-500',
      borderColor: 'border-amber-500/50',
      glowColor: 'shadow-[0_0_30px_hsl(45_100%_50%/0.3)]',
    },
    {
      icon: Users,
      name: 'Reseller',
      description: 'Sell demos. Earn on every conversion.',
      href: '/reseller-landing',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/50',
      glowColor: 'shadow-[0_0_30px_hsl(210_100%_55%/0.3)]',
    },
    {
      icon: Code,
      name: 'Developer',
      description: 'Build. Promise. Deliver. Get paid.',
      href: '/auth',
      color: 'cyan',
      gradient: 'from-cyan-500 to-teal-500',
      borderColor: 'border-cyan-500/50',
      glowColor: 'shadow-[0_0_30px_hsl(187_100%_50%/0.3)]',
    },
    {
      icon: Megaphone,
      name: 'Influencer',
      description: 'Promote. Track. Earn commissions.',
      href: '/auth',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/50',
      glowColor: 'shadow-[0_0_30px_hsl(280_100%_65%/0.3)]',
    },
    {
      icon: Crown,
      name: 'Prime User',
      description: 'Priority support. VIP access. Fast delivery.',
      href: '/auth',
      color: 'gold-premium',
      gradient: 'from-amber-400 via-yellow-500 to-amber-600',
      borderColor: 'border-amber-400/60',
      glowColor: 'shadow-[0_0_40px_hsl(45_100%_50%/0.4)]',
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,25%,4%)] to-[hsl(220,20%,6%)]" />
      
      {/* Circuit pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="roleCircuit" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 L30 40 M50 40 L80 40 M40 0 L40 30 M40 50 L40 80" 
                    stroke="hsl(210 100% 55%)" strokeWidth="0.5" fill="none"/>
              <circle cx="40" cy="40" r="5" fill="none" stroke="hsl(210 100% 55%)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roleCircuit)"/>
        </svg>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Join the <span className="text-[hsl(210,100%,55%)]">Ecosystem</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto px-4">
            Choose your role and start earning. Multiple paths, one powerful platform.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={role.href}
                className={`
                  group relative block p-6 rounded-2xl h-full
                  bg-[hsl(220,20%,8%)] border-2 ${role.borderColor}
                  hover:bg-[hsl(220,20%,10%)] transition-all duration-300
                  ${role.glowColor} hover:scale-105
                `}
              >
                {/* Animated border glow */}
                <div className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                  bg-gradient-to-r ${role.gradient} blur-xl transition-opacity duration-500
                `} style={{ transform: 'scale(1.1)', zIndex: -1 }} />

                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl mb-4 flex items-center justify-center
                  bg-gradient-to-br ${role.gradient} opacity-90 group-hover:opacity-100
                  transition-opacity
                `}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent 
                             group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${role.gradient}">
                  {role.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  {role.description}
                </p>

                {/* CTA */}
                <div className={`
                  flex items-center gap-2 text-sm font-medium
                  bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent
                `}>
                  Get Started
                  <ArrowRight className="w-4 h-4 text-current group-hover:translate-x-1 transition-transform" 
                              style={{ color: role.color === 'gold' || role.color === 'gold-premium' ? 'hsl(45 100% 50%)' : 'hsl(210 100% 55%)' }} />
                </div>

                {/* Pulse animation for premium */}
                {role.color === 'gold-premium' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleInvitePanel;
