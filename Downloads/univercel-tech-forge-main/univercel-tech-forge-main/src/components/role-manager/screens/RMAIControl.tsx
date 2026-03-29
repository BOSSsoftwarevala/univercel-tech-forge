/**
 * ROLE MANAGER - AI ROLE CONTROL SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  AlertTriangle,
  Shield,
  CheckCircle,
  Eye,
  FileText,
  Zap,
  Lock,
} from "lucide-react";

const AI_ANALYSIS = [
  { id: 1, role: 'Finance Analyst', issue: 'Delete permission on transactions', severity: 'high', suggestion: 'Remove delete access' },
  { id: 2, role: 'Sales Executive', issue: 'Access to admin settings', severity: 'medium', suggestion: 'Restrict to sales module only' },
  { id: 3, role: 'Support Agent', issue: 'Export permission on user data', severity: 'high', suggestion: 'Require manager approval' },
  { id: 4, role: 'Content Editor', issue: 'Publish without approval', severity: 'low', suggestion: 'Add approval workflow' },
];

const COMPLIANCE_SUGGESTIONS = [
  { id: 1, title: 'GDPR Compliance', description: 'Add data access logging for all roles', status: 'pending' },
  { id: 2, title: 'IT Act Compliance', description: 'Implement 2FA for admin roles', status: 'done' },
  { id: 3, title: 'SOC2 Requirement', description: 'Role access review every 90 days', status: 'pending' },
  { id: 4, title: 'ISO 27001', description: 'Segregation of duties check', status: 'done' },
];

const AUDIT_FLAGS = [
  { id: 1, type: 'warning', message: '3 roles have excessive permissions', time: '2 hours ago' },
  { id: 2, type: 'info', message: 'AI detected role consolidation opportunity', time: '5 hours ago' },
  { id: 3, type: 'warning', message: 'Unused role detected: "Legacy Admin"', time: '1 day ago' },
  { id: 4, type: 'error', message: 'Permission conflict in Sales Manager role', time: '2 days ago' },
];

interface RMAIControlProps {
  activeItem: string;
}

export const RMAIControl = memo<RMAIControlProps>(({ activeItem }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getFlagColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Role Control</h1>
          <p className="text-sm text-slate-400">
            VALA AI - Limited Access (Read-Only Analysis)
          </p>
        </div>
        <Badge variant="outline" className="text-purple-400 border-purple-500/30">
          <Lock className="w-3 h-3 mr-1" />
          No Auto Apply - Approval Required
        </Badge>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-xl font-bold text-white">12</p>
              <p className="text-xs text-slate-400">Issues Detected</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-xl font-bold text-white">5</p>
              <p className="text-xs text-slate-400">High Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-xl font-bold text-white">38</p>
              <p className="text-xs text-slate-400">Compliant Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-xl font-bold text-white">8</p>
              <p className="text-xs text-slate-400">Suggestions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Risk Detection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Over-Permission Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {AI_ANALYSIS.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-slate-900/50 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{item.role}</span>
                    <Badge variant="outline" className={getSeverityColor(item.severity)}>
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-red-400 mb-1">{item.issue}</p>
                  <p className="text-sm text-green-400">→ {item.suggestion}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Suggestions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Compliance Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {COMPLIANCE_SUGGESTIONS.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-slate-900/50 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{item.title}</span>
                    <Badge 
                      variant="outline" 
                      className={item.status === 'done' 
                        ? 'text-green-400 border-green-500/30' 
                        : 'text-yellow-400 border-yellow-500/30'
                      }
                    >
                      {item.status === 'done' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Flags */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Audit Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {AUDIT_FLAGS.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700"
              >
                <AlertTriangle className={`w-4 h-4 ${getFlagColor(flag.type)}`} />
                <span className="text-slate-300 flex-1">{flag.message}</span>
                <span className="text-sm text-slate-500">{flag.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RMAIControl.displayName = 'RMAIControl';
