/**
 * Role-Based Welcome Animation
 * OPTIMIZED: Reduced animations for better performance
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { 
  Bot, Sparkles, Shield, Users, Crown, Code, TrendingUp, 
  Megaphone, Search, ClipboardList, HeadphonesIcon, Star,
  Briefcase, Target, Scale, Heart, Wallet, Beaker
} from 'lucide-react';
import { useRoleSounds } from '@/hooks/useRoleSounds';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface RoleWelcomeAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  userName?: string;
  userRole?: string;
  maskedId?: string;
  isReturningUser?: boolean;
}

// Complete role configuration with unique styles
const roleConfig: Record<string, {
  color: string;
  secondaryColor: string;
  icon: typeof Bot;
  title: string;
  welcomeText: string;
  accentGradient: string;
}> = {
  // Common User
  user: {
    color: 'hsl(210, 100%, 55%)',
    secondaryColor: 'hsl(210, 100%, 70%)',
    icon: Bot,
    title: 'Member',
    welcomeText: 'Welcome back 👋',
    accentGradient: 'linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,70%))',
  },
  common: {
    color: 'hsl(210, 100%, 55%)',
    secondaryColor: 'hsl(210, 100%, 70%)',
    icon: Bot,
    title: 'Member',
    welcomeText: 'Welcome back 👋',
    accentGradient: 'linear-gradient(135deg, hsl(210,100%,55%), hsl(210,100%,70%))',
  },
  // SEO Manager - Blue/Purple
  seo: {
    color: 'hsl(260, 100%, 65%)',
    secondaryColor: 'hsl(210, 100%, 60%)',
    icon: Search,
    title: 'SEO Manager',
    welcomeText: 'SEO Manager Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(260,100%,65%), hsl(210,100%,60%))',
  },
  seo_manager: {
    color: 'hsl(260, 100%, 65%)',
    secondaryColor: 'hsl(210, 100%, 60%)',
    icon: Search,
    title: 'SEO Manager',
    welcomeText: 'SEO Manager Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(260,100%,65%), hsl(210,100%,60%))',
  },
  // Demo Manager - Green/Blue
  demo_manager: {
    color: 'hsl(142, 76%, 50%)',
    secondaryColor: 'hsl(200, 100%, 50%)',
    icon: ClipboardList,
    title: 'Demo Manager',
    welcomeText: 'Demo Control Activated',
    accentGradient: 'linear-gradient(135deg, hsl(142,76%,50%), hsl(200,100%,50%))',
  },
  // Developer - Dark/Cyan
  developer: {
    color: 'hsl(187, 100%, 50%)',
    secondaryColor: 'hsl(174, 100%, 45%)',
    icon: Code,
    title: 'Developer',
    welcomeText: 'Dev Workspace Loaded',
    accentGradient: 'linear-gradient(135deg, hsl(187,100%,50%), hsl(174,100%,45%))',
  },
  // Franchise - Gold/Blue
  franchise: {
    color: 'hsl(45, 100%, 50%)',
    secondaryColor: 'hsl(210, 100%, 55%)',
    icon: Users,
    title: 'Franchise Partner',
    welcomeText: 'Welcome Partner',
    accentGradient: 'linear-gradient(135deg, hsl(45,100%,50%), hsl(210,100%,55%))',
  },
  // Reseller - Gold/Blue
  reseller: {
    color: 'hsl(45, 100%, 50%)',
    secondaryColor: 'hsl(200, 100%, 50%)',
    icon: TrendingUp,
    title: 'Reseller Partner',
    welcomeText: 'Welcome Partner',
    accentGradient: 'linear-gradient(135deg, hsl(45,100%,50%), hsl(200,100%,50%))',
  },
  // Boss - Dark/Gold
  master_admin: {
    color: 'hsl(45, 100%, 55%)',
    secondaryColor: 'hsl(30, 100%, 50%)',
    icon: Crown,
    title: 'Boss',
    welcomeText: 'Full Control Enabled',
    accentGradient: 'linear-gradient(135deg, hsl(45,100%,55%), hsl(30,100%,50%))',
  },
  // Boss - Dark/Gold
  super_admin: {
    color: 'hsl(0, 100%, 60%)',
    secondaryColor: 'hsl(45, 100%, 50%)',
    icon: Shield,
    title: 'Boss',
    welcomeText: 'Full Control Enabled',
    accentGradient: 'linear-gradient(135deg, hsl(0,100%,60%), hsl(45,100%,50%))',
  },
  admin: {
    color: 'hsl(0, 80%, 55%)',
    secondaryColor: 'hsl(30, 100%, 50%)',
    icon: Shield,
    title: 'Admin',
    welcomeText: 'Admin Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(0,80%,55%), hsl(30,100%,50%))',
  },
  // Support
  support: {
    color: 'hsl(174, 100%, 45%)',
    secondaryColor: 'hsl(142, 76%, 50%)',
    icon: HeadphonesIcon,
    title: 'Support Agent',
    welcomeText: 'Support Dashboard Active',
    accentGradient: 'linear-gradient(135deg, hsl(174,100%,45%), hsl(142,76%,50%))',
  },
  // Influencer
  influencer: {
    color: 'hsl(330, 100%, 60%)',
    secondaryColor: 'hsl(280, 100%, 65%)',
    icon: Megaphone,
    title: 'Influencer Star',
    welcomeText: 'Creator Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(330,100%,60%), hsl(280,100%,65%))',
  },
  // Task Manager
  task_manager: {
    color: 'hsl(280, 100%, 60%)',
    secondaryColor: 'hsl(260, 100%, 65%)',
    icon: ClipboardList,
    title: 'Task Manager',
    welcomeText: 'Task Control Ready',
    accentGradient: 'linear-gradient(135deg, hsl(280,100%,60%), hsl(260,100%,65%))',
  },
  // Lead Manager
  lead_manager: {
    color: 'hsl(200, 100%, 50%)',
    secondaryColor: 'hsl(174, 100%, 45%)',
    icon: Target,
    title: 'Lead Manager',
    welcomeText: 'Lead Dashboard Active',
    accentGradient: 'linear-gradient(135deg, hsl(200,100%,50%), hsl(174,100%,45%))',
  },
  // Prime User
  prime_user: {
    color: 'hsl(45, 100%, 55%)',
    secondaryColor: 'hsl(30, 100%, 55%)',
    icon: Crown,
    title: 'Prime Member',
    welcomeText: 'Premium Access Granted',
    accentGradient: 'linear-gradient(135deg, hsl(45,100%,55%), hsl(30,100%,55%))',
  },
  prime: {
    color: 'hsl(45, 100%, 55%)',
    secondaryColor: 'hsl(30, 100%, 55%)',
    icon: Crown,
    title: 'Prime Member',
    welcomeText: 'Premium Access Granted',
    accentGradient: 'linear-gradient(135deg, hsl(45,100%,55%), hsl(30,100%,55%))',
  },
  // Finance
  finance: {
    color: 'hsl(142, 76%, 50%)',
    secondaryColor: 'hsl(120, 80%, 45%)',
    icon: Wallet,
    title: 'Finance Manager',
    welcomeText: 'Finance Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(142,76%,50%), hsl(120,80%,45%))',
  },
  // Legal
  legal: {
    color: 'hsl(220, 30%, 50%)',
    secondaryColor: 'hsl(200, 40%, 55%)',
    icon: Scale,
    title: 'Legal Advisor',
    welcomeText: 'Legal Console Active',
    accentGradient: 'linear-gradient(135deg, hsl(220,30%,50%), hsl(200,40%,55%))',
  },
  // HR
  hr: {
    color: 'hsl(330, 80%, 55%)',
    secondaryColor: 'hsl(350, 80%, 60%)',
    icon: Heart,
    title: 'HR Manager',
    welcomeText: 'HR Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(330,80%,55%), hsl(350,80%,60%))',
  },
  // R&D
  rnd: {
    color: 'hsl(260, 100%, 65%)',
    secondaryColor: 'hsl(280, 100%, 60%)',
    icon: Beaker,
    title: 'R&D Specialist',
    welcomeText: 'Lab Console Active',
    accentGradient: 'linear-gradient(135deg, hsl(260,100%,65%), hsl(280,100%,60%))',
  },
  // Client Success
  client_success: {
    color: 'hsl(174, 100%, 45%)',
    secondaryColor: 'hsl(160, 100%, 45%)',
    icon: Star,
    title: 'Client Success',
    welcomeText: 'Client Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(174,100%,45%), hsl(160,100%,45%))',
  },
  // Marketing
  marketing: {
    color: 'hsl(330, 100%, 60%)',
    secondaryColor: 'hsl(25, 95%, 55%)',
    icon: Megaphone,
    title: 'Marketing Manager',
    welcomeText: 'Marketing Console Active',
    accentGradient: 'linear-gradient(135deg, hsl(330,100%,60%), hsl(25,95%,55%))',
  },
  // Performance
  performance: {
    color: 'hsl(25, 95%, 55%)',
    secondaryColor: 'hsl(45, 100%, 50%)',
    icon: TrendingUp,
    title: 'Performance Manager',
    welcomeText: 'Performance Dashboard Ready',
    accentGradient: 'linear-gradient(135deg, hsl(25,95%,55%), hsl(45,100%,50%))',
  },
  // Default
  default: {
    color: 'hsl(210, 100%, 55%)',
    secondaryColor: 'hsl(187, 100%, 50%)',
    icon: Bot,
    title: 'Member',
    welcomeText: 'Welcome back 👋',
    accentGradient: 'linear-gradient(135deg, hsl(210,100%,55%), hsl(187,100%,50%))',
  },
};

const RoleWelcomeAnimation = ({ 
  isVisible, 
  onComplete, 
  userName = 'User', 
  userRole = 'default',
  maskedId,
  isReturningUser = false
}: RoleWelcomeAnimationProps) => {
  const [stage, setStage] = useState(0);
  const { playLoginSuccess, isMuted } = useRoleSounds(userRole);
  const { performanceMode } = useNetworkStatus();
  
  // Skip heavy animations in lite modes
  const isLiteMode = performanceMode !== 'full';
  
  const config = useMemo(() => {
    const normalizedRole = userRole.toLowerCase().replace(/[^a-z_]/g, '');
    return roleConfig[normalizedRole] || roleConfig.default;
  }, [userRole]);
  
  const IconComponent = config.icon;

  // Trigger animation stages - FASTER in lite mode
  useEffect(() => {
    if (!isVisible) {
      setStage(0);
      return;
    }

    // Play sound at start
    if (!isMuted) {
      setTimeout(() => playLoginSuccess(), 100);
    }

    // Faster animation in lite mode
    const speed = isLiteMode ? 0.5 : 1;
    const timers = [
      setTimeout(() => setStage(1), 50 * speed),
      setTimeout(() => setStage(2), 300 * speed),
      setTimeout(() => setStage(3), 600 * speed),
      setTimeout(() => setStage(4), 1000 * speed),
      setTimeout(() => onComplete(), isLiteMode ? 1200 : 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete, playLoginSuccess, isMuted, isLiteMode]);

  // Generate particles - REDUCED count for performance
  const particles = useMemo(() => 
    [...Array(isLiteMode ? 5 : 10)].map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 80,
      y: 50 + (Math.random() - 0.5) * 60,
      delay: Math.random() * 0.3,
      size: 4 + Math.random() * 4,
    })),
  [isLiteMode]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: 'hsl(222, 47%, 4%)' }}
        >
          {/* Animated Background Grid */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(${config.color}15 1px, transparent 1px),
                  linear-gradient(90deg, ${config.color}15 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
          </motion.div>

          {/* Glow backdrop */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 0.4 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
              style={{ background: `${config.color}20` }}
            />
          </motion.div>

          {/* Central Content */}
          <div className="relative z-10 text-center px-4">
            {/* Icon Container with Rings */}
            <motion.div
              className="relative mx-auto mb-8"
              style={{ width: 140, height: 140 }}
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ 
                scale: stage >= 1 ? 1 : 0, 
                rotateY: stage >= 1 ? 0 : 180 
              }}
              transition={{ duration: 0.6, type: 'spring', damping: 12 }}
            >
              {/* Outer rings */}
              {/* Simplified rings - only 1 in lite mode */}
              {[...Array(isLiteMode ? 1 : 2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                  style={{ 
                    borderColor: config.color,
                    width: `${100 + i * 35}px`,
                    height: `${100 + i * 35}px`,
                    opacity: 0.4 - i * 0.1
                  }}
                  animate={isLiteMode ? {} : { 
                    rotate: i % 2 === 0 ? 360 : -360,
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  }}
                />
              ))}
              
              {/* Core Icon Circle */}
              <motion.div
                className="relative z-10 w-24 h-24 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
                style={{ 
                  background: config.accentGradient,
                  boxShadow: `0 0 50px ${config.color}60, inset 0 0 30px ${config.secondaryColor}30`
                }}
                animate={{
                  boxShadow: [
                    `0 0 50px ${config.color}60, inset 0 0 30px ${config.secondaryColor}30`,
                    `0 0 70px ${config.color}80, inset 0 0 40px ${config.secondaryColor}50`,
                    `0 0 50px ${config.color}60, inset 0 0 30px ${config.secondaryColor}30`,
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconComponent className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
                style={{ 
                  color: config.color,
                  textShadow: `0 0 30px ${config.color}80`
                }}
              >
                {config.welcomeText}
              </motion.h1>
              
              {/* Animated underline */}
              <motion.div
                className="h-1 mx-auto rounded-full mb-6"
                style={{ background: config.accentGradient }}
                initial={{ width: 0 }}
                animate={{ width: stage >= 2 ? '60%' : 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </motion.div>

            {/* User Greeting */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: stage >= 3 ? 1 : 0, scale: stage >= 3 ? 1 : 0.9 }}
              transition={{ duration: 0.4 }}
              className="mb-4"
            >
              <p className="text-lg text-muted-foreground mb-3">
                Hello, <span className="font-semibold" style={{ color: config.color }}>{userName}</span>
              </p>
              
              {/* Role Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                style={{ 
                  borderColor: `${config.color}60`, 
                  background: `${config.color}15`,
                  boxShadow: `0 0 20px ${config.color}20`
                }}
                whileHover={{ scale: 1.02 }}
              >
                <Sparkles className="w-4 h-4" style={{ color: config.color }} />
                <span className="font-medium" style={{ color: config.color }}>{config.title}</span>
              </motion.div>
            </motion.div>

            {/* Masked ID (if provided) */}
            {maskedId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: stage >= 4 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                <span 
                  className="font-mono text-sm px-3 py-1 rounded border"
                  style={{ 
                    borderColor: `${config.color}40`,
                    background: `${config.color}10`,
                    color: `${config.color}90`
                  }}
                >
                  {maskedId}
                </span>
              </motion.div>
            )}

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {stage >= 2 && particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{ 
                    background: config.color,
                    width: particle.size,
                    height: particle.size,
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    boxShadow: `0 0 ${particle.size}px ${config.color}`
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                    y: [0, -80 - Math.random() * 60],
                    x: [(Math.random() - 0.5) * 40],
                  }}
                  transition={{ 
                    duration: 1.8,
                    delay: particle.delay,
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

export default RoleWelcomeAnimation;
