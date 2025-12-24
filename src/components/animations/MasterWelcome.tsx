import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Shield, Zap, Star, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface MasterWelcomeProps {
  disabled?: boolean;
}

const MasterWelcome = ({ disabled = false }: MasterWelcomeProps) => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                    user?.email?.split('@')[0] || 'Master';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: disabled ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/40 via-orange-950/30 to-yellow-950/20 border border-amber-500/30 p-8"
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={disabled ? {} : { 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={disabled ? {} : { 
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        {!disabled && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [-20, -100],
              x: Math.sin(i) * 50
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute bottom-0"
            style={{ left: `${15 + i * 15}%` }}
          >
            <Sparkles className="w-4 h-4 text-amber-400/60" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-6">
        {/* Crown Icon with Glow */}
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
          <div 
            className="absolute inset-0 blur-xl rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)',
            }}
          />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <Crown className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <motion.div
            animate={disabled ? {} : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1"
          >
            <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
          </motion.div>
        </motion.div>

        {/* Welcome Text */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-2"
          >
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1">
              <Crown className="w-3 h-3 mr-1" />
              MASTER ADMIN
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
              SUPREME AUTHORITY
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            }}
          >
            Welcome Back, {firstName}! 👑
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mt-2 flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Your empire awaits. All systems are under your command.</span>
          </motion.p>
        </div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="text-sm text-green-400">All Systems Online</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400">Full Control Active</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MasterWelcome;
