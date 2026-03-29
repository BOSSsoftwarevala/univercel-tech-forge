import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Crown, Sparkles } from "lucide-react";
import { ClientSuccessSidebar } from "@/components/client-success/ClientSuccessSidebar";
import { ClientSuccessTopBar } from "@/components/client-success/ClientSuccessTopBar";
import { ClientHealthDashboard } from "@/components/client-success/ClientHealthDashboard";
import { OnboardingTracker } from "@/components/client-success/OnboardingTracker";
import { SentimentAnalyzer } from "@/components/client-success/SentimentAnalyzer";
import { EscalationEngine } from "@/components/client-success/EscalationEngine";
import { FeedbackCollector } from "@/components/client-success/FeedbackCollector";
import { SuccessPlaybook } from "@/components/client-success/SuccessPlaybook";
import { ChurnPrevention } from "@/components/client-success/ChurnPrevention";
import { NPSScoreboard } from "@/components/client-success/NPSScoreboard";
import { ClientSuccessNotifications } from "@/components/client-success/ClientSuccessNotifications";
import { KYCManager } from "@/components/client-success/KYCManager";
import { AutoInterview } from "@/components/client-success/AutoInterview";
import { AIClientAssistant } from "@/components/client-success/AIClientAssistant";
import { ClientInsights } from "@/components/client-success/ClientInsights";
import { useAuth } from "@/hooks/useAuth";
import { RoleBadge } from "@/components/ui/RoleBadge";

const ClientSuccessDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("health");
  const [showWelcome, setShowWelcome] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.email?.split('@')[0] || 'Manager';

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderActiveSection = () => {
    switch (activeTab) {
      case "health":
        return <ClientHealthDashboard />;
      case "onboarding":
        return <OnboardingTracker />;
      case "sentiment":
        return <SentimentAnalyzer />;
      case "escalation":
        return <EscalationEngine />;
      case "feedback":
        return <FeedbackCollector />;
      case "playbook":
        return <SuccessPlaybook />;
      case "churn":
        return <ChurnPrevention />;
      case "nps":
        return <NPSScoreboard />;
      case "kyc":
        return <KYCManager />;
      case "interview":
        return <AutoInterview />;
      case "ai-assistant":
        return <AIClientAssistant />;
      case "insights":
        return <ClientInsights />;
      default:
        return <ClientHealthDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex">
      {/* Welcome Animation Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-600 via-teal-500 to-amber-500"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Animated Heart Icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm"
              >
                <Heart className="w-12 h-12 text-white" fill="white" />
              </motion.div>

              {/* Welcome Text */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Welcome, {userName}!
              </motion.h1>

              {/* Role Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Client Success Manager
                </span>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white/80 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Empowering client success with empathy
                <Sparkles className="w-4 h-4" />
              </motion.p>

              {/* Loading dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex items-center justify-center gap-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/10 to-teal-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-200/10 to-amber-200/10 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <ClientSuccessSidebar userName={userName} />
      
      <main className="flex-1 flex flex-col relative z-10">
        <ClientSuccessTopBar activeTab={activeTab} onTabChange={setActiveTab} userName={userName} />
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Main Content Area */}
            <motion.div 
              className="col-span-9 h-full overflow-auto custom-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderActiveSection()}
            </motion.div>

            {/* Right Sidebar */}
            <div className="col-span-3 overflow-auto custom-scrollbar">
              <ClientSuccessNotifications />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(20, 184, 166, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #14b8a6, #d4a574);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ClientSuccessDashboard;
