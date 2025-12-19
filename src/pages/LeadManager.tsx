import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, Wallet, Bell, User, Zap, Brain, BellRing,
  Globe, Target, Timer, AlertTriangle, Shield, Activity, Plus
} from "lucide-react";
import LeadManagerTopBar from "@/components/leads/LeadManagerTopBar";
import LeadPipeline from "@/components/leads/LeadPipeline";
import LeadDetails from "@/components/leads/LeadDetails";
import AIActionPanel from "@/components/leads/AIActionPanel";
import LeadNotifications from "@/components/leads/LeadNotifications";
import LeadReports from "@/components/leads/LeadReports";
import LeadWalletPanel from "@/components/leads/LeadWalletPanel";
import LeadCaptureHub from "@/components/leads/LeadCaptureHub";
import LeadQualificationEngine from "@/components/leads/LeadQualificationEngine";
import LeadBuzzerAlert from "@/components/leads/LeadBuzzerAlert";
import TerritoryRegionMap from "@/components/leads/TerritoryRegionMap";
import LeadScoringPrediction from "@/components/leads/LeadScoringPrediction";
import FollowUpAutomation from "@/components/leads/FollowUpAutomation";
import LeadEscalationPanel from "@/components/leads/LeadEscalationPanel";
import LeadCompliancePolicy from "@/components/leads/LeadCompliancePolicy";
import LeadBehaviorTracking from "@/components/leads/LeadBehaviorTracking";

export interface Lead {
  id: string;
  name: string;
  maskedContact: string;
  email: string;
  software: string;
  status: "new" | "contacted" | "demo" | "negotiation" | "won" | "lost";
  source: string;
  region: string;
  assignedTo: string;
  assignedRole: string;
  lastAction: string;
  lastActionTime: string;
  urgencyScore: number;
  notes: string[];
  createdAt: string;
  qualityScore: number;
}

const LeadManager = () => {
  const [activeSection, setActiveSection] = useState("pipeline");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showCaptureHub, setShowCaptureHub] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", message: "New lead added. AI is reviewing interest category.", type: "info", time: "14 sec ago" },
    { id: "2", message: "Moved to DEMO SHOWN by vala(sales)4771", type: "success", time: "2 min ago" },
  ]);

  const sidebarItems = [
    { id: "pipeline", label: "Lead Pipeline", icon: Users },
    { id: "qualification", label: "AI Qualification", icon: Brain },
    { id: "buzzer", label: "Buzzer Alerts", icon: BellRing },
    { id: "territory", label: "Territory Map", icon: Globe },
    { id: "scoring", label: "Lead Scoring", icon: Target },
    { id: "followup", label: "Follow-ups", icon: Timer },
    { id: "escalation", label: "Escalation", icon: AlertTriangle },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "behavior", label: "Behavior", icon: Activity },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case "pipeline": return <LeadPipeline onSelectLead={setSelectedLead} selectedLead={selectedLead} />;
      case "qualification": return <LeadQualificationEngine />;
      case "buzzer": return <LeadBuzzerAlert />;
      case "territory": return <TerritoryRegionMap />;
      case "scoring": return <LeadScoringPrediction />;
      case "followup": return <FollowUpAutomation />;
      case "escalation": return <LeadEscalationPanel />;
      case "compliance": return <LeadCompliancePolicy />;
      case "behavior": return <LeadBehaviorTracking />;
      case "reports": return <LeadReports />;
      case "wallet": return <LeadWalletPanel />;
      default: return <LeadPipeline onSelectLead={setSelectedLead} selectedLead={selectedLead} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>

      <LeadManagerTopBar onAIClick={() => setShowAIPanel(true)} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900/60 backdrop-blur-xl border-r border-indigo-500/20 z-40 overflow-y-auto">
          <div className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 text-indigo-300"
                    : "hover:bg-slate-800/50 text-slate-400 hover:text-indigo-300"
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={`w-4 h-4 ${activeSection === item.id ? "text-indigo-400" : "group-hover:text-indigo-400"}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div layoutId="activeSidebarIndicator" className="absolute left-0 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full" />
                )}
              </motion.button>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCaptureHub(true)} className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
              <Plus className="w-4 h-4" />
              Add Lead
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-auto">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            {renderContent()}
          </motion.div>
        </main>

        <AnimatePresence>
          {selectedLead && <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />}
        </AnimatePresence>

        <AIActionPanel isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} lead={selectedLead} />
        <LeadCaptureHub isOpen={showCaptureHub} onClose={() => setShowCaptureHub(false)} />
        <LeadNotifications notifications={notifications} onDismiss={dismissNotification} />
      </div>
    </div>
  );
};

export default LeadManager;
