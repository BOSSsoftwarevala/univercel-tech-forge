import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, Calendar, Sparkles, Layers } from 'lucide-react';

interface BookingSuccessAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  bookingType?: 'demo' | 'subscription' | 'booking';
  bookingId?: string;
}

const typeConfig = {
  demo: { title: 'Demo Scheduled!', subtitle: 'Your demo has been booked', icon: Layers },
  subscription: { title: 'Subscribed!', subtitle: 'Your subscription is now active', icon: Sparkles },
  booking: { title: 'Booked Successfully!', subtitle: 'Your booking is confirmed', icon: Calendar },
};

const BookingSuccessAnimation = ({ 
  isVisible, 
  onComplete, 
  bookingType = 'booking',
  bookingId = 'BK-XXXX-XXXX'
}: BookingSuccessAnimationProps) => {
  const [stage, setStage] = useState(0);
  const config = typeConfig[bookingType];
  const IconComponent = config.icon;

  useEffect(() => {
    if (!isVisible) {
      setStage(0);
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2200),
      setTimeout(() => setStage(4), 3200),
      setTimeout(() => onComplete(), 4000),
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(220,30%,3%)/0.95]"
        >
          {/* Hologram Grid Background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, hsl(210 100% 55% / 0.1), transparent 50%),
                linear-gradient(hsl(210 100% 55% / 0.03) 1px, transparent 1px),
                linear-gradient(90deg, hsl(210 100% 55% / 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 40px 40px, 40px 40px',
            }}
            animate={{
              backgroundPosition: ['0% 0%, 0px 0px, 0px 0px', '0% 0%, 40px 40px, 40px 40px'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          {/* Floating light particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[hsl(210,100%,60%)]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 10px hsl(210 100% 60%)',
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Central Content */}
          <div className="relative z-10 text-center">
            {/* Hologram Transform Animation */}
            <motion.div
              className="relative mx-auto mb-8 w-40 h-40"
            >
              {/* Hologram base platform */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(210 100% 55% / 0.5), transparent)',
                  boxShadow: '0 0 30px hsl(210 100% 55% / 0.5)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Hologram projection lines */}
              {stage >= 1 && [...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-2 left-1/2 w-px origin-bottom"
                  style={{
                    height: '100px',
                    background: `linear-gradient(to top, hsl(210 100% 55% / 0.5), transparent)`,
                    transform: `translateX(-50%) rotate(${(i - 3.5) * 8}deg)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.5 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                />
              ))}

              {/* Initial hologram icon (transforms to checkmark) */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: stage >= 1 && stage < 2 ? 1 : 0,
                  y: stage >= 1 ? 0 : 20,
                  scale: stage >= 2 ? 0 : 1,
                  rotateY: stage >= 2 ? 180 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div 
                  className="p-6 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, hsl(210 100% 55% / 0.3), transparent)',
                    border: '1px solid hsl(210 100% 55% / 0.5)',
                    boxShadow: '0 0 40px hsl(210 100% 55% / 0.3)',
                  }}
                >
                  <IconComponent 
                    className="w-16 h-16" 
                    style={{ 
                      color: 'hsl(210, 100%, 60%)',
                      filter: 'drop-shadow(0 0 10px hsl(210 100% 60%))'
                    }} 
                  />
                </div>
              </motion.div>

              {/* Checkmark reveal */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0, rotateY: -180 }}
                animate={{ 
                  opacity: stage >= 2 ? 1 : 0,
                  scale: stage >= 2 ? 1 : 0,
                  rotateY: stage >= 2 ? 0 : -180,
                }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              >
                {/* Success glow rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border-2 border-[hsl(120,100%,50%)]"
                    style={{
                      width: `${100 + i * 30}px`,
                      height: `${100 + i * 30}px`,
                      opacity: 0.4 - i * 0.1,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.4 - i * 0.1, 0.6 - i * 0.1, 0.4 - i * 0.1],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}

                {/* Checkmark circle */}
                <motion.div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(120, 100%, 45%), hsl(150, 100%, 40%))',
                    boxShadow: '0 0 50px hsl(120 100% 50% / 0.6)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 50px hsl(120 100% 50% / 0.6)',
                      '0 0 70px hsl(120 100% 50% / 0.8)',
                      '0 0 50px hsl(120 100% 50% / 0.6)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Check className="w-14 h-14 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>

              {/* Sparkle burst on transform */}
              {stage >= 2 && [...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos((i / 12) * Math.PI * 2) * 100 - 8,
                    y: Math.sin((i / 12) * Math.PI * 2) * 100 - 8,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.03 }}
                >
                  <Sparkles className="w-4 h-4 text-[hsl(45,100%,55%)]" />
                </motion.div>
              ))}
            </motion.div>

            {/* Success Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(90deg, hsl(120,100%,50%), hsl(187,100%,50%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 15px hsl(120 100% 50% / 0.4))'
                }}
              >
                {config.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{config.subtitle}</p>
            </motion.div>

            {/* Booking ID */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: stage >= 4 ? 1 : 0, scale: stage >= 4 ? 1 : 0.9 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-[hsl(120,100%,45%)/50] bg-[hsl(120,100%,45%)/10]"
            >
              <Calendar className="w-5 h-5 text-[hsl(120,100%,50%)]" />
              <span className="font-mono text-[hsl(120,100%,55%)]">{bookingId}</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSuccessAnimation;
