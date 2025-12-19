import { motion } from "framer-motion";
import { 
  Scale, 
  LayoutDashboard, 
  Globe,
  FileSignature,
  Shield,
  Gavel,
  Search,
  MapPin,
  Lock,
  MessageSquare,
  Database,
  AlertTriangle,
  Sparkles
} from "lucide-react";

interface LegalSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const LegalSidebar = ({ activeSection, setActiveSection }: LegalSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "global-compliance", label: "Global Compliance", icon: Globe },
    { id: "contract-automation", label: "Contract Automation", icon: FileSignature },
    { id: "data-privacy", label: "Data Privacy Control", icon: Shield },
    { id: "dispute-hub", label: "Dispute Resolution", icon: Gavel },
    { id: "audit-lab", label: "Audit & Investigation", icon: Search },
    { id: "risk-heatmap", label: "Risk Heatmap", icon: MapPin },
    { id: "ip-protection", label: "IP & Code Shield", icon: Lock },
    { id: "evidence-vault", label: "Evidence Vault", icon: Database },
    { id: "regulatory-api", label: "Regulatory APIs", icon: Globe },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
    { id: "audit-logs", label: "Audit Logs", icon: AlertTriangle },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-cyan-900/30 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-cyan-900/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-900/50">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Legal & Compliance</h1>
            <p className="text-xs text-cyan-500/70">Global SaaS Compliance</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <motion.div 
          className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
          animate={{ boxShadow: ["0 0 15px rgba(16,185,129,0.1)", "0 0 25px rgba(16,185,129,0.2)", "0 0 15px rgba(16,185,129,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Compliance Active • 94%</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-600/20 to-cyan-700/10 text-cyan-400 border border-cyan-600/30"
                  : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-cyan-500" : ""}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="legalActiveIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-cyan-500"
                  initial={false}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* One-Domain Enforcement */}
      <div className="p-4 border-t border-cyan-900/30">
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400 font-medium">One-Domain Activation</span>
          </div>
          <p className="text-xs text-slate-500">Enforced on all licenses</p>
        </div>
      </div>
    </motion.aside>
  );
};

export default LegalSidebar;