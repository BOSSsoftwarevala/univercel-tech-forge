import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Rocket,
  Server,
  Database,
  Lock,
  Play,
  Power,
  Activity,
  RotateCcw,
  Eye,
  AlertOctagon
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface CheckItem {
  id: string;
  label: string;
  checked: boolean;
}

const DeployChecklistScreen = () => {
  const [preDeployChecks, setPreDeployChecks] = useState<CheckItem[]>([
    { id: 'roles', label: 'All roles load correct dashboards', checked: false },
    { id: 'sidebar', label: 'Each sidebar button opens its own screen', checked: false },
    { id: 'approval', label: 'Approval ladder works (Area → Super → Master)', checked: false },
    { id: 'copy', label: 'No copy / paste / export works', checked: false },
    { id: 'screenshot', label: 'Screenshot & recording blocked', checked: false },
    { id: 'audit', label: 'Audit logs created for every action', checked: false },
    { id: 'ai', label: 'AI suggestions are read-only', checked: false },
    { id: 'errors', label: 'No console errors / broken routes', checked: false },
  ]);

  const [envChecks, setEnvChecks] = useState<CheckItem[]>([
    { id: 'env', label: 'Environment: Production', checked: false },
    { id: 'api', label: 'API keys: Production only', checked: false },
    { id: 'debug', label: 'Debug mode: OFF', checked: false },
    { id: 'test', label: 'Test users: DISABLED', checked: false },
    { id: 'demo', label: 'Demo credentials: REMOVED', checked: false },
    { id: 'rate', label: 'Rate limits: ACTIVE', checked: false },
    { id: 'security', label: 'Security rules: LOCKED', checked: false },
  ]);

  const [dbChecks, setDbChecks] = useState<CheckItem[]>([
    { id: 'migrations', label: 'Migrations applied', checked: false },
    { id: 'schema', label: 'No pending schema changes', checked: false },
    { id: 'approvals', label: 'Approval flags default = ON', checked: false },
    { id: 'permissions', label: 'Role permissions frozen', checked: false },
    { id: 'rules', label: 'Global rules loaded', checked: false },
  ]);

  const [securityChecks, setSecurityChecks] = useState<CheckItem[]>([
    { id: 'copy', label: 'Copy / Paste block', checked: false },
    { id: 'screenshot', label: 'Screenshot / Recording block', checked: false },
    { id: 'export', label: 'Export / Download block', checked: false },
    { id: 'device', label: 'Device & IP binding', checked: false },
    { id: 'session', label: 'Session timeout', checked: false },
    { id: 'brute', label: 'Brute-force protection', checked: false },
  ]);

  const [dryRunChecks, setDryRunChecks] = useState<CheckItem[]>([
    { id: 'manager', label: 'Manager action → approval → audit', checked: false },
    { id: 'area', label: 'Area approval → Super escalation', checked: false },
    { id: 'super', label: 'Super approval → Master decision', checked: false },
    { id: 'ghost', label: 'Ghost login test (Master only)', checked: false },
  ]);

  const [finalChecks, setFinalChecks] = useState<CheckItem[]>([
    { id: 'verify', label: 'Re-verify all control roles on LIVE', checked: false },
    { id: 'audit', label: 'Cross-check audit logs with actions', checked: false },
    { id: 'demo', label: 'Confirm no test/demo access exists', checked: false },
    { id: 'security', label: 'Validate security layer still active', checked: false },
    { id: 'success', label: 'Mark DEPLOY SUCCESS only if ZERO issue', checked: false },
  ]);

  const [envConfirmed, setEnvConfirmed] = useState(false);
  const [configValidated, setConfigValidated] = useState(false);
  const [securityLocked, setSecurityLocked] = useState(false);
  const [dryRunPassed, setDryRunPassed] = useState<boolean | null>(null);
  const [isLive, setIsLive] = useState(false);

  const toggleCheck = (
    checks: CheckItem[],
    setChecks: React.Dispatch<React.SetStateAction<CheckItem[]>>,
    id: string
  ) => {
    setChecks(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const allPreDeployPassed = preDeployChecks.every(c => c.checked);
  const allEnvPassed = envChecks.every(c => c.checked);
  const allDbPassed = dbChecks.every(c => c.checked);
  const allSecurityPassed = securityChecks.every(c => c.checked);
  const allDryRunPassed = dryRunChecks.every(c => c.checked);
  const allFinalPassed = finalChecks.every(c => c.checked);

  const canGoLive = allPreDeployPassed && envConfirmed && configValidated && securityLocked && dryRunPassed === true;

  const handleGoLive = () => {
    setIsLive(true);
    toast.success('System is now LIVE! All control layers active.');
  };

  const ChecklistSection = ({
    title,
    icon,
    checks,
    setChecks,
    statusBadge,
    actionButton
  }: {
    title: string;
    icon: React.ReactNode;
    checks: CheckItem[];
    setChecks: React.Dispatch<React.SetStateAction<CheckItem[]>>;
    statusBadge?: React.ReactNode;
    actionButton?: React.ReactNode;
  }) => (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
          </CardTitle>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {checks.map((check) => (
            <div 
              key={check.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50"
            >
              <Checkbox 
                id={check.id}
                checked={check.checked}
                onCheckedChange={() => toggleCheck(checks, setChecks, check.id)}
              />
              <label 
                htmlFor={check.id} 
                className={`text-sm cursor-pointer flex-1 ${check.checked ? 'text-green-400 line-through' : 'text-foreground'}`}
              >
                {check.label}
              </label>
              {check.checked ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
        {actionButton && (
          <>
            <Separator className="my-3" />
            {actionButton}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Deploy & Go-Live Checklist
          </h2>
          <p className="text-muted-foreground mt-1">
            Deploy only after ALL tests PASS. No partial deploy allowed.
          </p>
        </div>
        {isLive ? (
          <Badge className="bg-green-500 text-white text-lg px-4 py-2">
            <Power className="h-4 w-4 mr-2" />
            SYSTEM LIVE
          </Badge>
        ) : (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-lg px-4 py-2">
            <AlertTriangle className="h-4 w-4 mr-2" />
            NOT DEPLOYED
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[700px]">
        <div className="space-y-4 pr-4">
          {/* Section 1: Pre-Deploy Validation */}
          <ChecklistSection
            title="SECTION 1 — PRE-DEPLOY VALIDATION"
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
            checks={preDeployChecks}
            setChecks={setPreDeployChecks}
            statusBadge={
              allPreDeployPassed ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">READY</Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">BLOCKED</Badge>
              )
            }
          />

          {/* Section 2: Environment Check */}
          <ChecklistSection
            title="SECTION 2 — ENVIRONMENT CHECK"
            icon={<Server className="h-5 w-5 text-blue-400" />}
            checks={envChecks}
            setChecks={setEnvChecks}
            statusBadge={
              envConfirmed ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">CONFIRMED</Badge>
              ) : null
            }
            actionButton={
              <Button 
                className="w-full" 
                disabled={!allEnvPassed || envConfirmed}
                onClick={() => {
                  setEnvConfirmed(true);
                  toast.success('Environment confirmed for production');
                }}
              >
                {envConfirmed ? 'Environment Confirmed' : 'Confirm Environment'}
              </Button>
            }
          />

          {/* Section 3: Database & Config */}
          <ChecklistSection
            title="SECTION 3 — DATABASE & CONFIG"
            icon={<Database className="h-5 w-5 text-purple-400" />}
            checks={dbChecks}
            setChecks={setDbChecks}
            statusBadge={
              configValidated ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">VALIDATED</Badge>
              ) : null
            }
            actionButton={
              <Button 
                className="w-full" 
                disabled={!allDbPassed || configValidated}
                onClick={() => {
                  setConfigValidated(true);
                  toast.success('Configuration validated');
                }}
              >
                {configValidated ? 'Config Validated' : 'Validate Config'}
              </Button>
            }
          />

          {/* Section 4: Security Hard Lock */}
          <ChecklistSection
            title="SECTION 4 — SECURITY HARD LOCK"
            icon={<Lock className="h-5 w-5 text-red-400" />}
            checks={securityChecks}
            setChecks={setSecurityChecks}
            statusBadge={
              securityLocked ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LOCKED</Badge>
              ) : null
            }
            actionButton={
              <Button 
                className="w-full bg-red-500 hover:bg-red-600" 
                disabled={!allSecurityPassed || securityLocked}
                onClick={() => {
                  setSecurityLocked(true);
                  toast.success('Security layer locked');
                }}
              >
                {securityLocked ? 'Security Locked' : 'Lock Security Layer'}
              </Button>
            }
          />

          {/* Section 5: Dry Run */}
          <ChecklistSection
            title="SECTION 5 — DRY RUN (NO USER IMPACT)"
            icon={<Play className="h-5 w-5 text-yellow-400" />}
            checks={dryRunChecks}
            setChecks={setDryRunChecks}
            statusBadge={
              dryRunPassed === true ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">PASS</Badge>
              ) : dryRunPassed === false ? (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">FAIL</Badge>
              ) : null
            }
            actionButton={
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600" 
                  disabled={!allDryRunPassed}
                  onClick={() => {
                    setDryRunPassed(true);
                    toast.success('Dry run passed');
                  }}
                >
                  Mark as PASS
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600" 
                  onClick={() => {
                    setDryRunPassed(false);
                    toast.error('Dry run failed - fix issues before deploy');
                  }}
                >
                  Mark as FAIL
                </Button>
              </div>
            }
          />

          {/* Section 6: Go-Live Switch */}
          <Card className={`border-2 ${isLive ? 'bg-green-500/10 border-green-500/50' : 'bg-card/50 border-primary/50'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Power className="h-5 w-5 text-primary" />
                SECTION 6 — GO-LIVE SWITCH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">REQUIRES:</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      {canGoLive ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                      <span className={canGoLive ? 'text-green-400' : 'text-muted-foreground'}>All pre-checks passed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertOctagon className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-400">Master Admin confirmation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-red-400">One-time irreversible action</span>
                    </li>
                  </ul>
                </div>

                {isLive ? (
                  <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-green-400 font-bold">SYSTEM IS LIVE</p>
                    <p className="text-sm text-green-400/70 mt-1">All control layers active • Live traffic enabled • Monitoring ON</p>
                  </div>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                        disabled={!canGoLive}
                      >
                        <Rocket className="h-5 w-5 mr-2" />
                        GO LIVE
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Confirm Go-Live?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          This is a ONE-TIME IRREVERSIBLE action. The system will go live and all control layers will be activated. Are you absolutely sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-muted border-border text-foreground">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleGoLive} className="bg-green-500 hover:bg-green-600">
                          Confirm GO LIVE
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Post-Deploy Monitor */}
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-cyan-400" />
                SECTION 7 — POST-DEPLOY MONITOR (FIRST 24H)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {['Error rate', 'Approval queue', 'Security alerts', 'SLA breaches', 'Performance spikes'].map((metric) => (
                  <div key={metric} className="p-3 rounded-lg bg-background/50 border border-border/50 text-center">
                    <div className="text-2xl font-bold text-foreground">0</div>
                    <div className="text-xs text-muted-foreground">{metric}</div>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <Button className="w-full" variant="outline" disabled={!isLive}>
                <Eye className="h-4 w-4 mr-2" />
                View Live Monitor
              </Button>
            </CardContent>
          </Card>

          {/* Section 8: Rollback Plan */}
          <Card className="bg-card/50 border-border opacity-75">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <RotateCcw className="h-5 w-5 text-orange-400" />
                SECTION 8 — ROLLBACK PLAN (READ ONLY)
              </CardTitle>
              <Badge variant="outline" className="w-fit">MASTER ADMIN ONLY</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded bg-background/50">
                  <span className="text-muted-foreground">Last stable version:</span>
                  <span className="text-foreground font-mono">v2.4.1-stable</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-background/50">
                  <span className="text-muted-foreground">Rollback conditions:</span>
                  <span className="text-foreground">Critical failure only</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-background/50">
                  <span className="text-muted-foreground">Impact scope:</span>
                  <span className="text-foreground">All control layers</span>
                </div>
              </div>
              <p className="text-xs text-red-400 mt-3 text-center">NO execute unless critical</p>
            </CardContent>
          </Card>

          {/* Final Quality Check */}
          <Card className="bg-primary/5 border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-primary text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                FINAL QUALITY CHECK (MANDATORY — LAST)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {finalChecks.map((check) => (
                <div key={check.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={`final-${check.id}`}
                    checked={check.checked}
                    onCheckedChange={() => toggleCheck(finalChecks, setFinalChecks, check.id)}
                  />
                  <label 
                    htmlFor={`final-${check.id}`} 
                    className={`text-sm cursor-pointer ${check.checked ? 'text-green-400' : 'text-foreground'}`}
                  >
                    {check.label}
                  </label>
                </div>
              ))}
              {allFinalPassed && isLive && (
                <div className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-bold text-lg">DEPLOY SUCCESS</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DeployChecklistScreen;
