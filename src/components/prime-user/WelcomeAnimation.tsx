import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Shield, Star, Sparkles } from "lucide-react";

interface ConfettiParticle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const WelcomeAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showBadge, setShowBadge] = useState(false);
  const [showText, setShowText] = useState(false);

  const confettiColors = [
    "rgb(251, 191, 36)", // amber
    "rgb(6, 182, 212)",  // cyan
    "rgb(250, 204, 21)", // yellow
    "rgb(245, 158, 11)", // amber darker
    "rgb(20, 184, 166)", // teal
    "rgb(255, 255, 255)", // white
  ];

  const confettiParticles: ConfettiParticle[] = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    size: 6 + Math.random() * 10,
    rotation: Math.random() * 360,
  }));

  useEffect(() => {
    const badgeTimer = setTimeout(() => setShowBadge(true), 400);
    const textTimer = setTimeout(() => setShowText(true), 1200);
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(badgeTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/30 overflow-hidden"
      >
        {/* Confetti */}
        {showConfetti && confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              y: -20,
              x: `${particle.x}vw`,
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              y: "110vh",
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0.8, 0]
            }}
            transition={{ 
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear"
            }}
            className="absolute top-0 pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size * 0.6,
              backgroundColor: particle.color,
              borderRadius: particle.size > 12 ? "2px" : "50%",
            }}
          />
        ))}

        {/* Radial glow background */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-96 h-96 rounded-full bg-gradient-radial from-amber-500/40 via-amber-500/10 to-transparent blur-3xl"
        />

        {/* Sparkle particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 1.5,
              delay: 0.8 + i * 0.15,
              repeat: 2,
              repeatDelay: 0.5
            }}
            className="absolute"
            style={{
              left: `${35 + Math.cos(i * 45 * Math.PI / 180) * 20}%`,
              top: `${40 + Math.sin(i * 45 * Math.PI / 180) * 20}%`,
            }}
          >
            <Sparkles className="w-6 h-6 text-amber-400" />
          </motion.div>
        ))}

        {/* Main content */}
        <div className="relative flex flex-col items-center">
          {/* VIP Badge Reveal */}
          <AnimatePresence>
            {showBadge && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 0.8
                }}
                className="relative"
              >
                {/* Outer glow ring */}
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 40px rgba(251, 191, 36, 0.4), 0 0 80px rgba(251, 191, 36, 0.2)",
                      "0 0 60px rgba(251, 191, 36, 0.6), 0 0 120px rgba(251, 191, 36, 0.3)",
                      "0 0 40px rgba(251, 191, 36, 0.4), 0 0 80px rgba(251, 191, 36, 0.2)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center"
                >
                  {/* Inner circle */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-stone-900 to-stone-800 flex items-center justify-center border-4 border-amber-400/50">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                    >
                      <Crown className="w-16 h-16 text-amber-400 drop-shadow-lg" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Floating stars */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`star-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.2, 1],
                      opacity: 1,
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      delay: 0.6 + i * 0.1,
                      duration: 0.5,
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute"
                    style={{
                      left: `${-10 + Math.cos(i * 72 * Math.PI / 180) * 100}%`,
                      top: `${50 + Math.sin(i * 72 * Math.PI / 180) * 100}%`,
                    }}
                  >
                    <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                  </motion.div>
                ))}

                {/* VIP badge */}
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                >
                  <div className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 border-2 border-cyan-300/50 shadow-lg shadow-cyan-500/30">
                    <span className="text-lg font-bold text-white tracking-widest">VIP</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome text */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mt-16 text-center"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent"
                >
                  Welcome Back
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-3 text-lg text-amber-500/80"
                >
                  Your Prime Experience Awaits
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex items-center justify-center gap-2 text-sm text-stone-400"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Priority Access Enabled</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={onComplete}
          className="absolute bottom-10 text-stone-500 hover:text-amber-400 transition-colors text-sm"
        >
          Skip →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeAnimation;
