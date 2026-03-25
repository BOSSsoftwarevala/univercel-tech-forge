// ==============================================
// Server Manager Console
// INFRA GUARDIAN - ZERO TRUST
// ==============================================

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, Activity, AlertTriangle, Rocket, HardDrive,
  Key, Database, ScrollText, Shield, Clock, Lock
} from 'lucide-react';
import { useServerManagerGuard } from '@/hooks/useServerManagerGuard';
import { SMSystemHealth } from '@/components/server-manager/SMSystemHealth';
import { SMServicesStatus } from '@/components/server-manager/SMServicesStatus';
import { SMIncidents } from '@/components/server-manager/SMIncidents';
import { SMDeployments } from '@/components/server-manager/SMDeployments';
import { SMBackups } from '@/components/server-manager/SMBackups';
import { SMSecrets } from '@/components/server-manager/SMSecrets';
import { SMDatabaseHealth } from '@/components/server-manager/SMDatabaseHealth';
import { SMInfraLogs } from '@/components/server-manager/SMInfraLogs';

export default function SecureServerManagerConsole() {
  const { 
    isAuthorized, 
    formatTimeRemaining, 
    sessionTimeRemaining,
    isSystemFrozen 
  } = useServerManagerGuard();

  const [activeTab, setActiveTab] = useState('health');

  // System frozen state
  if (isSystemFrozen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-400 mb-2">System Frozen</h1>
            <p className="text-muted-foreground">
              Your session has been terminated. Please re-authenticate.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Security Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <span className="font-semibold">Server Manager Console</span>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                <Shield className="h-3 w-3 mr-1" />
                INFRA GUARDIAN
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Session: {formatTimeRemaining()}
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-400">
                <Lock className="h-3 w-3 mr-1" />
                Business UI Blocked
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <span>
              ZERO TRUST MODE: No business data access. No PII. Dangerous actions require approval.
              All operations are logged and immutable.
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-2 bg-muted/50">
            <TabsTrigger value="health" className="flex items-center gap-2 text-xs">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 text-xs">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="incidents" className="flex items-center gap-2 text-xs">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Incidents</span>
            </TabsTrigger>
            <TabsTrigger value="deployments" className="flex items-center gap-2 text-xs">
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Deploys</span>
            </TabsTrigger>
            <TabsTrigger value="backups" className="flex items-center gap-2 text-xs">
              <HardDrive className="h-4 w-4" />
              <span className="hidden sm:inline">Backups</span>
            </TabsTrigger>
            <TabsTrigger value="secrets" className="flex items-center gap-2 text-xs">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Secrets</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2 text-xs">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2 text-xs">
              <ScrollText className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            <SMSystemHealth />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <SMServicesStatus />
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <SMIncidents />
          </TabsContent>

          <TabsContent value="deployments" className="space-y-4">
            <SMDeployments />
          </TabsContent>

          <TabsContent value="backups" className="space-y-4">
            <SMBackups />
          </TabsContent>

          <TabsContent value="secrets" className="space-y-4">
            <SMSecrets />
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <SMDatabaseHealth />
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <SMInfraLogs />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              All actions logged with checksum verification
            </span>
            <span className="font-mono">
              MFA: Enforced • IP Allowlist: Active • Audit: Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
