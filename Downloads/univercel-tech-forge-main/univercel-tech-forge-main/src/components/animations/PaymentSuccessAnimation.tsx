import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, Sparkles, Zap, Star } from 'lucide-react';

interface PaymentSuccessAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  amount?: string;
  transactionId?: string;
}

const PaymentSuccessAnimation = ({ 
  isVisible, 
  onComplete, 
  amount = '₹999',
  transactionId = 'TXN-XXXX-XXXX'
}: PaymentSuccessAnimationProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStage(0);
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 800),
      setTimeout(() => setStage(3), 1500),
      setTimeout(() => setStage(4), 2500),
      setTimeout(() => onComplete(), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  // Generate confetti particles
  const confettiColors = [
    'hsl(45, 100%, 50%)',
    'hsl(210, 100%, 55%)',
    'hsl(280, 100%, 60%)',
    'hsl(120, 100%, 45%)',
    'hsl(330, 100%, 60%)',
    'hsl(187, 100%, 50%)',
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(220,30%,3%)/0.95]"
        >
          {/* Digital Confetti */}
          {stage >= 3 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(60)].map((_, i) => {
                const color = confettiColors[i % confettiColors.length];
                const isSquare = i % 3 === 0;
                const startX = 50 + (Math.random() - 0.5) * 20;
                
                return (
                  <motion.div
                    key={i}
                    className={`absolute ${isSquare ? 'w-3 h-3' : 'w-2 h-4'}`}
                    style={{
                      background: color,
                      left: `${startX}%`,
                      top: '50%',
                      borderRadius: isSquare ? '2px' : '1px',
                      boxShadow: `0 0 10px ${color}`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 0.5],
                      x: (Math.random() - 0.5) * 600,
                      y: [0, -200 - Math.random() * 300, 400 + Math.random() * 200],
                      rotate: Math.random() * 720 - 360,
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      delay: Math.random() * 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                );
              })}

              {/* Star bursts */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute left-1/2 top-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos((i / 12) * Math.PI * 2) * 150,
                    y: Math.sin((i / 12) * Math.PI * 2) * 150,
                  }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.05 }}
                >
                  <Star className="w-6 h-6 text-[hsl(45,100%,50%)] fill-[hsl(45,100%,50%)]" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Central Content */}
          <div className="relative z-10 text-center">
            {/* Checkmark Circle */}
            <motion.div
              className="relative mx-auto mb-8 w-32 h-32"
              initial={{ scale: 0 }}
              animate={{ scale: stage >= 1 ? 1 : 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            >
              {/* Outer rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-[hsl(120,100%,45%)]"
                  style={{ 
                    transform: `scale(${1 + i * 0.3})`,
                    opacity: 0.3 - i * 0.1
                  }}
                  animate={{
                    scale: [1 + i * 0.3, 1.2 + i * 0.3, 1 + i * 0.3],
                    opacity: [0.3 - i * 0.1, 0.5 - i * 0.1, 0.3 - i * 0.1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}

              {/* Main circle */}
              <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(120,100%,45%), hsl(150,100%,40%))',
                  boxShadow: '0 0 60px hsl(120 100% 45% / 0.6), inset 0 0 30px hsl(120 100% 60% / 0.3)'
                }}
                animate={{
                  boxShadow: [
                    '0 0 60px hsl(120 100% 45% / 0.6), inset 0 0 30px hsl(120 100% 60% / 0.3)',
                    '0 0 80px hsl(120 100% 45% / 0.8), inset 0 0 40px hsl(120 100% 60% / 0.5)',
                    '0 0 60px hsl(120 100% 45% / 0.6), inset 0 0 30px hsl(120 100% 60% / 0.3)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {/* Checkmark */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ 
                    scale: stage >= 2 ? 1 : 0, 
                    rotate: stage >= 2 ? 0 : -45 
                  }}
                  transition={{ type: 'spring', damping: 8, delay: 0.2 }}
                >
                  <Check className="w-16 h-16 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>

              {/* Sparkle effects */}
              {stage >= 2 && [...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos((i / 8) * Math.PI * 2) * 80 - 10,
                    y: Math.sin((i / 8) * Math.PI * 2) * 80 - 10,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                >
                  <Sparkles className="w-5 h-5 text-[hsl(45,100%,50%)]" />
                </motion.div>
              ))}
            </motion.div>

            {/* Payment Done Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-8 h-8 text-[hsl(45,100%,50%)]" />
                <h1 
                  className="text-4xl sm:text-5xl font-bold"
                  style={{
                    background: 'linear-gradient(90deg, hsl(45,100%,50%), hsl(120,100%,45%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 20px hsl(45 100% 50% / 0.5))'
                  }}
                >
                  Payment Done!
                </h1>
                <Zap className="w-8 h-8 text-[hsl(45,100%,50%)]" />
              </div>
            </motion.div>

            {/* Amount */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: stage >= 3 ? 1 : 0, scale: stage >= 3 ? 1 : 0.5 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <motion.p
                className="text-5xl font-bold text-[hsl(120,100%,50%)] mb-2"
                animate={{ 
                  textShadow: [
                    '0 0 20px hsl(120 100% 50% / 0.5)',
                    '0 0 40px hsl(120 100% 50% / 0.8)',
                    '0 0 20px hsl(120 100% 50% / 0.5)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {amount}
              </motion.p>
              <p className="text-muted-foreground">Transaction Successful</p>
            </motion.div>

            {/* Transaction ID */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 4 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-muted-foreground">ID:</span>
              <span 
                className="font-mono text-sm px-3 py-1 rounded border border-[hsl(120,100%,45%)/50] bg-[hsl(120,100%,45%)/10] text-[hsl(120,100%,50%)]"
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

export default PaymentSuccessAnimation;
