import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  FileSignature, 
  Shield, 
  CheckSquare, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  BookOpen,
  LogOut,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Import screens
import LegalOverview from "./screens/LegalOverview";
import LegalPoliciesTerms from "./screens/LegalPoliciesTerms";
import LegalContracts from "./screens/LegalContracts";
import LegalTrademarksIP from "./screens/LegalTrademarksIP";
import LegalComplianceChecklist from "./screens/LegalComplianceChecklist";
import LegalRequests from "./screens/LegalRequests";
import LegalIncidentsDisputes from "./screens/LegalIncidentsDisputes";
import LegalApprovals from "./screens/LegalApprovals";
import LegalReports from "./screens/LegalReports";
import LegalAudit from "./screens/LegalAudit";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "policies", label: "Policies & Terms", icon: FileText },
  { id: "contracts", label: "Contracts", icon: FileSignature },
  { id: "trademarks", label: "Trademarks & IP", icon: Shield },
  { id: "compliance", label: "Compliance Checklist", icon: CheckSquare },
  { id: "requests", label: "Legal Requests", icon: MessageSquare },
  { id: "incidents", label: "Incidents & Disputes", icon: AlertTriangle },
  { id: "approvals", label: "Approvals", icon: CheckCircle },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "audit", label: "Audit", icon: BookOpen },
];

const LegalManagerDashboard = () => {
  const [activeScreen, setActiveScreen] = useState("overview");
  const [complianceStatus, setComplianceStatus] = useState<"Clear" | "Warning" | "Critical">("Clear");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    // Prevent copy/paste
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copy/Paste is disabled for security");
    };
    
    // Prevent screenshot (basic)
    const preventScreenshot = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || (e.metaKey && e.shiftKey && e.key === "4")) {
        e.preventDefault();
        toast.error("Screenshots are disabled for security");
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("keydown", preventScreenshot);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("keydown", preventScreenshot);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "overview": return <LegalOverview />;
      case "policies": return <LegalPoliciesTerms />;
      case "contracts": return <LegalContracts />;
      case "trademarks": return <LegalTrademarksIP />;
      case "compliance": return <LegalComplianceChecklist />;
      case "requests": return <LegalRequests />;
      case "incidents": return <LegalIncidentsDisputes />;
      case "approvals": return <LegalApprovals />;
      case "reports": return <LegalReports />;
      case "audit": return <LegalAudit />;
      default: return <LegalOverview />;
    }
  };

  const getStatusColor = () => {
    switch (complianceStatus) {
      case "Clear": return "text-emerald-400 bg-emerald-500/20";
      case "Warning": return "text-yellow-400 bg-yellow-500/20";
      case "Critical": return "text-red-400 bg-red-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 flex select-none">
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-700/50 flex flex-col fixed h-full">
        <div className="p-4 border-b border-slate-700/50">
          <h1 className="text-lg font-bold text-amber-400">Legal Manager</h1>
          <p className="text-xs text-slate-500">Compliance Center</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeScreen === item.id
                  ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Secure Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Fixed Top Header */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-700/50 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
          <h2 className="text-lg font-semibold text-white">
            Legal Manager — Compliance Center
          </h2>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusColor()}`}>
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Compliance Status: {complianceStatus}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16 overflow-auto">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LegalManagerDashboard;
