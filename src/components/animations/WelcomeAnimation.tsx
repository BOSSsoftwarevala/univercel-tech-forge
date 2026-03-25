import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Bot, Sparkles, Shield, Users, Crown, Code, TrendingUp, Megaphone } from 'lucide-react';

interface WelcomeAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  userName?: string;
  userRole?: string;
}

const roleConfig: Record<string, { color: string; icon: typeof Bot; title: string }> = {
  super_admin: { color: 'hsl(0, 100%, 60%)', icon: Shield, title: 'Supreme Commander' },
  franchise: { color: 'hsl(45, 100%, 50%)', icon: Users, title: 'Franchise Partner' },
  reseller: { color: 'hsl(280, 100%, 60%)', icon: TrendingUp, title: 'Reseller Pro' },
  prime_user: { color: 'hsl(45, 100%, 55%)', icon: Crown, title: 'Prime Member' },
  developer: { color: 'hsl(120, 100%, 45%)', icon: Code, title: 'Developer Elite' },
  influencer: { color: 'hsl(330, 100%, 60%)', icon: Megaphone, title: 'Influencer Star' },
  default: { color: 'hsl(210, 100%, 55%)', icon: Bot, title: 'Member' },
};

const WelcomeAnimation = ({ isVisible, onComplete, userName = 'User', userRole = 'default' }: WelcomeAnimationProps) => {
  const [stage, setStage] = useState(0);
  const config = roleConfig[userRole] || roleConfig.default;
  const IconComponent = config.icon;

  useEffect(() => {
    if (!isVisible) {
      setStage(0);
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2200),
      setTimeout(() => setStage(4), 3500),
      setTimeout(() => {
        onComplete();
      }, 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(220,30%,3%)]"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(${config.color}20 1px, transparent 1px),
                  linear-gradient(90deg, ${config.color}20 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          {/* Scanning Lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[2px]"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
                  top: `${20 + i * 15}%`
                }}
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </motion.div>

          {/* Central Content */}
          <div className="relative z-10 text-center">
            {/* AI Hologram Avatar */}
            <motion.div
              className="relative mx-auto mb-8"
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ 
                scale: stage >= 1 ? 1 : 0, 
                rotateY: stage >= 1 ? 0 : 180 
              }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              {/* Hologram Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                  style={{ 
                    borderColor: config.color,
                    width: `${120 + i * 40}px`,
                    height: `${120 + i * 40}px`,
                    opacity: 0.3 - i * 0.1
                  }}
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 10 - i * 2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, delay: i * 0.3 }
                  }}
                />
              ))}
              
              {/* Core Icon */}
              <motion.div
                className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${config.color}40, transparent)`,
                  boxShadow: `0 0 60px ${config.color}60, inset 0 0 30px ${config.color}30`
                }}
                animate={{
                  boxShadow: [
                    `0 0 60px ${config.color}60, inset 0 0 30px ${config.color}30`,
                    `0 0 80px ${config.color}80, inset 0 0 40px ${config.color}50`,
                    `0 0 60px ${config.color}60, inset 0 0 30px ${config.color}30`,
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconComponent className="w-12 h-12" style={{ color: config.color }} />
              </motion.div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 20 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
                style={{ 
                  color: config.color,
                  textShadow: `0 0 30px ${config.color}80`
                }}
              >
                Welcome to SOFTWARE VALA
              </motion.h1>
              <motion.div
                className="h-1 mx-auto rounded-full mb-6"
                style={{ background: `linear-gradient(90deg, transparent, ${config.color}, transparent)` }}
                initial={{ width: 0 }}
                animate={{ width: stage >= 2 ? '80%' : 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>

            {/* User Greeting */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: stage >= 3 ? 1 : 0, scale: stage >= 3 ? 1 : 0.8 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <p className="text-xl text-muted-foreground mb-2">
                Hello, <span className="font-bold" style={{ color: config.color }}>{userName}</span>
              </p>
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{ borderColor: config.color, background: `${config.color}10` }}
              >
                <Sparkles className="w-4 h-4" style={{ color: config.color }} />
                <span style={{ color: config.color }}>{config.title}</span>
              </div>
            </motion.div>

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {stage >= 3 && [...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    background: config.color,
                    left: `${50 + (Math.random() - 0.5) * 60}%`,
                    top: `${50 + (Math.random() - 0.5) * 60}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -100 - Math.random() * 100],
                    x: [(Math.random() - 0.5) * 100],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeAnimation;
