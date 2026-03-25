import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Fingerprint, Shield, Users, Crown, Code, TrendingUp, Megaphone, Scan } from 'lucide-react';

interface WelcomeBackAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  userName?: string;
  userRole?: string;
  maskedId?: string;
}

const roleConfig: Record<string, { color: string; icon: typeof Shield; greeting: string }> = {
  super_admin: { color: 'hsl(0, 100%, 60%)', icon: Shield, greeting: 'Commander Online' },
  franchise: { color: 'hsl(45, 100%, 50%)', icon: Users, greeting: 'Partner Activated' },
  reseller: { color: 'hsl(280, 100%, 60%)', icon: TrendingUp, greeting: 'Reseller Ready' },
  prime_user: { color: 'hsl(45, 100%, 55%)', icon: Crown, greeting: 'Prime Access Granted' },
  developer: { color: 'hsl(120, 100%, 45%)', icon: Code, greeting: 'Dev Mode Active' },
  influencer: { color: 'hsl(330, 100%, 60%)', icon: Megaphone, greeting: 'Creator Unlocked' },
  default: { color: 'hsl(210, 100%, 55%)', icon: Fingerprint, greeting: 'Access Granted' },
};

const WelcomeBackAnimation = ({ 
  isVisible, 
  onComplete, 
  userName = 'User', 
  userRole = 'default',
  maskedId = 'SV-XXXX-XXXX' 
}: WelcomeBackAnimationProps) => {
  const [stage, setStage] = useState(0);
  const config = roleConfig[userRole] || roleConfig.default;
  const IconComponent = config.icon;

  useEffect(() => {
    if (!isVisible) {
      setStage(0);
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 1000),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setStage(4), 3000),
      setTimeout(() => onComplete(), 3800),
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
          {/* Neon Scan Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
          >
            {/* Horizontal scan */}
            <motion.div
              className="absolute left-0 right-0 h-1"
              style={{ 
                background: `linear-gradient(90deg, transparent 0%, ${config.color} 50%, transparent 100%)`,
                boxShadow: `0 0 30px ${config.color}, 0 0 60px ${config.color}50`
              }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Vertical scan */}
            <motion.div
              className="absolute top-0 bottom-0 w-1"
              style={{ 
                background: `linear-gradient(180deg, transparent 0%, ${config.color} 50%, transparent 100%)`,
                boxShadow: `0 0 30px ${config.color}, 0 0 60px ${config.color}50`
              }}
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Corner Brackets */}
          <div className="absolute inset-8 pointer-events-none">
            {[
              'top-0 left-0 border-t-2 border-l-2',
              'top-0 right-0 border-t-2 border-r-2',
              'bottom-0 left-0 border-b-2 border-l-2',
              'bottom-0 right-0 border-b-2 border-r-2',
            ].map((classes, i) => (
              <motion.div
                key={i}
                className={`absolute w-16 h-16 ${classes}`}
                style={{ borderColor: config.color }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: stage >= 1 ? 1 : 0, 
                  scale: stage >= 1 ? 1 : 0.5 
                }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            ))}
          </div>

          {/* Central Content */}
          <div className="relative z-10 text-center">
            {/* Fingerprint Scanner */}
            <motion.div
              className="relative mx-auto mb-8 w-32 h-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Scan ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4"
                style={{ borderColor: `${config.color}50` }}
                animate={{ 
                  boxShadow: [
                    `0 0 20px ${config.color}30`,
                    `0 0 40px ${config.color}60`,
                    `0 0 20px ${config.color}30`,
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Scanning fill */}
              <motion.div
                className="absolute inset-2 rounded-full overflow-hidden"
                style={{ background: `${config.color}10` }}
              >
                <motion.div
                  className="absolute inset-x-0 h-full"
                  style={{ background: `linear-gradient(to bottom, transparent, ${config.color}40, transparent)` }}
                  animate={{ top: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: stage < 2 ? Infinity : 0 }}
                />
              </motion.div>

              {/* Icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  scale: stage >= 2 ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <IconComponent 
                  className="w-16 h-16" 
                  style={{ 
                    color: config.color,
                    filter: `drop-shadow(0 0 10px ${config.color})`
                  }} 
                />
              </motion.div>

              {/* Success checkmark overlay */}
              {stage >= 2 && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      background: `radial-gradient(circle, ${config.color}40, transparent)`,
                    }}
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Welcome Back Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ 
                  color: config.color,
                  textShadow: `0 0 20px ${config.color}60`
                }}
              >
                Welcome Back
              </h1>
              <p className="text-xl text-muted-foreground mb-4">{userName}</p>
            </motion.div>

            {/* Role Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: stage >= 3 ? 1 : 0, scale: stage >= 3 ? 1 : 0.8 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border"
                style={{ 
                  borderColor: config.color, 
                  background: `linear-gradient(135deg, ${config.color}20, transparent)`,
                  boxShadow: `0 0 30px ${config.color}30`
                }}
                animate={{
                  boxShadow: [
                    `0 0 30px ${config.color}30`,
                    `0 0 50px ${config.color}50`,
                    `0 0 30px ${config.color}30`,
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Scan className="w-5 h-5" style={{ color: config.color }} />
                <span className="font-semibold" style={{ color: config.color }}>
                  {config.greeting}
                </span>
              </motion.div>
            </motion.div>

            {/* Masked ID Reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 4 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>ID:</span>
                <motion.span
                  className="font-mono tracking-wider px-3 py-1 rounded border"
                  style={{ 
                    borderColor: `${config.color}50`,
                    background: `${config.color}10`
                  }}
                >
                  {maskedId.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ color: config.color }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBackAnimation;
