import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface WelcomeBossProps {
  disabled?: boolean;
}

const WelcomeBoss = ({ disabled = false }: WelcomeBossProps) => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Boss';
  const firstName = userName.split(' ')[0];

  return (
    <motion.div 
      className="text-center py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Title Container */}
      <motion.div 
        className="relative inline-flex items-center gap-3"
        whileHover={disabled ? {} : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Particle Container */}
        {!disabled && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/60 rounded-full"
                initial={{ 
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 40 - 20,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: [null, Math.random() * 200 - 100],
                  y: [null, Math.random() * 40 - 20],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  boxShadow: '0 0 6px 2px hsl(var(--primary) / 0.4)'
                }}
              />
            ))}
          </div>
        )}

        {/* Animated Title */}
        <h1 
          className="relative text-4xl md:text-5xl font-bold tracking-wider"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(190 95% 70%), hsl(var(--primary)))',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: disabled ? 'none' : 'shimmer 6s linear infinite',
            textShadow: '0 0 30px hsl(var(--primary) / 0.3)',
          }}
        >
          WELCOME {firstName.toUpperCase()}
        </h1>

        {/* Crown Badge */}
        <motion.div
          className="relative"
          animate={disabled ? {} : { 
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Crown Glow */}
          <div 
            className="absolute inset-0 blur-md rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
            }}
          />
          <Crown 
            className="w-8 h-8 md:w-10 md:h-10 relative z-10"
            style={{
              color: '#FFD700',
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Role Badge */}
      <motion.div
        className="mt-3 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Badge className="bg-primary/20 text-primary border border-primary/30 px-3 py-1">
          SUPER ADMIN
        </Badge>
      </motion.div>

      {/* Subtitle */}
      <motion.p 
        className="mt-2 text-sm md:text-base text-muted-foreground tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Your global command center is fully operational.
      </motion.p>

      {/* Shimmer Keyframes - injected via style tag */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}</style>
    </motion.div>
  );
};

export default WelcomeBoss;
