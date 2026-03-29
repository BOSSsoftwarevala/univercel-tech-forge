import { useState } from "react";
import { PerformanceSidebar } from "@/components/performance/PerformanceSidebar";
import { PerformanceTopBar } from "@/components/performance/PerformanceTopBar";
import { UniversalPerformanceIndex } from "@/components/performance/UniversalPerformanceIndex";
import { RoleBasedPanels } from "@/components/performance/RoleBasedPanels";
import { PerformanceHeatmap } from "@/components/performance/PerformanceHeatmap";
import { RiskDetector } from "@/components/performance/RiskDetector";
import { IncentiveEngine } from "@/components/performance/IncentiveEngine";
import { ComparisonMatrix } from "@/components/performance/ComparisonMatrix";
import { PerformanceNotifications } from "@/components/performance/PerformanceNotifications";
import AIPerformanceCoach from "@/components/performance/AIPerformanceCoach";
import { motion } from "framer-motion";

const PerformanceManager = () => {
  const [activeTab, setActiveTab] = useState<string>("upi");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const renderActiveSection = () => {
    switch (activeTab) {
      case "upi":
        return <UniversalPerformanceIndex />;
      case "roles":
        return <RoleBasedPanels selectedRole={selectedRole} onRoleChange={setSelectedRole} />;
      case "heatmap":
        return <PerformanceHeatmap />;
      case "risk":
        return <RiskDetector />;
      case "incentives":
        return <IncentiveEngine />;
      case "compare":
        return <ComparisonMatrix />;
      case "ai-coach":
        return <AIPerformanceCoach />;
      default:
        return <UniversalPerformanceIndex />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Immersive Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />
        
        {/* Corner Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        
        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Scanning Line Effect */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <PerformanceSidebar />
      
      <main className="flex-1 flex flex-col relative z-10">
        <PerformanceTopBar activeTab={activeTab} onTabChange={setActiveTab} />
        
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
              <PerformanceNotifications />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #10b981);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default PerformanceManager;
