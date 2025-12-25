import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Users, GitBranch, FileText, Navigation, UserCheck, Zap, RotateCcw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface TestItem {
  id: string;
  test: string;
  passed: boolean | null;
}

interface RegressionGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  tests: TestItem[];
  passCondition: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
}

const RegressionTestScreen = () => {
  const [regressionGroups, setRegressionGroups] = useState<RegressionGroup[]>([
    {
      id: 'security',
      title: 'Security Layer',
      icon: <Shield className="h-5 w-5" />,
      tests: [
        { id: 'sec1', test: 'Copy / Paste → FAIL', passed: null },
        { id: 'sec2', test: 'Screenshot / Recording → FAIL', passed: null },
        { id: 'sec3', test: 'Export / Download → FAIL', passed: null },
        { id: 'sec4', test: 'Multi-device login → BLOCK', passed: null },
        { id: 'sec5', test: 'Session timeout → WORKS', passed: null },
      ],
      passCondition: 'All attempts blocked',
      status: 'pending'
    },
    {
      id: 'role-isolation',
      title: 'Role Isolation',
      icon: <Users className="h-5 w-5" />,
      tests: [
        { id: 'role1', test: 'Login each role', passed: null },
        { id: 'role2', test: 'Sidebar → open every item', passed: null },
        { id: 'role3', test: 'Confirm only own screens load', passed: null },
      ],
      passCondition: 'No mixed screens / no foreign data',
      status: 'pending'
    },
    {
      id: 'approval-ladder',
      title: 'Approval Ladder',
      icon: <GitBranch className="h-5 w-5" />,
      tests: [
        { id: 'appr1', test: 'Manager action → Request created', passed: null },
        { id: 'appr2', test: 'Area approves LOW only', passed: null },
        { id: 'appr3', test: 'Super approves MEDIUM only', passed: null },
        { id: 'appr4', test: 'Master approves HIGH only', passed: null },
        { id: 'appr5', test: 'Direct execute → FAIL', passed: null },
      ],
      passCondition: 'No bypass, correct escalation',
      status: 'pending'
    },
    {
      id: 'audit-logs',
      title: 'Audit & Logs',
      icon: <FileText className="h-5 w-5" />,
      tests: [
        { id: 'aud1', test: 'Every click logged', passed: null },
        { id: 'aud2', test: 'Approval linked to action', passed: null },
        { id: 'aud3', test: 'Reject requires reason', passed: null },
        { id: 'aud4', test: 'Ghost view logged', passed: null },
      ],
      passCondition: 'No missing or editable logs',
      status: 'pending'
    },
    {
      id: 'navigation',
      title: 'Navigation & Routing',
      icon: <Navigation className="h-5 w-5" />,
      tests: [
        { id: 'nav1', test: 'One button → One full screen', passed: null },
        { id: 'nav2', test: 'No popups / partial renders', passed: null },
        { id: 'nav3', test: 'Back navigation correct', passed: null },
      ],
      passCondition: 'Routing stable',
      status: 'pending'
    },
    {
      id: 'manager-scopes',
      title: 'Manager Scopes',
      icon: <UserCheck className="h-5 w-5" />,
      tests: [
        { id: 'mgr1', test: 'Each manager attempts restricted action', passed: null },
        { id: 'mgr2', test: 'Verify system blocks correctly', passed: null },
      ],
      passCondition: 'Zero scope violation',
      status: 'pending'
    },
    {
      id: 'sync-performance',
      title: 'Sync & Performance',
      icon: <Zap className="h-5 w-5" />,
      tests: [
        { id: 'sync1', test: 'Approval status sync real-time', passed: null },
        { id: 'sync2', test: 'Dashboard counts accurate', passed: null },
        { id: 'sync3', test: 'No stale data after action', passed: null },
      ],
      passCondition: 'Live sync OK',
      status: 'pending'
    },
  ]);

  const [overallStatus, setOverallStatus] = useState<'pending' | 'passed' | 'failed'>('pending');

  const toggleTest = (groupId: string, testId: string, passed: boolean) => {
    setRegressionGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const updatedTests = group.tests.map(test => 
          test.id === testId ? { ...test, passed } : test
        );
        const allTested = updatedTests.every(t => t.passed !== null);
        const allPassed = updatedTests.every(t => t.passed === true);
        return {
          ...group,
          tests: updatedTests,
          status: allTested ? (allPassed ? 'passed' : 'failed') : 'running'
        };
      }
      return group;
    }));
  };

  const runAllTests = () => {
    setRegressionGroups(prev => prev.map(group => ({
      ...group,
      status: 'running',
      tests: group.tests.map(t => ({ ...t, passed: null }))
    })));
    setOverallStatus('pending');
  };

  const checkOverallStatus = () => {
    const allPassed = regressionGroups.every(g => g.status === 'passed');
    const anyFailed = regressionGroups.some(g => g.status === 'failed');
    if (allPassed) setOverallStatus('passed');
    else if (anyFailed) setOverallStatus('failed');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">PASSED</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">FAILED</Badge>;
      case 'running':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">RUNNING</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">PENDING</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Regression Test Plan</h2>
          <p className="text-muted-foreground">Ensure no fixed bug reappears after changes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={runAllTests}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Tests
          </Button>
          <Button onClick={checkOverallStatus}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Verify Status
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {overallStatus === 'passed' && <CheckCircle2 className="h-8 w-8 text-green-500" />}
              {overallStatus === 'failed' && <XCircle className="h-8 w-8 text-red-500" />}
              {overallStatus === 'pending' && <AlertTriangle className="h-8 w-8 text-yellow-500" />}
              <div>
                <h3 className="text-lg font-semibold">Overall Regression Status</h3>
                <p className="text-sm text-muted-foreground">
                  {overallStatus === 'passed' && 'All regression tests passed - Ready for Live'}
                  {overallStatus === 'failed' && 'Regression failed - DO NOT DEPLOY'}
                  {overallStatus === 'pending' && 'Tests pending - Complete all checks'}
                </p>
              </div>
            </div>
            {getStatusBadge(overallStatus)}
          </div>
        </CardContent>
      </Card>

      {/* Rollback Rule */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Rollback Rule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• IF any regression FAIL: Disable last change</li>
            <li>• Restore previous stable snapshot</li>
            <li>• Re-run regression from step 1</li>
          </ul>
        </CardContent>
      </Card>

      {/* Regression Groups */}
      <div className="grid gap-4">
        {regressionGroups.map((group, index) => (
          <Card key={group.id} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-primary">{group.icon}</span>
                  {group.title}
                </CardTitle>
                {getStatusBadge(group.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tests:</p>
                {group.tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-sm">{test.test}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={test.passed === true ? 'default' : 'outline'}
                        className={test.passed === true ? 'bg-green-500 hover:bg-green-600' : ''}
                        onClick={() => toggleTest(group.id, test.id, true)}
                      >
                        PASS
                      </Button>
                      <Button
                        size="sm"
                        variant={test.passed === false ? 'default' : 'outline'}
                        className={test.passed === false ? 'bg-red-500 hover:bg-red-600' : ''}
                        onClick={() => toggleTest(group.id, test.id, false)}
                      >
                        FAIL
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-green-400">Pass Condition:</span> {group.passCondition}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Final Sign-off */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Final Regression Sign-Off</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Requires:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Checkbox id="master-confirm" />
                <label htmlFor="master-confirm">Master Admin confirmation</label>
              </li>
              <li className="flex items-center gap-2">
                <Checkbox id="all-pass" />
                <label htmlFor="all-pass">All tests PASS</label>
              </li>
              <li className="flex items-center gap-2">
                <Checkbox id="zero-issues" />
                <label htmlFor="zero-issues">Zero open issues</label>
              </li>
            </ul>
          </div>
          <div className="flex gap-3 pt-4">
            <Button className="bg-green-600 hover:bg-green-700" disabled={overallStatus !== 'passed'}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              REGRESSION PASSED → Ready for Live
            </Button>
            <Button variant="destructive" disabled={overallStatus !== 'failed'}>
              <XCircle className="h-4 w-4 mr-2" />
              REGRESSION FAILED → DO NOT DEPLOY
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegressionTestScreen;
