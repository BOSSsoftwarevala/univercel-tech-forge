import { motion } from "framer-motion";
import { Crown, Sparkles, Shield, Star } from "lucide-react";

interface PrimeVIPBadgeProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  tier?: "monthly" | "yearly" | "lifetime";
}

const PrimeVIPBadge = ({ size = "md", showLabel = true, tier = "yearly" }: PrimeVIPBadgeProps) => {
  const sizeClasses = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-xs" },
    md: { container: "w-12 h-12", icon: "w-6 h-6", text: "text-sm" },
    lg: { container: "w-16 h-16", icon: "w-8 h-8", text: "text-base" }
  };

  const tierConfig = {
    monthly: { label: "Prime", gradient: "from-amber-400 to-amber-600" },
    yearly: { label: "Prime+", gradient: "from-amber-300 via-amber-400 to-amber-600" },
    lifetime: { label: "Prime Elite", gradient: "from-amber-200 via-amber-400 to-amber-700" }
  };

  const config = tierConfig[tier];
  const sizes = sizeClasses[size];

  return (
    <motion.div
      className="inline-flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(251,191,36,0.3)",
            "0 0 40px rgba(251,191,36,0.5)",
            "0 0 20px rgba(251,191,36,0.3)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${sizes.container} rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center relative`}
      >
        <Crown className={`${sizes.icon} text-stone-900`} />
        
        {/* Sparkle effects */}
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute -bottom-1 -left-1"
        >
          <Star className="w-2 h-2 text-amber-200" />
        </motion.div>
      </motion.div>
      
      {showLabel && (
        <div>
          <motion.span
            className={`font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent ${sizes.text}`}
          >
            {config.label}
          </motion.span>
          {tier === "lifetime" && (
            <div className="flex items-center gap-1 text-xs text-amber-500/70">
              <Shield className="w-3 h-3" />
              <span>Lifetime Member</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PrimeVIPBadge;
