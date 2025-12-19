import { useState } from "react";
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
import { motion } from "framer-motion";

const ClientSuccessDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("health");

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
      default:
        return <ClientHealthDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex">
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

      <ClientSuccessSidebar />
      
      <main className="flex-1 flex flex-col relative z-10">
        <ClientSuccessTopBar activeTab={activeTab} onTabChange={setActiveTab} />
        
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
