/**
 * DEV SETTINGS
 * Development module settings
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bot,
  Shield,
  Bell,
  Eye,
  Lock,
  Globe,
  Key
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  locked?: boolean;
}

const settings: SettingItem[] = [
  { id: 'ai-auto-fix', label: 'AI Auto-Fix', description: 'Automatically fix detected bugs', icon: Bot, enabled: true },
  { id: 'ai-testing', label: 'AI Auto-Testing', description: 'Run tests automatically after builds', icon: Bot, enabled: true },
  { id: 'security-scan', label: 'Security Scanning', description: 'Scan for vulnerabilities before deploy', icon: Shield, enabled: true, locked: true },
  { id: 'notifications', label: 'Build Notifications', description: 'Get notified on build status changes', icon: Bell, enabled: true },
  { id: 'code-preview', label: 'Source Code View', description: 'Allow viewing source code (disabled)', icon: Eye, enabled: false, locked: true },
  { id: 'download', label: 'Code Download', description: 'Allow downloading source code (disabled)', icon: Lock, enabled: false, locked: true },
  { id: 'domain-lock', label: 'Domain Lock', description: 'Enforce domain restrictions on demos', icon: Globe, enabled: true, locked: true },
  { id: 'license-check', label: 'License Enforcement', description: 'Validate licenses before deployment', icon: Key, enabled: true, locked: true },
];

export const DevSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">Development module configuration</p>
      </div>

      {/* Settings List */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-5 space-y-4">
          {settings.map((setting) => {
            const Icon = setting.icon;
            
            return (
              <div 
                key={setting.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border",
                  setting.locked ? "bg-muted/20 border-border/30" : "bg-background/50 border-border/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    setting.enabled ? "bg-primary/20" : "bg-muted/50"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      setting.enabled ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{setting.label}</p>
                      {setting.locked && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          <Lock className="w-2.5 h-2.5 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={setting.enabled} 
                  disabled={setting.locked}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-card/80 border-amber-500/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Security Settings Locked</p>
            <p className="text-xs text-muted-foreground mt-1">
              Some settings are locked for security reasons and cannot be changed. These include source code protection, domain locking, and license enforcement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
