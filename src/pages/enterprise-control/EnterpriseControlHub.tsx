import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  LogOut, 
  Clock,
  Lock,
  Users,
  Globe,
  Brain,
  Crown
} from "lucide-react";
import { EnterpriseControlProvider, useEnterpriseControl, ValaRole } from "@/contexts/EnterpriseControlContext";
import OperationWorkspace from "@/components/enterprise-control/OperationWorkspace";
import RegionalWorkspace from "@/components/enterprise-control/RegionalWorkspace";
import AIHeadWorkspace from "@/components/enterprise-control/AIHeadWorkspace";
import MasterAdminWorkspace from "@/components/enterprise-control/MasterAdminWorkspace";
import { toast } from "@/hooks/use-toast";

const RoleSelector = ({ onSelect }: { onSelect: (role: ValaRole) => void }) => {
  const roles: { id: ValaRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "operation", label: "FRONT / OPERATION", icon: <Users className="h-6 w-6" />, color: "emerald" },
    { id: "regional", label: "AREA / REGIONAL", icon: <Globe className="h-6 w-6" />, color: "blue" },
    { id: "ai_head", label: "AI HEAD", icon: <Brain className="h-6 w-6" />, color: "pink" },
    { id: "master_admin", label: "BOSS", icon: <Crown className="h-6 w-6" />, color: "amber" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-emerald-400" />
            <h1 className="text-2xl font-bold text-slate-100">ENTERPRISE CONTROL SYSTEM</h1>
          </div>
          <p className="text-sm text-slate-400">Select your role to access isolated workspace</p>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 text-center">
            ⚠️ One person = One role only • All roles isolated • No cross-role visibility
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-4">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(role.id)}
              className={`p-6 rounded-lg border transition-all hover:scale-[1.02] ${
                role.color === "emerald" ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20" :
                role.color === "blue" ? "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20" :
                role.color === "pink" ? "bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20" :
                "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <div className={`mb-3 ${
                role.color === "emerald" ? "text-emerald-400" :
                role.color === "blue" ? "text-blue-400" :
                role.color === "pink" ? "text-pink-400" :
                "text-amber-400"
              }`}>
                {role.icon}
              </div>
              <p className="text-sm font-medium text-slate-200">{role.label}</p>
            </motion.button>
          ))}
        </div>

        {/* System Info */}
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-slate-400">
            <div>
              <Lock className="h-4 w-4 mx-auto mb-1 text-slate-500" />
              Append-Only Logs
            </div>
            <div>
              <Shield className="h-4 w-4 mx-auto mb-1 text-slate-500" />
              CNS Checksum
            </div>
            <div>
              <Clock className="h-4 w-4 mx-auto mb-1 text-slate-500" />
              Session Limited
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlDashboard = () => {
  const navigate = useNavigate();
  const { currentRole, valaId, logout, getRemainingSessionTime, isFrozen } = useEnterpriseControl();
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(getRemainingSessionTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [getRemainingSessionTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/enterprise-control");
    toast({ title: "Session Ended", description: "All data cleared." });
  };

  const renderWorkspace = () => {
    switch (currentRole) {
      case "operation": return <OperationWorkspace />;
      case "regional": return <RegionalWorkspace />;
      case "ai_head": return <AIHeadWorkspace />;
      case "master_admin": return <MasterAdminWorkspace />;
      default: 
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-slate-700/50 max-w-md">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-100 mb-2">Select a Workspace</h2>
              <p className="text-muted-foreground">Choose a role workspace from the options above to get started.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Top Bar */}
      <header className="p-3 border-b border-slate-800 bg-slate-900/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-400 font-mono">VALA ID: {valaId}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Session Timer */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded ${
              remainingTime < 300 ? "bg-red-500/20" : "bg-slate-800"
            }`}>
              <Clock className={`h-4 w-4 ${remainingTime < 300 ? "text-red-400" : "text-slate-400"}`} />
              <span className={`text-sm font-mono ${remainingTime < 300 ? "text-red-400" : "text-slate-300"}`}>
                {formatTime(remainingTime)}
              </span>
            </div>

            {isFrozen && (
              <Badge className="bg-red-500/20 text-red-400 animate-pulse">
                FROZEN
              </Badge>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-1" />
              END SESSION
            </Button>
          </div>
        </div>
      </header>

      {/* Security Banner */}
      <div className="px-4 py-1.5 bg-slate-800/50 border-b border-slate-700 text-center">
        <p className="text-[10px] text-slate-500">
          🔒 SECURE MODE • Clipboard/Screenshot Blocked • No Edit After Submit • Append-Only Logs • Checksum Verified
        </p>
      </div>

      {/* Workspace */}
      <main className="flex-1 relative">
        {renderWorkspace()}
      </main>

      {/* Footer */}
      <footer className="px-4 py-2 border-t border-slate-800 bg-slate-900/95">
        <div className="flex items-center justify-between text-[10px] text-slate-600">
          <span>ENTERPRISE CONTROL v1.0</span>
          <span>FLOW: Action → Debug → Check → Lock → Forward → Master</span>
          <span>All actions hashed & logged</span>
        </div>
      </footer>
    </div>
  );
};

const EnterpriseControlHub = () => {
  const [selectedRole, setSelectedRole] = useState<ValaRole | null>(null);

  if (!selectedRole) {
    return <RoleSelector onSelect={setSelectedRole} />;
  }

  return (
    <EnterpriseControlProvider>
      <ControlDashboardWrapper selectedRole={selectedRole} />
    </EnterpriseControlProvider>
  );
};

const ControlDashboardWrapper = ({ selectedRole }: { selectedRole: ValaRole }) => {
  const { authenticateRole } = useEnterpriseControl();

  useEffect(() => {
    authenticateRole(selectedRole);
  }, [selectedRole, authenticateRole]);

  return <ControlDashboard />;
};

export default EnterpriseControlHub;
