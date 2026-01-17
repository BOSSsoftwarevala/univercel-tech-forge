import { motion } from "framer-motion";
import { 
  Settings, Shield, Eye, EyeOff, FileText, Clock, Lock,
  UserCheck, AlertTriangle, RotateCcw, Zap, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SECURITY_SETTINGS = [
  { id: 'boss-only', label: 'Boss / Owner Only Access', status: 'ENFORCED', icon: Shield, description: 'Only boss-level users can access this panel' },
  { id: 'masked-keys', label: 'Masked API Credentials', status: 'ACTIVE', icon: EyeOff, description: 'All API keys and secrets are masked' },
  { id: 'audit-log', label: 'Full Audit Log', status: 'RECORDING', icon: FileText, description: 'Every action is logged with timestamp and user' },
  { id: 'rate-limit', label: 'Rate Limiting', status: 'ACTIVE', icon: Clock, description: 'API calls are rate-limited to prevent abuse' },
  { id: 'no-delete', label: 'Accidental Delete Protection', status: 'ENFORCED', icon: Lock, description: 'Critical items require confirmation to delete' },
  { id: 'role-access', label: 'Role-Based Access Control', status: 'ACTIVE', icon: UserCheck, description: 'Access controlled by user role hierarchy' },
];

const AUTOMATION_RULES = [
  { id: 'auto-stop', label: 'Auto Stop on Unpaid', status: 'ENABLED', icon: AlertTriangle, description: 'Services auto-stop when payment is overdue' },
  { id: 'auto-backup', label: 'Auto Backup', status: 'ENABLED', icon: RotateCcw, description: 'Automatic backups every 6 hours' },
  { id: 'auto-scale', label: 'Auto Scaling', status: 'ENABLED', icon: Zap, description: 'Resources scale based on demand' },
  { id: 'auto-ssl', label: 'Auto SSL Renewal', status: 'ENABLED', icon: Lock, description: 'SSL certificates auto-renew before expiry' },
];

const GLOBAL_RULES = [
  { label: '4 Actions Only', description: 'ADD • DELETE • RUN/STOP • PAY/UNPAY' },
  { label: 'Boss Approval Required', description: 'Live deploy, cost increase, server changes' },
  { label: 'AI First', description: 'All automation is AI-driven' },
  { label: 'Zero Manual Work', description: 'System handles everything automatically' },
  { label: 'One Place Only', description: 'All controls unified in this dashboard' },
];

export const UnifiedSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            System Settings
          </h1>
          <p className="text-muted-foreground">Read-only configuration - All rules are enforced automatically</p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <Lock className="w-3 h-3 mr-1" />
          READ ONLY
        </Badge>
      </div>

      {/* Global Rules */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Global System Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {GLOBAL_RULES.map((rule, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/50 border border-orange-500/20">
                <p className="text-sm font-medium text-white mb-1">{rule.label}</p>
                <p className="text-xs text-muted-foreground">{rule.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Security & Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {SECURITY_SETTINGS.map((setting) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <setting.icon className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-white">{setting.label}</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {setting.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Automation Rules (AI Managed)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {AUTOMATION_RULES.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <rule.icon className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-white">{rule.label}</span>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400">
                    {rule.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rule.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Power Statement */}
      <Card className="bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-orange-500/10 border-violet-500/30">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">UNIFIED CONTROL SYSTEM</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Everything visible • Very easy UI • Only 4 buttons • All processes automatic
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 px-4 py-2">
              No Feature Missing
            </Badge>
            <Badge className="bg-violet-500/20 text-violet-400 px-4 py-2">
              Better Than Lovable
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 px-4 py-2">
              System Locked
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
