import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Crown, Star, Shield, Sparkles, Zap, Clock, CheckCircle, 
  Users, Heart, TrendingUp, MessageSquare, Headphones,
  AlertTriangle, Target, Bell, Gift
} from "lucide-react";
import PrimeUserSidebar from "@/components/prime-user/PrimeUserSidebar";
import PrimeUserTopBar from "@/components/prime-user/PrimeUserTopBar";
import LiveTaskTimer from "@/components/prime-user/LiveTaskTimer";
import PriorityQueuePosition from "@/components/prime-user/PriorityQueuePosition";
import ProjectMilestones from "@/components/prime-user/ProjectMilestones";
import AccountManagerChat from "@/components/prime-user/AccountManagerChat";
import DocumentTracker from "@/components/prime-user/DocumentTracker";
import WalletHistory from "@/components/prime-user/WalletHistory";
import BugChangeTracker from "@/components/prime-user/BugChangeTracker";
import DownloadArea from "@/components/prime-user/DownloadArea";
import PrimeNotifications from "@/components/prime-user/PrimeNotifications";
import PriorityTicketPanel from "@/components/prime-user/PriorityTicketPanel";
import PriorityDevConsole from "@/components/prime-user/PriorityDevConsole";
import MaskedDevChat from "@/components/prime-user/MaskedDevChat";
import PremiumSupportCenter from "@/components/prime-user/PremiumSupportCenter";
import FeatureRequestBoard from "@/components/prime-user/FeatureRequestBoard";
import VIPDemoAccess from "@/components/prime-user/VIPDemoAccess";
import AIRequirementInterpreter from "@/components/prime-user/AIRequirementInterpreter";
import TrainingHub from "@/components/prime-user/TrainingHub";
import EmergencyChannel from "@/components/prime-user/EmergencyChannel";
import UsageAnalytics from "@/components/prime-user/UsageAnalytics";
import AnnouncementFeed from "@/components/prime-user/AnnouncementFeed";
import SLATimerPanel from "@/components/prime-user/SLATimerPanel";
import PrimeHostingStatus from "@/components/prime-user/PrimeHostingStatus";
import PrimeSubscriptionPanel from "@/components/prime-user/PrimeSubscriptionPanel";
import UrgentHelpButton from "@/components/prime-user/UrgentHelpButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

// Premium Welcome Animation Component
const PrimeWelcomeAnimation = ({ onComplete, userName }: { onComplete: () => void; userName: string }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/30 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Confetti Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f59e0b' : '#d97706',
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '110vh', 
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: Math.random() * 1,
            ease: 'linear'
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        {/* VIP Crown Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative mx-auto w-36 h-36">
            {/* Glow rings */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ 
                background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
              }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Main badge */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 40px rgba(251,191,36,0.4), 0 0 80px rgba(251,191,36,0.2)',
                  '0 0 60px rgba(251,191,36,0.6), 0 0 120px rgba(251,191,36,0.3)',
                  '0 0 40px rgba(251,191,36,0.4), 0 0 80px rgba(251,191,36,0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-stone-900 to-stone-800 flex items-center justify-center border-4 border-amber-400/50">
                <Crown className="w-14 h-14 text-amber-400" />
              </div>
            </motion.div>

            {/* Floating stars */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0.8],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  delay: 0.5 + i * 0.15,
                  duration: 0.5,
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 80}%`,
                  top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 80}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              </motion.div>
            ))}

            {/* VIP Badge */}
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2"
            >
              <Badge className="px-6 py-2 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-white border-2 border-cyan-300/50 shadow-lg shadow-cyan-500/30 text-lg font-bold">
                VIP PRIME
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-bold mb-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Welcome, {userName}!
          </motion.h1>
          <p className="text-xl text-amber-500/80 mb-6">
            Your Prime Experience Awaits
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Priority Access</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium">Fast-Track Support</span>
            </div>
          </motion.div>
        </motion.div>
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
  );
};

const PrimeUserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [showWelcome, setShowWelcome] = useState(true);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Prime User';

  // Quick stats for overview
  const quickStats = [
    { label: 'Active Projects', value: '3', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg Response', value: '15m', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Satisfaction', value: '98%', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Dedicated Dev', value: 'DEV***08', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Support Tier', value: 'VIP', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-r from-amber-500/10 via-stone-900/50 to-amber-600/10 border-amber-500/20 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Crown className="w-8 h-8 text-stone-900" />
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-amber-100">Welcome back, {userName}!</h2>
                          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900">
                            VIP PRIME
                          </Badge>
                        </div>
                        <p className="text-stone-400">Your dedicated development team is ready to serve you.</p>
                      </div>
                    </div>
                    <div className="hidden md:flex gap-3">
                      <Button 
                        onClick={() => setActiveSection('emergency')}
                        variant="outline" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency
                      </Button>
                      <Button 
                        onClick={() => setActiveSection('support')}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500"
                      >
                        <Headphones className="w-4 h-4 mr-2" />
                        Priority Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-stone-900/50 border-amber-500/10 hover:border-amber-500/30 transition-all">
                    <CardContent className="p-4 text-center">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <p className="text-xl font-bold text-amber-100">{stat.value}</p>
                      <p className="text-xs text-stone-500">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><LiveTaskTimer /></div>
              <PriorityQueuePosition />
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: MessageSquare, label: 'Chat with Dev', section: 'dev-chat', color: 'text-cyan-400 bg-cyan-500/10' },
                { icon: Target, label: 'View Milestones', section: 'milestones', color: 'text-emerald-400 bg-emerald-500/10' },
                { icon: Bell, label: 'Announcements', section: 'announcements', color: 'text-purple-400 bg-purple-500/10' },
                { icon: Gift, label: 'Subscription', section: 'store', color: 'text-amber-400 bg-amber-500/10' },
              ].map((action) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection(action.section)}
                    className={`w-full h-20 flex-col gap-2 border-amber-500/20 hover:border-amber-500/40 ${action.color}`}
                  >
                    <action.icon className="w-6 h-6" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
            
            <ProjectMilestones />
          </div>
        );
      case "tickets": return <PriorityTicketPanel />;
      case "dev-console": return <PriorityDevConsole />;
      case "dev-chat": return <MaskedDevChat />;
      case "support": return <PremiumSupportCenter />;
      case "features": return <FeatureRequestBoard />;
      case "demos": return <VIPDemoAccess />;
      case "uptime": return <PrimeHostingStatus />;
      case "ai-interpreter": return <AIRequirementInterpreter />;
      case "training": return <TrainingHub />;
      case "emergency": return <EmergencyChannel />;
      case "analytics": return <UsageAnalytics />;
      case "announcements": return <AnnouncementFeed />;
      case "store": return <PrimeSubscriptionPanel />;
      case "milestones": return <ProjectMilestones />;
      case "chat": return <AccountManagerChat />;
      case "documents": return <DocumentTracker />;
      case "wallet": return <WalletHistory />;
      case "bugs": return <BugChangeTracker />;
      case "downloads": return <DownloadArea />;
      case "sla": return <SLATimerPanel />;
      default: return <PriorityTicketPanel />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <PrimeWelcomeAnimation 
            onComplete={() => setShowWelcome(false)} 
            userName={userName}
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showWelcome ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/20 flex"
      >
        <PrimeUserSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col">
          <PrimeUserTopBar />
          <main className="flex-1 p-6 overflow-auto">
            <motion.div 
              key={activeSection} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
        <PrimeNotifications />
        <UrgentHelpButton />
      </motion.div>
    </>
  );
};

export default PrimeUserDashboard;