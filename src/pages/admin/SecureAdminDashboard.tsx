// ==============================================
// Admin Dashboard
// SYSTEM OPERATOR - RULE-ENFORCED - NO OWNERSHIP
// ==============================================

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, FileCheck, Activity, Users,
  ArrowUpRight, Shield, ScrollText, Boxes, 
  Clock, Lock, AlertTriangle, Wallet
} from 'lucide-react';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { AdminSystemOverview } from '@/components/admin/AdminSystemOverview';
import { AdminApprovalsQueue } from '@/components/admin/AdminApprovalsQueue';
import { AdminUserPartnerStatus } from '@/components/admin/AdminUserPartnerStatus';
import { AdminModuleOperations } from '@/components/admin/AdminModuleOperations';
import { AdminEscalations } from '@/components/admin/AdminEscalations';
import { AdminComplianceAlerts } from '@/components/admin/AdminComplianceAlerts';
import { AdminAuditLogs } from '@/components/admin/AdminAuditLogs';

export default function SecureAdminDashboard() {
  const { 
    isAuthorized, 
    formatTimeRemaining, 
    sessionTimeRemaining,
    isSystemFrozen 
  } = useAdminGuard();

  const [activeTab, setActiveTab] = useState('overview');

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
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span className="font-semibold">Admin Dashboard</span>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                <Shield className="h-3 w-3 mr-1" />
                SYSTEM OPERATOR
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Session: {formatTimeRemaining()}
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-400">
                <Wallet className="h-3 w-3 mr-1" />
                Finance Blocked
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-blue-500/10 border-b border-blue-500/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <AlertTriangle className="h-4 w-4" />
            <span>
              RULE-ENFORCED MODE: Executes policy, does NOT define. No infra access. No wallet edits. 
              All actions are reversible and logged. Reports to Super Admin.
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2 text-xs">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Approvals</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 text-xs">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2 text-xs">
              <Boxes className="h-4 w-4" />
              <span className="hidden sm:inline">Modules</span>
            </TabsTrigger>
            <TabsTrigger value="escalations" className="flex items-center gap-2 text-xs">
              <ArrowUpRight className="h-4 w-4" />
              <span className="hidden sm:inline">Escalations</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2 text-xs">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2 text-xs">
              <ScrollText className="h-4 w-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminSystemOverview />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <AdminApprovalsQueue />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <AdminUserPartnerStatus />
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <AdminModuleOperations />
          </TabsContent>

          <TabsContent value="escalations" className="space-y-4">
            <AdminEscalations />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <AdminComplianceAlerts />
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <AdminAuditLogs />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              All actions logged and reversible
            </span>
            <span className="font-mono">
              Hierarchy: Admin → Super Admin • High-risk → Escalate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
