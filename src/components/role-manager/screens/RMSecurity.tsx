/**
 * ROLE MANAGER - SECURITY & COMPLIANCE SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Lock,
  Shield,
  Globe,
  AlertTriangle,
  CheckCircle,
  Snowflake,
  FileCheck,
} from "lucide-react";

const COMPLIANCE_RULES = [
  { id: 'gdpr', name: 'GDPR', region: 'Europe', status: 'compliant', lastAudit: '2 days ago' },
  { id: 'ccpa', name: 'CCPA', region: 'California, USA', status: 'compliant', lastAudit: '5 days ago' },
  { id: 'it-act', name: 'IT Act 2000', region: 'India', status: 'review', lastAudit: '10 days ago' },
  { id: 'pdpa', name: 'PDPA', region: 'Singapore', status: 'compliant', lastAudit: '7 days ago' },
  { id: 'lgpd', name: 'LGPD', region: 'Brazil', status: 'pending', lastAudit: '15 days ago' },
];

const LOCKED_ROLES = [
  { id: 1, name: 'Boss / Owner', reason: 'System Critical', lockedBy: 'System' },
  { id: 2, name: 'Super Admin', reason: 'Security Policy', lockedBy: 'System' },
  { id: 3, name: 'CEO', reason: 'Executive Protection', lockedBy: 'Boss' },
  { id: 4, name: 'Finance Admin', reason: 'Audit Requirement', lockedBy: 'Compliance' },
];

interface RMSecurityProps {
  activeItem: string;
}

export const RMSecurity = memo<RMSecurityProps>(({ activeItem }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 border-green-500/30';
      case 'review': return 'text-yellow-400 border-yellow-500/30';
      default: return 'text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security & Compliance</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'policy-enforcement' && 'Security policy enforcement'}
            {activeItem === 'global-rules' && 'Global compliance rules'}
            {activeItem === 'restricted-lock' && 'Restricted role locks'}
            {activeItem === 'freeze-mode' && 'Role freeze mode control'}
          </p>
        </div>
        <Button variant="outline" className="border-red-500/30 text-red-400">
          <Snowflake className="w-4 h-4 mr-2" />
          Freeze All Roles
        </Button>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-xl font-bold text-white">4/5</p>
              <p className="text-xs text-slate-400">Compliant</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-xl font-bold text-white">1</p>
              <p className="text-xs text-slate-400">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-xl font-bold text-white">4</p>
              <p className="text-xs text-slate-400">Locked Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-xl font-bold text-white">Active</p>
              <p className="text-xs text-slate-400">Policy Status</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Global Compliance Rules */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Global Compliance Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {COMPLIANCE_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">{rule.name}</p>
                      <p className="text-sm text-slate-400">{rule.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{rule.lastAudit}</span>
                    <Badge variant="outline" className={getStatusColor(rule.status)}>
                      {rule.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Restricted Role Lock */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              Restricted Role Lock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {LOCKED_ROLES.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-red-500/20"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-red-400" />
                    <div>
                      <p className="text-white font-medium">{role.name}</p>
                      <p className="text-sm text-slate-400">{role.reason}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-red-400 border-red-500/30">
                    {role.lockedBy}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Freeze Mode */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            Role Freeze Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="text-white font-medium">Global Role Freeze</p>
                <p className="text-sm text-slate-400">Prevent all role modifications</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="text-white font-medium">Permission Freeze</p>
                <p className="text-sm text-slate-400">Lock all permission changes</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="text-white font-medium">Assignment Freeze</p>
                <p className="text-sm text-slate-400">Stop new role assignments</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div>
                <p className="text-white font-medium">Audit Mode Only</p>
                <p className="text-sm text-slate-400">Read-only for all users</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RMSecurity.displayName = 'RMSecurity';
