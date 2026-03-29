import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFranchiseManagerGuard } from '@/hooks/useFranchiseManagerGuard';
import { FMApplicationsQueue } from '@/components/franchise-manager/FMApplicationsQueue';
import { FMActiveFranchises } from '@/components/franchise-manager/FMActiveFranchises';
import { FMTerritoryMap } from '@/components/franchise-manager/FMTerritoryMap';
import { FMPerformanceOverview } from '@/components/franchise-manager/FMPerformanceOverview';
import { FMComplianceStatus } from '@/components/franchise-manager/FMComplianceStatus';
import { FMAIFraudAlerts } from '@/components/franchise-manager/FMAIFraudAlerts';
import { FMEscalations } from '@/components/franchise-manager/FMEscalations';
import { FMReportsAudit } from '@/components/franchise-manager/FMReportsAudit';
import { Building2, LogOut, Shield, Lock, Clock, Map, BarChart3, AlertTriangle, ArrowUpRight, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SecureFranchiseManagerDashboard() {
  const navigate = useNavigate();
  const { checkRouteAccess } = useFranchiseManagerGuard();
  const [sessionStart] = useState(new Date());
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    toast.success('Franchise Manager Session Started', {
      description: 'Regional Control Tower Active'
    });

    return () => {
      // Session cleanup
    };
  }, []);

  const handleLogout = () => {
    toast.success('Session Ended', {
      description: 'Franchise Manager logged out securely'
    });
    navigate('/auth');
  };

  const formatSessionTime = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Security Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Franchise Manager</h1>
                  <p className="text-xs text-muted-foreground">Regional Control Tower</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                <Shield className="h-3 w-3 mr-1" />
                SECURE SESSION
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Session: {formatSessionTime()}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Security Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-destructive">
              <Lock className="h-4 w-4" />
              <span>Finance/Admin/Server Access BLOCKED</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">One Territory = One Franchise</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">All Actions Logged</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-8 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden lg:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger
              value="franchises"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden lg:inline">Franchises</span>
            </TabsTrigger>
            <TabsTrigger
              value="territory"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <Map className="h-4 w-4" />
              <span className="hidden lg:inline">Territory</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden lg:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger
              value="compliance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger
              value="fraud"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden lg:inline">Fraud Alerts</span>
            </TabsTrigger>
            <TabsTrigger
              value="escalations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span className="hidden lg:inline">Escalations</span>
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">Audit</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="applications" className="mt-0">
              <FMApplicationsQueue />
            </TabsContent>

            <TabsContent value="franchises" className="mt-0">
              <FMActiveFranchises />
            </TabsContent>

            <TabsContent value="territory" className="mt-0">
              <FMTerritoryMap />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <FMPerformanceOverview />
            </TabsContent>

            <TabsContent value="compliance" className="mt-0">
              <FMComplianceStatus />
            </TabsContent>

            <TabsContent value="fraud" className="mt-0">
              <FMAIFraudAlerts />
            </TabsContent>

            <TabsContent value="escalations" className="mt-0">
              <FMEscalations />
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <FMReportsAudit />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  );
}
