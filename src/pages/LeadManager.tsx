import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, Wallet, ClipboardList, Bell, 
  User, ChevronRight, Zap
} from "lucide-react";
import LeadManagerTopBar from "@/components/leads/LeadManagerTopBar";
import LeadPipeline from "@/components/leads/LeadPipeline";
import LeadDetails from "@/components/leads/LeadDetails";
import AIActionPanel from "@/components/leads/AIActionPanel";
import LeadNotifications from "@/components/leads/LeadNotifications";
import LeadReports from "@/components/leads/LeadReports";
import LeadWalletPanel from "@/components/leads/LeadWalletPanel";

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
  const [notifications, setNotifications] = useState<Array<{id: string; message: string; type: string; time: string}>>([
    { id: "1", message: "New lead added. AI is reviewing interest category.", type: "info", time: "14 sec ago" },
    { id: "2", message: "Moved to DEMO SHOWN by vala(sales)4771", type: "success", time: "2 min ago" },
  ]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pipeline", label: "Lead Manager", icon: Users },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "tasks", label: "Tasks", icon: ClipboardList },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "reports", label: "Reports", icon: ChevronRight },
    { id: "profile", label: "Profile", icon: User },
  ];

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case "pipeline":
        return (
          <LeadPipeline 
            onSelectLead={setSelectedLead} 
            selectedLead={selectedLead}
          />
        );
      case "reports":
        return <LeadReports />;
      case "wallet":
        return <LeadWalletPanel />;
      default:
        return (
          <LeadPipeline 
            onSelectLead={setSelectedLead} 
            selectedLead={selectedLead}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Glow Effects */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <LeadManagerTopBar onAIClick={() => setShowAIPanel(true)} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900/60 backdrop-blur-xl border-r border-indigo-500/20 z-40"
        >
          <div className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 text-indigo-300"
                    : "hover:bg-slate-800/50 text-slate-400 hover:text-indigo-300"
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={`w-5 h-5 ${
                  activeSection === item.id ? "text-indigo-400" : "group-hover:text-indigo-400"
                }`} />
                <span className="text-sm font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Quick Action */}
          <div className="absolute bottom-4 left-4 right-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Zap className="w-4 h-4" />
              Quick Add Lead
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </main>

        {/* Lead Details Panel */}
        <AnimatePresence>
          {selectedLead && (
            <LeadDetails 
              lead={selectedLead} 
              onClose={() => setSelectedLead(null)} 
            />
          )}
        </AnimatePresence>

        {/* AI Action Panel */}
        <AIActionPanel 
          isOpen={showAIPanel} 
          onClose={() => setShowAIPanel(false)}
          lead={selectedLead}
        />

        {/* Notifications */}
        <LeadNotifications 
          notifications={notifications}
          onDismiss={dismissNotification}
        />
      </div>
    </div>
  );
};

export default LeadManager;
