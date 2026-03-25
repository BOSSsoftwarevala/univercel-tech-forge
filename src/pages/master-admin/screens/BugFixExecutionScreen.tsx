import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Bug,
  Lock,
  Users,
  GitBranch,
  FileText,
  Layout,
  Target,
  Zap,
  RotateCcw,
  Play,
  CheckSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface BugItem {
  id: string;
  label: string;
  status: 'open' | 'fixing' | 'testing' | 'closed';
}

interface BugGroup {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  bugs: BugItem[];
  verifySteps: string[];
  lockLabel: string;
  isLocked: boolean;
}

const BugFixExecutionScreen = () => {
  const [bugGroups, setBugGroups] = useState<BugGroup[]>([
    {
      id: 1,
      title: 'Security Bugs',
      icon: <Shield className="h-5 w-5" />,
      color: 'red',
      bugs: [
        { id: 's1', label: 'Copy works anywhere → FIX', status: 'open' },
        { id: 's2', label: 'Paste works anywhere → FIX', status: 'open' },
        { id: 's3', label: 'Screenshot / recording possible → FIX', status: 'open' },
        { id: 's4', label: 'Export / download works → FIX', status: 'open' },
        { id: 's5', label: 'Multiple device login allowed → FIX', status: 'open' },
        { id: 's6', label: 'Session not expiring → FIX', status: 'open' },
      ],
      verifySteps: ['Re-test on all roles', 'Confirm FAIL on all attempts'],
      lockLabel: 'Security layer LOCKED',
      isLocked: false
    },
    {
      id: 2,
      title: 'Role Isolation Bugs',
      icon: <Users className="h-5 w-5" />,
      color: 'purple',
      bugs: [
        { id: 'r1', label: 'Wrong dashboard on login', status: 'open' },
        { id: 'r2', label: 'Sidebar opens wrong screen', status: 'open' },
        { id: 'r3', label: 'Mixed widgets from other roles', status: 'open' },
        { id: 'r4', label: 'Cross-role data visible', status: 'open' },
      ],
      verifySteps: ['Login role-by-role', 'Click each sidebar item'],
      lockLabel: 'Role routing FROZEN',
      isLocked: false
    },
    {
      id: 3,
      title: 'Approval Flow Bugs',
      icon: <GitBranch className="h-5 w-5" />,
      color: 'orange',
      bugs: [
        { id: 'a1', label: 'Action executed without approval', status: 'open' },
        { id: 'a2', label: 'Wrong approval level allowed', status: 'open' },
        { id: 'a3', label: 'Escalation not working', status: 'open' },
        { id: 'a4', label: 'Reject without reason allowed', status: 'open' },
      ],
      verifySteps: ['Manager → Area → Super → Master', 'Try bypass → MUST FAIL'],
      lockLabel: 'Approval ladder ENFORCED',
      isLocked: false
    },
    {
      id: 4,
      title: 'Audit & Logging Bugs',
      icon: <FileText className="h-5 w-5" />,
      color: 'blue',
      bugs: [
        { id: 'l1', label: 'Missing audit entry', status: 'open' },
        { id: 'l2', label: 'Approval not linked', status: 'open' },
        { id: 'l3', label: 'Ghost access not logged', status: 'open' },
        { id: 'l4', label: 'Timestamp mismatch', status: 'open' },
      ],
      verifySteps: ['Compare action vs audit', 'Cross-check IDs'],
      lockLabel: 'Audit IMMUTABLE',
      isLocked: false
    },
    {
      id: 5,
      title: 'Navigation / Screen Bugs',
      icon: <Layout className="h-5 w-5" />,
      color: 'cyan',
      bugs: [
        { id: 'n1', label: 'Button opens partial screen', status: 'open' },
        { id: 'n2', label: 'Popup instead of full screen', status: 'open' },
        { id: 'n3', label: 'Wrong route mapping', status: 'open' },
        { id: 'n4', label: 'Broken back navigation', status: 'open' },
      ],
      verifySteps: ['One button → One screen', 'Sidebar fixed'],
      lockLabel: 'Navigation map FROZEN',
      isLocked: false
    },
    {
      id: 6,
      title: 'Manager Scope Bugs',
      icon: <Target className="h-5 w-5" />,
      color: 'yellow',
      bugs: [
        { id: 'm1', label: 'Manager doing approval beyond scope', status: 'open' },
        { id: 'm2', label: 'Manager accessing finance / users', status: 'open' },
        { id: 'm3', label: 'Manager editing global rules', status: 'open' },
      ],
      verifySteps: ['Attempt restricted action → FAIL'],
      lockLabel: 'Scope boundaries ENFORCED',
      isLocked: false
    },
    {
      id: 7,
      title: 'Performance & Sync Bugs',
      icon: <Zap className="h-5 w-5" />,
      color: 'green',
      bugs: [
        { id: 'p1', label: 'Data not refreshing', status: 'open' },
        { id: 'p2', label: 'Approval delay mismatch', status: 'open' },
        { id: 'p3', label: 'Audit delay', status: 'open' },
        { id: 'p4', label: 'Role status not syncing', status: 'open' },
      ],
      verifySteps: ['Trigger → instant update', 'Multi-role visibility correct'],
      lockLabel: 'Sync STABLE',
      isLocked: false
    },
  ]);

  const [finalChecks, setFinalChecks] = useState([
    { id: 'f1', label: 'Re-run full TEST PLAN', checked: false },
    { id: 'f2', label: 'Verify ZERO open bugs', checked: false },
    { id: 'f3', label: 'Cross-check audit vs actions', checked: false },
    { id: 'f4', label: 'Confirm security still active', checked: false },
    { id: 'f5', label: 'Mark SYSTEM STABLE only if ZERO issues', checked: false },
  ]);

  const updateBugStatus = (groupId: number, bugId: string, status: BugItem['status']) => {
    setBugGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          bugs: group.bugs.map(bug => 
            bug.id === bugId ? { ...bug, status } : bug
          )
        };
      }
      return group;
    }));
  };

  const lockGroup = (groupId: number) => {
    const group = bugGroups.find(g => g.id === groupId);
    if (group && group.bugs.every(b => b.status === 'closed')) {
      setBugGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, isLocked: true } : g
      ));
      toast.success(`${group.title} - ${group.lockLabel}`);
    } else {
      toast.error('Cannot lock: Not all bugs are closed');
    }
  };

  const getStatusBadge = (status: BugItem['status']) => {
    switch (status) {
      case 'open': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">OPEN</Badge>;
      case 'fixing': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">FIXING</Badge>;
      case 'testing': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">TESTING</Badge>;
      case 'closed': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">CLOSED</Badge>;
    }
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      red: 'text-red-400',
      purple: 'text-purple-400',
      orange: 'text-orange-400',
      blue: 'text-blue-400',
      cyan: 'text-cyan-400',
      yellow: 'text-yellow-400',
      green: 'text-green-400',
    };
    return colors[color] || 'text-primary';
  };

  const totalBugs = bugGroups.reduce((acc, g) => acc + g.bugs.length, 0);
  const closedBugs = bugGroups.reduce((acc, g) => acc + g.bugs.filter(b => b.status === 'closed').length, 0);
  const openBugs = bugGroups.reduce((acc, g) => acc + g.bugs.filter(b => b.status === 'open').length, 0);
  const fixingBugs = bugGroups.reduce((acc, g) => acc + g.bugs.filter(b => b.status === 'fixing').length, 0);
  const testingBugs = bugGroups.reduce((acc, g) => acc + g.bugs.filter(b => b.status === 'testing').length, 0);
  const lockedGroups = bugGroups.filter(g => g.isLocked).length;
  const progress = (closedBugs / totalBugs) * 100;

  const allBugsClosed = closedBugs === totalBugs;
  const allGroupsLocked = lockedGroups === bugGroups.length;
  const allFinalChecked = finalChecks.every(c => c.checked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bug className="h-6 w-6 text-red-400" />
            Bug Fix Execution Plan
          </h2>
          <p className="text-muted-foreground mt-1">
            Fix bugs in strict order. No new feature until bug count = ZERO.
          </p>
        </div>
        <div className="flex gap-2">
          {allBugsClosed && allGroupsLocked ? (
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              ALL BUGS FIXED
            </Badge>
          ) : (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-lg px-4 py-2">
              <Bug className="h-4 w-4 mr-2" />
              {openBugs + fixingBugs + testingBugs} BUGS REMAINING
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-card/50 border-border">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bug Fix Progress</span>
              <span className="text-foreground font-medium">{closedBugs}/{totalBugs} bugs closed</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{openBugs}</div>
              <div className="text-xs text-red-400/70">Open</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400">{fixingBugs}</div>
              <div className="text-xs text-yellow-400/70">Fixing</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400">{testingBugs}</div>
              <div className="text-xs text-blue-400/70">Testing</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{closedBugs}</div>
              <div className="text-xs text-green-400/70">Closed</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="text-2xl font-bold text-primary">{lockedGroups}/7</div>
              <div className="text-xs text-primary/70">Groups Locked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bug Fix Order */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">BUG FIX ORDER (MANDATORY SEQUENCE)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {bugGroups.map((group, idx) => (
              <React.Fragment key={group.id}>
                <Badge 
                  variant="outline" 
                  className={`${group.isLocked ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'text-foreground'}`}
                >
                  {group.id}) {group.title.split(' ')[0]}
                  {group.isLocked && <Lock className="h-3 w-3 ml-1" />}
                </Badge>
                {idx < bugGroups.length - 1 && <span className="text-muted-foreground">→</span>}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bug Groups */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-4 pr-4">
          {bugGroups.map((group) => {
            const groupClosed = group.bugs.every(b => b.status === 'closed');
            
            return (
              <Card 
                key={group.id} 
                className={`bg-card/50 border-border ${group.isLocked ? 'opacity-60' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`flex items-center gap-2 text-lg ${getColorClass(group.color)}`}>
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-background/50">
                        {group.icon}
                      </span>
                      BUG GROUP {group.id} — {group.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {group.isLocked ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Lock className="h-3 w-3 mr-1" />
                          LOCKED
                        </Badge>
                      ) : groupClosed ? (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">READY TO LOCK</Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">IN PROGRESS</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Bugs List */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-muted-foreground font-medium">CHECK & FIX:</p>
                    {group.bugs.map((bug) => (
                      <div 
                        key={bug.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                      >
                        <span className={`text-sm ${bug.status === 'closed' ? 'text-green-400 line-through' : 'text-foreground'}`}>
                          • {bug.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(bug.status)}
                          {!group.isLocked && (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs text-yellow-400 hover:bg-yellow-500/20"
                                onClick={() => updateBugStatus(group.id, bug.id, 'fixing')}
                                disabled={bug.status === 'closed'}
                              >
                                Fix
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs text-blue-400 hover:bg-blue-500/20"
                                onClick={() => updateBugStatus(group.id, bug.id, 'testing')}
                                disabled={bug.status === 'closed'}
                              >
                                Test
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-7 px-2 text-xs text-green-400 hover:bg-green-500/20"
                                onClick={() => updateBugStatus(group.id, bug.id, 'closed')}
                              >
                                Close
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verify Steps */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground font-medium mb-2">VERIFY:</p>
                    <div className="flex flex-wrap gap-2">
                      {group.verifySteps.map((step, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">• {step}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Lock Button */}
                  {!group.isLocked && (
                    <>
                      <Separator className="my-3" />
                      <Button 
                        className="w-full"
                        variant={groupClosed ? 'default' : 'outline'}
                        disabled={!groupClosed}
                        onClick={() => lockGroup(group.id)}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {group.lockLabel}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Bug Fix Cycle */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            BUG FIX CYCLE (REPEAT FOR EACH BUG)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {['Identify', 'Fix', 'Re-test', 'Re-check', 'Mark CLOSED'].map((step, idx) => (
              <React.Fragment key={step}>
                <Badge className="bg-primary/20 text-primary border-primary/30">{step}</Badge>
                {idx < 4 && <span className="text-muted-foreground">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Do not reopen unless regression found
          </p>
        </CardContent>
      </Card>

      {/* Final Quality Check */}
      <Card className={`border-2 ${allBugsClosed && allGroupsLocked && allFinalChecked ? 'bg-green-500/10 border-green-500/50' : 'bg-primary/5 border-primary/30'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-sm flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            FINAL QUALITY CHECK (MANDATORY — LAST)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {finalChecks.map((check) => (
            <div key={check.id} className="flex items-center gap-2">
              <Checkbox 
                id={check.id}
                checked={check.checked}
                disabled={!allBugsClosed || !allGroupsLocked}
                onCheckedChange={() => {
                  setFinalChecks(prev => prev.map(c => 
                    c.id === check.id ? { ...c, checked: !c.checked } : c
                  ));
                }}
              />
              <label 
                htmlFor={check.id} 
                className={`text-sm cursor-pointer ${check.checked ? 'text-green-400' : 'text-foreground'}`}
              >
                {check.label}
              </label>
            </div>
          ))}
          
          {allBugsClosed && allGroupsLocked && allFinalChecked && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-bold text-lg">SYSTEM STABLE</p>
              <p className="text-sm text-green-400/70">Zero bugs • All groups locked • Ready for features</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BugFixExecutionScreen;
