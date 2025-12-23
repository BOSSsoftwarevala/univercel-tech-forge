/**
 * Role-Based Payment Success Animation
 * Celebratory animations with confetti, checkmarks, and role-based variations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Check, Sparkles, Zap, Star, Crown, Award, PartyPopper } from 'lucide-react';
import { useRoleSounds } from '@/hooks/useRoleSounds';

interface RolePaymentSuccessAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  amount?: string;
  transactionId?: string;
  userRole?: string;
}

const RolePaymentSuccessAnimation = ({ 
  isVisible, 
  onComplete, 
  amount = '₹999',
  transactionId = 'TXN-XXXX-XXXX',
  userRole = 'user'
}: RolePaymentSuccessAnimationProps) => {
  const [stage, setStage] = useState(0);
  const { playPaymentSuccess, isMuted } = useRoleSounds(userRole);

  // Role-based animation style
  const animationStyle = useMemo(() => {
    const role = userRole.toLowerCase();
    
    // Admin: clean check animation only
    if (role.includes('admin') || role.includes('master')) {
      return {
        showConfetti: false,
        showBadge: false,
        showStars: true,
        primaryColor: 'hsl(45, 100%, 50%)',
        secondaryColor: 'hsl(30, 100%, 50%)',
        style: 'minimal',
      };
    }
    
    // Partner (franchise/reseller): badge + confetti
    if (role.includes('franchise') || role.includes('reseller') || role.includes('partner')) {
      return {
        showConfetti: true,
        showBadge: true,
        showStars: true,
        primaryColor: 'hsl(45, 100%, 50%)',
        secondaryColor: 'hsl(210, 100%, 55%)',
        style: 'premium',
      };
    }
    
    // Regular users: simple confetti
    return {
      showConfetti: true,
      showBadge: false,
      showStars: true,
      primaryColor: 'hsl(120, 100%, 45%)',
      secondaryColor: 'hsl(142, 76%, 50%)',
      style: 'standard',
    };
  }, [userRole]);

  // Confetti colors
  const confettiColors = useMemo(() => [
    'hsl(45, 100%, 50%)',
    'hsl(210, 100%, 55%)',
    'hsl(280, 100%, 60%)',
    'hsl(120, 100%, 45%)',
    'hsl(330, 100%, 60%)',
    'hsl(187, 100%, 50%)',
  ], []);

  useEffect(() => {
    if (!isVisible) {
      setStage(0);
      return;
    }

    // Play sound
    if (!isMuted) {
      setTimeout(() => playPaymentSuccess(), 300);
    }

    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => setStage(3), 1200),
      setTimeout(() => setStage(4), 2000),
      setTimeout(() => onComplete(), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete, playPaymentSuccess, isMuted]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'hsl(222, 47%, 4%, 0.97)' }}
        >
          {/* Confetti (for users and partners) */}
          {animationStyle.showConfetti && stage >= 3 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => {
                const color = confettiColors[i % confettiColors.length];
                const isSquare = i % 3 === 0;
                const startX = 50 + (Math.random() - 0.5) * 30;
                
                return (
                  <motion.div
                    key={i}
                    className={`absolute ${isSquare ? 'w-3 h-3' : 'w-2 h-4'}`}
                    style={{
                      background: color,
                      left: `${startX}%`,
                      top: '50%',
                      borderRadius: isSquare ? '2px' : '1px',
                      boxShadow: `0 0 8px ${color}`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0.5],
                      x: (Math.random() - 0.5) * 500,
                      y: [0, -180 - Math.random() * 200, 350 + Math.random() * 150],
                      rotate: Math.random() * 720 - 360,
                    }}
                    transition={{
                      duration: 2.2 + Math.random() * 0.5,
                      delay: Math.random() * 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Stars burst (for all roles) */}
          {animationStyle.showStars && stage >= 3 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute left-1/2 top-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    x: Math.cos((i / 10) * Math.PI * 2) * 130,
                    y: Math.sin((i / 10) * Math.PI * 2) * 130,
                  }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.05 }}
                >
                  <Star className="w-5 h-5 text-[hsl(45,100%,50%)] fill-[hsl(45,100%,50%)]" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Central Content */}
          <div className="relative z-10 text-center px-4">
            {/* Checkmark Circle */}
            <motion.div
              className="relative mx-auto mb-8"
              style={{ width: 140, height: 140 }}
              initial={{ scale: 0 }}
              animate={{ scale: stage >= 1 ? 1 : 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 100 }}
            >
              {/* Outer rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2"
                  style={{ 
                    borderColor: animationStyle.primaryColor,
                    transform: `scale(${1 + i * 0.25})`,
                    opacity: 0.4 - i * 0.1
                  }}
                  animate={{
                    scale: [1 + i * 0.25, 1.15 + i * 0.25, 1 + i * 0.25],
                    opacity: [0.4 - i * 0.1, 0.6 - i * 0.1, 0.4 - i * 0.1],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}

              {/* Main circle */}
              <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${animationStyle.primaryColor}, ${animationStyle.secondaryColor})`,
                  boxShadow: `0 0 50px ${animationStyle.primaryColor}80`
                }}
                animate={{
                  boxShadow: [
                    `0 0 50px ${animationStyle.primaryColor}60`,
                    `0 0 70px ${animationStyle.primaryColor}90`,
                    `0 0 50px ${animationStyle.primaryColor}60`,
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {/* Checkmark or Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ 
                    scale: stage >= 2 ? 1 : 0, 
                    rotate: stage >= 2 ? 0 : -45 
                  }}
                  transition={{ type: 'spring', damping: 10, delay: 0.15 }}
                >
                  {animationStyle.showBadge ? (
                    <Award className="w-16 h-16 text-white" strokeWidth={2.5} />
                  ) : (
                    <Check className="w-16 h-16 text-white" strokeWidth={3} />
                  )}
                </motion.div>
              </motion.div>

              {/* Sparkle effects */}
              {stage >= 2 && [...Array(8)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute left-1/2 top-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos((i / 8) * Math.PI * 2) * 85 - 10,
                    y: Math.sin((i / 8) * Math.PI * 2) * 85 - 10,
                  }}
                  transition={{ duration: 0.7, delay: i * 0.07 }}
                >
                  <Sparkles className="w-5 h-5 text-[hsl(45,100%,50%)]" />
                </motion.div>
              ))}
            </motion.div>

            {/* Payment Success Text */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 25 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-7 h-7 text-[hsl(45,100%,50%)]" />
                <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                  style={{
                    background: `linear-gradient(90deg, ${animationStyle.primaryColor}, ${animationStyle.secondaryColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 20px ${animationStyle.primaryColor}50)`
                  }}
                >
                  Payment Successful 🎉
                </h1>
                <Zap className="w-7 h-7 text-[hsl(45,100%,50%)]" />
              </div>
              
              <p className="text-muted-foreground text-lg mb-4">Access Granted</p>
            </motion.div>

            {/* Amount */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: stage >= 3 ? 1 : 0, scale: stage >= 3 ? 1 : 0.8 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <motion.p
                className="text-5xl font-bold mb-2"
                style={{ 
                  color: animationStyle.primaryColor,
                  textShadow: `0 0 25px ${animationStyle.primaryColor}60`
                }}
                animate={{ 
                  textShadow: [
                    `0 0 25px ${animationStyle.primaryColor}50`,
                    `0 0 40px ${animationStyle.primaryColor}80`,
                    `0 0 25px ${animationStyle.primaryColor}50`,
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {amount}
              </motion.p>
            </motion.div>

            {/* Partner badge (for franchise/reseller) */}
            {animationStyle.showBadge && stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-4"
              >
                <div 
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full border"
                  style={{ 
                    borderColor: 'hsl(45, 100%, 50%)',
                    background: 'hsl(45, 100%, 50%, 0.15)',
                  }}
                >
                  <Crown className="w-5 h-5 text-[hsl(45,100%,50%)]" />
                  <span className="font-medium text-[hsl(45,100%,55%)]">Partner Upgrade</span>
                </div>
              </motion.div>
            )}

            {/* Transaction ID */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 4 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-muted-foreground text-sm">Transaction ID:</span>
              <span 
                className="font-mono text-sm px-3 py-1 rounded border"
                style={{ 
                  borderColor: `${animationStyle.primaryColor}50`,
                  background: `${animationStyle.primaryColor}10`,
                  color: animationStyle.primaryColor
                }}
              >
                {transactionId}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RolePaymentSuccessAnimation;
