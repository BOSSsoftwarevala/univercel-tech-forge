import { motion } from 'framer-motion';
import { 
  PartyPopper, 
  Trophy, 
  Rocket, 
  Star, 
  TrendingUp, 
  CheckCircle,
  Zap,
  Heart,
  Gift,
  Crown
} from 'lucide-react';

type CelebrationType = 
  | 'sale' 
  | 'task_complete' 
  | 'target_achieved' 
  | 'new_client' 
  | 'payment_received'
  | 'lead_converted'
  | 'milestone'
  | 'promotion';

interface CelebrationConfig {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  bgGradient: string;
  emoji: string;
}

const celebrationConfigs: Record<CelebrationType, CelebrationConfig> = {
  sale: {
    icon: Trophy,
    title: "🎉 Sale Closed!",
    subtitle: "Amazing work! You're on fire today!",
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/20 to-amber-500/10",
    emoji: "🏆"
  },
  task_complete: {
    icon: CheckCircle,
    title: "✅ Task Complete!",
    subtitle: "Great job! Keep the momentum going!",
    color: "text-green-400",
    bgGradient: "from-green-500/20 to-emerald-500/10",
    emoji: "🚀"
  },
  target_achieved: {
    icon: TrendingUp,
    title: "🎯 Target Achieved!",
    subtitle: "You've hit your goal! Incredible!",
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-cyan-500/10",
    emoji: "⭐"
  },
  new_client: {
    icon: Heart,
    title: "💼 New Client!",
    subtitle: "Welcome aboard! Let's make magic happen!",
    color: "text-pink-400",
    bgGradient: "from-pink-500/20 to-rose-500/10",
    emoji: "🤝"
  },
  payment_received: {
    icon: Zap,
    title: "💰 Payment Received!",
    subtitle: "Cha-ching! The money's in!",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-teal-500/10",
    emoji: "💎"
  },
  lead_converted: {
    icon: Rocket,
    title: "🔥 Lead Converted!",
    subtitle: "From prospect to partner - brilliant!",
    color: "text-orange-400",
    bgGradient: "from-orange-500/20 to-red-500/10",
    emoji: "🌟"
  },
  milestone: {
    icon: Star,
    title: "⭐ Milestone Reached!",
    subtitle: "You're making history! Keep it up!",
    color: "text-violet-400",
    bgGradient: "from-violet-500/20 to-purple-500/10",
    emoji: "🎊"
  },
  promotion: {
    icon: Crown,
    title: "👑 Congratulations!",
    subtitle: "You've been promoted! Well deserved!",
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-yellow-500/10",
    emoji: "🎉"
  }
};

interface CelebrationToastProps {
  type: CelebrationType;
  message?: string;
  onClose?: () => void;
}

export const CelebrationToast = ({ type, message, onClose }: CelebrationToastProps) => {
  const config = celebrationConfigs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.bgGradient} border border-white/10 p-4 min-w-[320px]`}
    >
      {/* Confetti particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [-10, -60],
            x: (i % 2 === 0 ? 1 : -1) * Math.random() * 40
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="absolute top-4"
          style={{ left: `${10 + i * 12}%` }}
        >
          <span className="text-lg">{['🎊', '✨', '🌟', '💫', '⭐'][i % 5]}</span>
        </motion.div>
      ))}

      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.5, repeat: 3 }}
          className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${config.color}`}
        >
          <Icon className="w-6 h-6" />
        </motion.div>

        <div className="flex-1">
          <motion.h4
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`font-bold ${config.color}`}
          >
            {config.title}
          </motion.h4>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {message || config.subtitle}
          </motion.p>
        </div>

        <motion.span
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-3xl"
        >
          {config.emoji}
        </motion.span>
      </div>
    </motion.div>
  );
};

// Role-specific motivational messages
export const roleMotivationalMessages: Record<string, string[]> = {
  master: [
    "The empire runs smoothly under your command! 👑",
    "Your leadership inspires excellence across all teams!",
    "Another day, another milestone conquered!"
  ],
  super_admin: [
    "Keep the systems running like clockwork! ⚡",
    "Your oversight keeps everything in perfect order!",
    "Management excellence at its finest!"
  ],
  admin: [
    "Welcome Admin! Operations are under control! 🛡️",
    "Your coordination keeps the team aligned!",
    "Administrative excellence in action!"
  ],
  franchise: [
    "Welcome Partner! Your territory awaits! 🤝",
    "Building success together, one deal at a time!",
    "Your partnership drives our growth!"
  ],
  reseller: [
    "Welcome Reseller! Ready to close some deals? 💼",
    "Every sale brings us closer to greatness!",
    "You're our sales champion!"
  ],
  developer: [
    "Dev Mode Active! Time to build amazing things! 💻",
    "Code today, change tomorrow!",
    "Every line of code makes a difference!"
  ],
  influencer: [
    "Creator Unlocked! Your influence matters! 🌟",
    "Your reach is our strength!",
    "Keep inspiring the world!"
  ],
  client: [
    "Welcome! We're here to serve you! 🙏",
    "Your success is our success!",
    "Thank you for choosing us!"
  ],
  prime: [
    "VIP Access Granted! Premium experience awaits! 👑",
    "You deserve the best, and we deliver!",
    "Exclusive benefits at your fingertips!"
  ],
  support: [
    "Support Hero Activated! Help is what we do! 💪",
    "Every ticket solved is a smile earned!",
    "You're the voice of care!"
  ],
  finance_manager: [
    "Numbers don't lie, and neither do you! 📊",
    "Financial excellence in action!",
    "Keeping the books balanced perfectly!"
  ],
  marketing_manager: [
    "Campaign Commander Online! 📢",
    "Your creativity drives our growth!",
    "Marketing magic in progress!"
  ],
  demo_manager: [
    "Demo Master Ready! Showcase time! 🎯",
    "Every demo is a chance to shine!",
    "Your presentations inspire confidence!"
  ],
  hr_manager: [
    "People Champion Active! 👥",
    "Building the dream team, one hire at a time!",
    "Culture starts with you!"
  ],
  lead_manager: [
    "Lead Hunter Mode ON! 🎯",
    "Every lead is a potential success story!",
    "Converting prospects into partners!"
  ],
  task_manager: [
    "Task Commander Online! Workflow mastery! 📋",
    "Every task completed is progress made!",
    "You keep the wheels turning smoothly!"
  ],
  seo_manager: [
    "SEO Wizard Active! Rankings incoming! 🔍",
    "Your optimization drives visibility!",
    "Search engines love what you do!"
  ],
  legal_compliance: [
    "Compliance Guardian Ready! Legal shield up! ⚖️",
    "Keeping us protected and compliant!",
    "Your vigilance safeguards the company!"
  ],
  performance_manager: [
    "Performance Analyst Online! Metrics matter! 📈",
    "Your insights drive improvement!",
    "Excellence is measured by you!"
  ],
  rnd_manager: [
    "R&D Innovator Activated! Discovery awaits! 🔬",
    "Your research shapes our future!",
    "Innovation starts with you!"
  ],
  ai_manager: [
    "AI Orchestrator Online! Intelligence unleashed! 🤖",
    "Your AI management drives efficiency!",
    "Machine learning at your command!"
  ],
  client_success: [
    "Client Champion Ready! Success awaits! 🌟",
    "Happy clients are your superpower!",
    "Building relationships that last!"
  ],
  api_security: [
    "Security Sentinel Online! Systems protected! 🔐",
    "Your vigilance keeps our APIs safe!",
    "Zero breaches on your watch!"
  ],
  r_and_d: [
    "R&D Explorer Activated! Innovation awaits! 🔬",
    "Your discoveries shape our future!",
    "Testing today, launching tomorrow!"
  ],
  default: [
    "Welcome back! Great things await! ✨",
    "Let's make today amazing!",
    "You're an important part of our team!"
  ]
};

export default CelebrationToast;
