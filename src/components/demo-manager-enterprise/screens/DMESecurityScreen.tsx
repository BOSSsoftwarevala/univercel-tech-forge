/**
 * DEMO SECURITY SCREEN
 * Security Rules: Inspect disabled, Source hidden, API masked, Credentials masked, Screenshot watermark
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Code,
  Key,
  Camera,
  Lock,
  Plug,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  critical: boolean;
}

const securityRules: SecurityRule[] = [
  { id: 'inspect', name: 'Disable Inspect Element', description: 'Prevent browser developer tools access', icon: Code, enabled: true, critical: true },
  { id: 'source', name: 'Hide Source Code', description: 'Obfuscate and protect source files', icon: EyeOff, enabled: true, critical: true },
  { id: 'api', name: 'Mask API Endpoints', description: 'Hide API URLs and tokens from client', icon: Plug, enabled: true, critical: true },
  { id: 'credentials', name: 'Mask Credentials', description: 'Hide login details and sensitive data', icon: Key, enabled: true, critical: true },
  { id: 'screenshot', name: 'Screenshot Watermark', description: 'Add watermark to all screenshots', icon: Camera, enabled: true, critical: false },
  { id: 'right-click', name: 'Disable Right Click', description: 'Prevent context menu access', icon: Lock, enabled: true, critical: false },
  { id: 'copy', name: 'Disable Copy/Paste', description: 'Prevent content copying', icon: Lock, enabled: false, critical: false },
  { id: 'print', name: 'Disable Print', description: 'Block print functionality', icon: Lock, enabled: false, critical: false },
];

interface SecurityLog {
  id: string;
  type: 'violation' | 'warning' | 'info';
  message: string;
  software: string;
  time: string;
}

const securityLogs: SecurityLog[] = [
  { id: '1', type: 'violation', message: 'Attempted inspect element detected', software: 'SchoolERP Pro', time: '5 min ago' },
  { id: '2', type: 'warning', message: 'Multiple screenshot attempts', software: 'HospitalCRM', time: '12 min ago' },
  { id: '3', type: 'info', message: 'Watermark applied successfully', software: 'RetailPOS', time: '25 min ago' },
  { id: '4', type: 'violation', message: 'Right-click blocked', software: 'BuilderCRM', time: '1 hour ago' },
  { id: '5', type: 'info', message: 'Security scan completed', software: 'All Demos', time: '2 hours ago' },
];

export const DMESecurityScreen: React.FC = () => {
  const [rules, setRules] = useState(securityRules);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
    toast.success('Security rule updated');
  };

  const handleSaveAll = () => {
    toast.success('All security settings saved');
  };

  const enabledCount = rules.filter(r => r.enabled).length;
  const criticalEnabled = rules.filter(r => r.critical && r.enabled).length;
  const criticalTotal = rules.filter(r => r.critical).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-neon-green" />
            Demo Security
          </h1>
          <p className="text-muted-foreground text-sm">Protect demos from unauthorized access & copying</p>
        </div>
        <Button onClick={handleSaveAll} className="gap-2">
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">{enabledCount}/{rules.length}</p>
            <p className="text-xs text-muted-foreground">Rules Active</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{criticalEnabled}/{criticalTotal}</p>
            <p className="text-xs text-muted-foreground">Critical Rules</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-orange">3</p>
            <p className="text-xs text-muted-foreground">Violations Today</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">247</p>
            <p className="text-xs text-muted-foreground">Protected Demos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Rules */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Security Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rules.map((rule, index) => {
                const Icon = rule.icon;
                return (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      rule.enabled ? 'bg-neon-green/5' : 'bg-background/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        rule.enabled ? 'bg-neon-green/20' : 'bg-muted'
                      }`}>
                        <Icon className={`w-4 h-4 ${rule.enabled ? 'text-neon-green' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{rule.name}</p>
                          {rule.critical && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 border-red-400 text-red-400">
                              Critical
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Security Logs */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-neon-orange" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/30"
                >
                  {log.type === 'violation' && <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />}
                  {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-neon-orange mt-0.5" />}
                  {log.type === 'info' && <CheckCircle2 className="w-4 h-4 text-neon-green mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{log.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{log.software}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
