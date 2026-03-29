import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  Lock,
  Crown,
  Globe,
  Building2,
  Server,
  Headphones,
  Users,
  ClipboardList,
  Bot,
  Megaphone,
  Search,
  Scale,
  Shield,
  FileText,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface BugCheck {
  id: string;
  label: string;
  fixed: boolean;
}

interface RoleBugData {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  checks: BugCheck[];
  verifySteps: string[];
  lockLabel: string;
  isLocked: boolean;
}

const RoleBugFixScreen = () => {
  const [roles, setRoles] = useState<RoleBugData[]>([
    {
      id: 1,
      title: 'Master Admin',
      icon: <Crown className="h-5 w-5" />,
      color: 'amber',
      checks: [
        { id: 'm1', label: 'Ghost login shows correct UI', fixed: false },
        { id: 'm2', label: 'Ghost = VIEW ONLY (no execute)', fixed: false },
        { id: 'm3', label: 'High-risk approvals only', fixed: false },
        { id: 'm4', label: 'Global rules apply everywhere', fixed: false },
        { id: 'm5', label: 'Emergency lock works', fixed: false },
      ],
      verifySteps: ['Ghost action attempt → FAIL', 'Approval logged'],
      lockLabel: 'Global authority frozen',
      isLocked: false
    },
    {
      id: 2,
      title: 'Super Admin (Continent)',
      icon: <Globe className="h-5 w-5" />,
      color: 'purple',
      checks: [
        { id: 's1', label: 'Continent-scoped data only', fixed: false },
        { id: 's2', label: 'MEDIUM approvals only', fixed: false },
        { id: 's3', label: 'HIGH risk escalates to Master', fixed: false },
        { id: 's4', label: 'Cannot change global rules', fixed: false },
      ],
      verifySteps: ['Try global edit → FAIL'],
      lockLabel: 'Continent boundary enforced',
      isLocked: false
    },
    {
      id: 3,
      title: 'Area Manager (Country)',
      icon: <Building2 className="h-5 w-5" />,
      color: 'blue',
      checks: [
        { id: 'a1', label: 'Country-only data', fixed: false },
        { id: 'a2', label: 'LOW approvals only', fixed: false },
        { id: 'a3', label: 'Task assign works', fixed: false },
        { id: 'a4', label: 'Partner view read-only wallet', fixed: false },
      ],
      verifySteps: ['MEDIUM approval → ESCALATE'],
      lockLabel: 'Country scope enforced',
      isLocked: false
    },
    {
      id: 4,
      title: 'Server Manager',
      icon: <Server className="h-5 w-5" />,
      color: 'cyan',
      checks: [
        { id: 'sv1', label: 'Infra metrics only', fixed: false },
        { id: 'sv2', label: 'No business data', fixed: false },
        { id: 'sv3', label: 'No approvals', fixed: false },
        { id: 'sv4', label: 'Alert routing works', fixed: false },
      ],
      verifySteps: ['Access sales/leads → FAIL'],
      lockLabel: 'Infra-only scope',
      isLocked: false
    },
    {
      id: 5,
      title: 'Sales & Support Manager',
      icon: <Headphones className="h-5 w-5" />,
      color: 'green',
      checks: [
        { id: 'ss1', label: 'Ticket view & SLA only', fixed: false },
        { id: 'ss2', label: 'No wallet actions', fixed: false },
        { id: 'ss3', label: 'No approval bypass', fixed: false },
      ],
      verifySteps: ['Close without SLA → FAIL'],
      lockLabel: 'Support scope enforced',
      isLocked: false
    },
    {
      id: 6,
      title: 'Lead Manager',
      icon: <Users className="h-5 w-5" />,
      color: 'orange',
      checks: [
        { id: 'l1', label: 'Lead routing only', fixed: false },
        { id: 'l2', label: 'No approvals', fixed: false },
        { id: 'l3', label: 'No financial data', fixed: false },
      ],
      verifySteps: ['Execute sale → FAIL'],
      lockLabel: 'Routing-only scope',
      isLocked: false
    },
    {
      id: 7,
      title: 'Task Manager',
      icon: <ClipboardList className="h-5 w-5" />,
      color: 'pink',
      checks: [
        { id: 't1', label: 'Task create/update', fixed: false },
        { id: 't2', label: 'SLA timer accurate', fixed: false },
        { id: 't3', label: 'No approvals beyond LOW', fixed: false },
      ],
      verifySteps: ['Force close task → FAIL'],
      lockLabel: 'Task scope enforced',
      isLocked: false
    },
    {
      id: 8,
      title: 'API / AI Manager',
      icon: <Bot className="h-5 w-5" />,
      color: 'violet',
      checks: [
        { id: 'ai1', label: 'Keys masked', fixed: false },
        { id: 'ai2', label: 'Create/rotate requires approval', fixed: false },
        { id: 'ai3', label: 'AI = READ-ONLY suggestions', fixed: false },
      ],
      verifySteps: ['Direct enable model → FAIL'],
      lockLabel: 'API controls frozen',
      isLocked: false
    },
    {
      id: 9,
      title: 'Marketing Manager',
      icon: <Megaphone className="h-5 w-5" />,
      color: 'red',
      checks: [
        { id: 'mk1', label: 'Campaign propose only', fixed: false },
        { id: 'mk2', label: 'Festival offers propose', fixed: false },
        { id: 'mk3', label: 'No publish without approval', fixed: false },
      ],
      verifySteps: ['Publish direct → FAIL'],
      lockLabel: 'Marketing gate enforced',
      isLocked: false
    },
    {
      id: 10,
      title: 'SEO Manager',
      icon: <Search className="h-5 w-5" />,
      color: 'teal',
      checks: [
        { id: 'seo1', label: 'View pages only', fixed: false },
        { id: 'seo2', label: 'Keyword/meta propose', fixed: false },
        { id: 'seo3', label: 'Automation toggle via approval', fixed: false },
      ],
      verifySteps: ['Direct meta edit → FAIL'],
      lockLabel: 'SEO scope enforced',
      isLocked: false
    },
    {
      id: 11,
      title: 'Legal Manager',
      icon: <Scale className="h-5 w-5" />,
      color: 'slate',
      checks: [
        { id: 'lg1', label: 'Policy/contract review', fixed: false },
        { id: 'lg2', label: 'Trademark/IP tracking', fixed: false },
        { id: 'lg3', label: 'Escalation works', fixed: false },
      ],
      verifySteps: ['Execute policy → FAIL'],
      lockLabel: 'Legal read-review scope',
      isLocked: false
    },
    {
      id: 12,
      title: 'Security Manager',
      icon: <Shield className="h-5 w-5" />,
      color: 'red',
      checks: [
        { id: 'sec1', label: 'Session/device view', fixed: false },
        { id: 'sec2', label: 'IP block with approval', fixed: false },
        { id: 'sec3', label: 'Insider alerts visible', fixed: false },
      ],
      verifySteps: ['Export logs → FAIL'],
      lockLabel: 'Security controls locked',
      isLocked: false
    },
    {
      id: 13,
      title: 'Audit (Read Only)',
      icon: <FileText className="h-5 w-5" />,
      color: 'gray',
      checks: [
        { id: 'au1', label: 'View logs only', fixed: false },
        { id: 'au2', label: 'No edit/delete', fixed: false },
        { id: 'au3', label: 'No export/copy', fixed: false },
        { id: 'au4', label: 'Immutable records', fixed: false },
      ],
      verifySteps: ['Delete log entry → FAIL', 'Copy text → FAIL'],
      lockLabel: 'Audit immutable',
      isLocked: false
    },
  ]);

  const [expandedRoles, setExpandedRoles] = useState<number[]>([1]);

  const toggleExpanded = (roleId: number) => {
    setExpandedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const toggleCheck = (roleId: number, checkId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          checks: role.checks.map(check => 
            check.id === checkId ? { ...check, fixed: !check.fixed } : check
          )
        };
      }
      return role;
    }));
  };

  const lockRole = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.checks.every(c => c.fixed)) {
      setRoles(prev => prev.map(r => 
        r.id === roleId ? { ...r, isLocked: true } : r
      ));
      toast.success(`${role.title} - ${role.lockLabel}`);
    } else {
      toast.error('Cannot lock: Not all checks are fixed');
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
      cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
      pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
      violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
      red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
      teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
      slate: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
      gray: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
    };
    return colors[color] || colors.gray;
  };

  const totalChecks = roles.reduce((acc, r) => acc + r.checks.length, 0);
  const fixedChecks = roles.reduce((acc, r) => acc + r.checks.filter(c => c.fixed).length, 0);
  const lockedRoles = roles.filter(r => r.isLocked).length;
  const progress = (fixedChecks / totalChecks) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Role-wise Bug Fix List
          </h2>
          <p className="text-muted-foreground mt-1">
            One role at a time. Fix → Re-test → Lock. No UI polish until role = CLEAN.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={`text-lg px-4 py-2 ${lockedRoles === roles.length ? 'bg-green-500 text-white' : 'bg-primary/20 text-primary border-primary/30'}`}>
            {lockedRoles === roles.length ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                ALL ROLES CLEAN
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                {lockedRoles}/{roles.length} Locked
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-card/50 border-border">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Role Fix Progress</span>
              <span className="text-foreground font-medium">{fixedChecks}/{totalChecks} checks fixed</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{totalChecks - fixedChecks}</div>
              <div className="text-xs text-red-400/70">Pending Fixes</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{fixedChecks}</div>
              <div className="text-xs text-green-400/70">Fixed</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="text-2xl font-bold text-primary">{lockedRoles}/{roles.length}</div>
              <div className="text-xs text-primary/70">Roles Locked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Cards */}
      <ScrollArea className="h-[550px]">
        <div className="space-y-3 pr-4">
          {roles.map((role) => {
            const colorClasses = getColorClasses(role.color);
            const allFixed = role.checks.every(c => c.fixed);
            const isExpanded = expandedRoles.includes(role.id);
            const fixedCount = role.checks.filter(c => c.fixed).length;

            return (
              <Collapsible key={role.id} open={isExpanded} onOpenChange={() => toggleExpanded(role.id)}>
                <Card className={`bg-card/50 border-border ${role.isLocked ? 'opacity-60' : ''}`}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`flex items-center gap-2 text-base ${colorClasses.text}`}>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          <span className={`flex items-center justify-center w-7 h-7 rounded-full ${colorClasses.bg}`}>
                            {role.icon}
                          </span>
                          ROLE {role.id} — {role.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{fixedCount}/{role.checks.length}</span>
                          {role.isLocked ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Lock className="h-3 w-3 mr-1" />
                              LOCKED
                            </Badge>
                          ) : allFixed ? (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">READY</Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">IN PROGRESS</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {/* Checks */}
                      <div className="space-y-2 mb-3">
                        <p className="text-xs text-muted-foreground font-medium">CHECK & FIX:</p>
                        {role.checks.map((check) => (
                          <div 
                            key={check.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50"
                          >
                            <span className={`text-sm ${check.fixed ? 'text-green-400 line-through' : 'text-foreground'}`}>
                              • {check.label}
                            </span>
                            {!role.isLocked && (
                              <Button 
                                size="sm" 
                                variant={check.fixed ? 'ghost' : 'outline'}
                                className={`h-7 px-3 text-xs ${check.fixed ? 'text-green-400' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCheck(role.id, check.id);
                                }}
                              >
                                {check.fixed ? (
                                  <><CheckCircle2 className="h-3 w-3 mr-1" />Fixed</>
                                ) : (
                                  <><XCircle className="h-3 w-3 mr-1" />Mark Fixed</>
                                )}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Verify */}
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground font-medium mb-2">VERIFY:</p>
                        <div className="flex flex-wrap gap-2">
                          {role.verifySteps.map((step, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">• {step}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Lock */}
                      {!role.isLocked && (
                        <>
                          <Separator className="my-3" />
                          <Button 
                            className="w-full"
                            variant={allFixed ? 'default' : 'outline'}
                            disabled={!allFixed}
                            onClick={(e) => {
                              e.stopPropagation();
                              lockRole(role.id);
                            }}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            LOCK: {role.lockLabel}
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>

      {/* Summary */}
      {lockedRoles === roles.length && (
        <Card className="bg-green-500/10 border-green-500/50">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-400">ALL ROLES CLEAN</h3>
            <p className="text-sm text-green-400/70 mt-1">
              Zero leakage • Zero bypass • Ready for deployment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleBugFixScreen;
