import { motion } from "framer-motion";
import { 
  Settings, Shield, AlertTriangle, Eye, EyeOff, Lock,
  Bell, Zap, Clock, RefreshCw, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const AUTOMATION_RULES = [
  { id: 'auto-stop-unpaid', label: 'Auto-STOP if unpaid > 7 days', enabled: true, critical: true },
  { id: 'auto-alert-limit', label: 'Alert Boss if limit crossed', enabled: true, critical: true },
  { id: 'auto-stop-idle', label: 'Recommend STOP if idle > 14 days', enabled: true, critical: false },
  { id: 'auto-block-delete', label: 'Block DELETE for critical services', enabled: true, critical: true },
  { id: 'auto-rollback', label: 'Enable one-click rollback', enabled: true, critical: false },
];

const SECURITY_SETTINGS = [
  { id: 'boss-only', label: 'Boss-only access', status: 'enforced', icon: Shield },
  { id: 'masked-keys', label: 'Masked API credentials', status: 'active', icon: EyeOff },
  { id: 'audit-log', label: 'Audit log enabled', status: 'recording', icon: FileText },
  { id: 'rate-limit', label: 'Rate limiting', status: 'active', icon: Clock },
];

export const AIAPISettingsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">Read-only automation rules & security</p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/50">
          <Lock className="w-3 h-3 mr-1" />
          Read-Only
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Automation Rules */}
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              Automation Rules (Background)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AUTOMATION_RULES.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                <div className="flex items-center gap-3">
                  {rule.critical && (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-sm text-white">{rule.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "text-[10px]",
                    rule.enabled 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50" 
                      : "bg-slate-500/10 text-slate-400 border-slate-500/50"
                  )}>
                    {rule.enabled ? 'ACTIVE' : 'OFF'}
                  </Badge>
                  <Switch checked={rule.enabled} disabled className="opacity-50" />
                </div>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground text-center pt-2">
              Rules are managed by system. Changes require Super Admin approval.
            </p>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              Security & Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SECURITY_SETTINGS.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                <div className="flex items-center gap-3">
                  <setting.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-white">{setting.label}</span>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/50 text-[10px]">
                  {setting.status.toUpperCase()}
                </Badge>
              </div>
            ))}

            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-red-400" />
                  <div>
                    <span className="text-sm text-white">One-Click Rollback</span>
                    <p className="text-[10px] text-muted-foreground">Restore previous state instantly</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/50 text-[10px]">
                  READY
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 Actions Rule Summary */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-orange-400 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            4 Actions Rule (Global)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/10">
              <p className="text-2xl font-bold text-emerald-400">ADD</p>
              <p className="text-[10px] text-muted-foreground mt-1">Add new service</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/10">
              <p className="text-2xl font-bold text-red-400">DELETE</p>
              <p className="text-[10px] text-muted-foreground mt-1">Remove service</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/10">
              <p className="text-2xl font-bold text-amber-400">RUN/STOP</p>
              <p className="text-[10px] text-muted-foreground mt-1">Toggle status</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/10">
              <p className="text-2xl font-bold text-blue-400">PAY/UNPAY</p>
              <p className="text-[10px] text-muted-foreground mt-1">Toggle payment</p>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            No other buttons allowed. User sees only these 4 actions.
          </p>
        </CardContent>
      </Card>

      {/* Experience Summary */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-violet-400">Final Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3 text-center">
            <div className="p-3 rounded-lg bg-muted/10">
              <p className="text-lg font-bold text-white">Powerful</p>
              <p className="text-[10px] text-muted-foreground">Full control</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/10">
              <p className="text-lg font-bold text-white">Minimal</p>
              <p className="text-[10px] text-muted-foreground">4 actions only</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/10">
              <p className="text-lg font-bold text-white">Fast</p>
              <p className="text-[10px] text-muted-foreground">Instant response</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/10">
              <p className="text-lg font-bold text-white">Safe</p>
              <p className="text-[10px] text-muted-foreground">Boss approval</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/10">
              <p className="text-lg font-bold text-emerald-400">Better</p>
              <p className="text-[10px] text-muted-foreground">Enterprise Grade</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
