import { useState } from "react";
import { RnDTopBar } from "@/components/rnd/RnDTopBar";
import { FutureLab } from "@/components/rnd/FutureLab";
import { PrototypeBuilder } from "@/components/rnd/PrototypeBuilder";
import { ImpactAnalyzer } from "@/components/rnd/ImpactAnalyzer";
import { TrendScanner } from "@/components/rnd/TrendScanner";
import { FeedbackPortal } from "@/components/rnd/FeedbackPortal";
import { DecisionBoard } from "@/components/rnd/DecisionBoard";
import { RnDNotifications } from "@/components/rnd/RnDNotifications";
import { RnDWallet } from "@/components/rnd/RnDWallet";
import { RnDSidebar } from "@/components/rnd/RnDSidebar";
import { AIRnDAssistant } from "@/components/rnd/AIRnDAssistant";
import { AIIdeaScorer } from "@/components/rnd/AIIdeaScorer";
import { TechnologyRadar } from "@/components/rnd/TechnologyRadar";
import { InnovationPipeline } from "@/components/rnd/InnovationPipeline";
import { motion } from "framer-motion";

const RnDDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("future-lab");
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  const renderActiveSection = () => {
    switch (activeTab) {
      case "future-lab":
        return <FutureLab onSelectIdea={setSelectedIdea} />;
      case "prototype":
        return <PrototypeBuilder />;
      case "impact":
        return <ImpactAnalyzer />;
      case "trends":
        return <TrendScanner />;
      case "feedback":
        return <FeedbackPortal />;
      case "decisions":
        return <DecisionBoard />;
      case "ai-assistant":
        return <AIRnDAssistant />;
      case "idea-scorer":
        return <AIIdeaScorer />;
      case "tech-radar":
        return <TechnologyRadar />;
      case "pipeline":
        return <InnovationPipeline />;
      default:
        return <FutureLab onSelectIdea={setSelectedIdea} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950 flex">
      {/* Neural Network Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        {/* Neural connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[...Array(15)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#neural-gradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
          <defs>
            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <RnDSidebar />
    
      <main className="flex-1 flex flex-col relative z-10">
        <RnDTopBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Main Content Area */}
            <motion.div 
              className="col-span-8 h-full overflow-auto custom-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderActiveSection()}
            </motion.div>

            {/* Right Sidebar */}
            <div className="col-span-4 space-y-6 overflow-auto custom-scrollbar">
              <RnDNotifications />
              <RnDWallet />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #06b6d4);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default RnDDashboard;
