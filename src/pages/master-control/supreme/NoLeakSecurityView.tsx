import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ShieldOff, Copy, Clipboard, Camera, Mail, Download,
  Lock, CheckCircle, AlertTriangle, Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: any;
  severity: 'critical' | 'high' | 'medium';
}

const NoLeakSecurityView = () => {
  const { user } = useAuth();
  const [securityRules, setSecurityRules] = useState<SecurityRule[]>([
    {
      id: 'copy',
      name: 'Disable Copy',
      description: 'Block all copy operations (Ctrl+C, right-click copy)',
      enabled: true,
      icon: Copy,
      severity: 'critical'
    },
    {
      id: 'paste',
      name: 'Disable Paste',
      description: 'Block all paste operations (Ctrl+V)',
      enabled: true,
      icon: Clipboard,
      severity: 'high'
    },
    {
      id: 'screenshot',
      name: 'Disable Screenshot',
      description: 'Block PrintScreen and screen capture attempts',
      enabled: true,
      icon: Camera,
      severity: 'critical'
    },
    {
      id: 'export',
      name: 'Disable Export',
      description: 'Block all data export functionality',
      enabled: true,
      icon: Download,
      severity: 'critical'
    },
    {
      id: 'email',
      name: 'Disable Email/Share',
      description: 'Block email and external sharing features',
      enabled: true,
      icon: Mail,
      severity: 'high'
    }
  ]);

  const [violationCount, setViolationCount] = useState(0);
  const [lastViolation, setLastViolation] = useState<string | null>(null);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    const { count } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('module', 'security-violation');

    setViolationCount(count || 0);
  };

  const toggleRule = async (ruleId: string) => {
    setSecurityRules(rules =>
      rules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r)
    );

    const rule = securityRules.find(r => r.id === ruleId);
    
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'no-leak-security',
      action: `security_rule_${rule?.enabled ? 'disabled' : 'enabled'}`,
      meta_json: { rule_id: ruleId, rule_name: rule?.name }
    });

    toast.success(`${rule?.name} ${rule?.enabled ? 'disabled' : 'enabled'}`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/15 text-red-400 border-red-500/25';
      case 'high': return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
      default: return 'bg-blue-500/15 text-blue-400 border-blue-500/25';
    }
  };

  const allRulesEnabled = securityRules.every(r => r.enabled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldOff className="w-7 h-7 text-rose-400" />
            No-Leak Security (STRICT)
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Disable copy, paste, export, email, screenshot - System logic visible ONLY to Master Admin
          </p>
        </div>
        <Badge 
          variant="outline" 
          className={`gap-2 ${allRulesEnabled 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
        >
          {allRulesEnabled ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {allRulesEnabled ? 'All Protected' : 'Vulnerabilities Detected'}
        </Badge>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {securityRules.filter(r => r.enabled).length}
              </p>
              <p className="text-xs text-gray-500">Rules Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{violationCount}</p>
              <p className="text-xs text-gray-500">Violations</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Master</p>
              <p className="text-xs text-gray-500">Visibility Level</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <ShieldOff className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500">Backups Visible</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Rules */}
      <Card className="p-6 bg-[#0a0a12] border-gray-800/50">
        <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-400" />
          Security Rules Configuration
        </h3>
        <div className="space-y-4">
          {securityRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-lg border transition-all ${
                rule.enabled 
                  ? 'bg-green-500/5 border-green-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    rule.enabled ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <rule.icon className={`w-6 h-6 ${rule.enabled ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{rule.name}</h4>
                      <Badge variant="outline" className={`text-[10px] ${getSeverityColor(rule.severity)}`}>
                        {rule.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{rule.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label className={`text-sm ${rule.enabled ? 'text-green-400' : 'text-red-400'}`}>
                    {rule.enabled ? 'PROTECTED' : 'VULNERABLE'}
                  </Label>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Information Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* System Logic Visibility */}
        <Card className="p-4 bg-[#0a0a12] border-gray-800/50">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            System Logic Visibility
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">Database Schema</span>
              <Badge variant="outline" className="bg-green-500/15 text-green-400 text-xs">
                Master Only
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">API Endpoints</span>
              <Badge variant="outline" className="bg-green-500/15 text-green-400 text-xs">
                Master Only
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">Business Logic</span>
              <Badge variant="outline" className="bg-green-500/15 text-green-400 text-xs">
                Master Only
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">Security Rules</span>
              <Badge variant="outline" className="bg-green-500/15 text-green-400 text-xs">
                Master Only
              </Badge>
            </div>
          </div>
        </Card>

        {/* Backup Visibility */}
        <Card className="p-4 bg-[#0a0a12] border-gray-800/50">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-rose-400" />
            Backup & Export Control
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">System Backups</span>
              <Badge variant="outline" className="bg-red-500/15 text-red-400 text-xs">
                Hidden
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">Data Export</span>
              <Badge variant="outline" className="bg-red-500/15 text-red-400 text-xs">
                Blocked
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">Report Downloads</span>
              <Badge variant="outline" className="bg-red-500/15 text-red-400 text-xs">
                Blocked
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <span className="text-sm text-gray-400">External Sharing</span>
              <Badge variant="outline" className="bg-red-500/15 text-red-400 text-xs">
                Blocked
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Warning */}
      <Card className="p-4 bg-rose-500/5 border-rose-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
          <div>
            <p className="text-sm text-rose-400 font-medium">Strict Security Mode Active</p>
            <p className="text-xs text-gray-500 mt-1">
              All security rules are enforced system-wide. No role can copy, paste, export, email, or screenshot any data.
              System logic and backups are visible only to Master Admin. Any attempt to bypass these rules is logged and flagged.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NoLeakSecurityView;
