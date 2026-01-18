/**
 * DATA GOVERNANCE SECTION
 * Data retention rules, PII masking, region lock, GDPR/SOC flags
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Eye, Globe, FileCheck, Lock, AlertTriangle, Check, MapPin } from "lucide-react";
import { toast } from "sonner";

const retentionRules = [
  { dataType: 'Chat Logs', retention: '90 days', action: 'Delete', models: 'All', status: 'active' },
  { dataType: 'Training Data', retention: '1 year', action: 'Archive', models: 'Fine-tuned', status: 'active' },
  { dataType: 'User Prompts', retention: '30 days', action: 'Anonymize', models: 'GPT-4, Claude', status: 'active' },
  { dataType: 'API Logs', retention: '180 days', action: 'Delete', models: 'All', status: 'paused' },
];

const complianceFlags = [
  { name: 'GDPR', status: 'compliant', lastAudit: '2024-01-10', region: 'EU' },
  { name: 'SOC 2 Type II', status: 'compliant', lastAudit: '2023-12-15', region: 'Global' },
  { name: 'HIPAA', status: 'not-applicable', lastAudit: '-', region: 'US' },
  { name: 'CCPA', status: 'compliant', lastAudit: '2024-01-05', region: 'California' },
];

const regionLocks = [
  { region: 'EU', models: ['GPT-4', 'Claude 3'], dataCenter: 'Frankfurt', status: 'locked' },
  { region: 'US', models: ['All Models'], dataCenter: 'Virginia', status: 'locked' },
  { region: 'APAC', models: ['Gemini Pro'], dataCenter: 'Singapore', status: 'unlocked' },
];

export const DataGovernanceSection = () => {
  const [piiMasking, setPiiMasking] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-xs text-muted-foreground">Retention Rules</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Eye className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-400">ON</p>
            <p className="text-xs text-muted-foreground">PII Masking</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Globe className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-muted-foreground">Region Locks</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <FileCheck className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3/4</p>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Data Retention Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {retentionRules.map((rule, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{rule.dataType}</p>
                    <p className="text-xs text-muted-foreground">{rule.retention} → {rule.action}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{rule.models}</Badge>
                    <Badge className={rule.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                      {rule.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Compliance Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {complianceFlags.map((flag, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {flag.status === 'compliant' ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-slate-400" />
                    )}
                    <div>
                      <p className="font-medium text-white text-sm">{flag.name}</p>
                      <p className="text-xs text-muted-foreground">Last audit: {flag.lastAudit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{flag.region}</Badge>
                    <Badge className={
                      flag.status === 'compliant' ? 'bg-emerald-500/20 text-emerald-400' :
                      flag.status === 'not-applicable' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-red-500/20 text-red-400'
                    }>
                      {flag.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Region Lock Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {regionLocks.map((lock, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-400" />
                    <p className="font-medium text-white">{lock.region}</p>
                  </div>
                  <Badge className={lock.status === 'locked' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                    {lock.status === 'locked' ? <Lock className="w-3 h-3 mr-1" /> : null}
                    {lock.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Models: {lock.models.join(', ')}</p>
                  <p>Data Center: {lock.dataCenter}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium text-white">PII Masking</p>
                  <p className="text-xs text-muted-foreground">Automatically mask personal data before AI processing</p>
                </div>
              </div>
              <Switch checked={piiMasking} onCheckedChange={(v) => { setPiiMasking(v); toast.success(`PII masking ${v ? 'enabled' : 'disabled'}`); }} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">Audit Logging</p>
                  <p className="text-xs text-muted-foreground">Log all AI data access for compliance</p>
                </div>
              </div>
              <Switch checked={auditLogging} onCheckedChange={(v) => { setAuditLogging(v); toast.success(`Audit logging ${v ? 'enabled' : 'disabled'}`); }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
