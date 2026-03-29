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
  Users, 
  Globe, 
  Building2,
  ClipboardList,
  Lock,
  FileText,
  Play,
  RotateCcw
} from 'lucide-react';

interface TestCase {
  id: string;
  description: string;
  expected: string;
  status: 'pending' | 'pass' | 'fail';
}

interface TestGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  appliesTo?: string[];
  tests: TestCase[];
  expectedOutcomes: string[];
}

const TestPlanScreen = () => {
  const [testGroups, setTestGroups] = useState<TestGroup[]>([
    {
      id: 'A',
      title: 'Managers (Functional)',
      icon: <Users className="h-5 w-5" />,
      appliesTo: ['Server', 'Sales & Support', 'Lead', 'Task', 'HR', 'API/AI', 'Marketing', 'SEO', 'Legal'],
      tests: [
        { id: 'A1', description: 'Login → Correct role dashboard opens', expected: 'SUCCESS', status: 'pending' },
        { id: 'A2', description: 'Sidebar click → Own screen opens (no mix)', expected: 'SUCCESS', status: 'pending' },
        { id: 'A3', description: 'Perform allowed action → SUCCESS', expected: 'SUCCESS', status: 'pending' },
        { id: 'A4', description: 'Perform restricted action → BLOCKED', expected: 'BLOCKED', status: 'pending' },
        { id: 'A5', description: 'Approval-required action → REQUEST CREATED', expected: 'REQUEST CREATED', status: 'pending' },
        { id: 'A6', description: 'Copy / paste / screenshot → MUST FAIL', expected: 'FAIL', status: 'pending' },
        { id: 'A7', description: 'Logout → Session terminated', expected: 'SUCCESS', status: 'pending' },
      ],
      expectedOutcomes: ['Action logged', 'No permission leakage']
    },
    {
      id: 'B',
      title: 'Area Manager',
      icon: <Building2 className="h-5 w-5" />,
      tests: [
        { id: 'B1', description: 'Login → Country-scoped data only', expected: 'SUCCESS', status: 'pending' },
        { id: 'B2', description: 'View daily operations → LIVE feed loads', expected: 'SUCCESS', status: 'pending' },
        { id: 'B3', description: 'Approve LOW risk request → SUCCESS', expected: 'SUCCESS', status: 'pending' },
        { id: 'B4', description: 'Attempt MEDIUM/HIGH approval → ESCALATED', expected: 'ESCALATED', status: 'pending' },
        { id: 'B5', description: 'Assign task → Task visible to manager', expected: 'SUCCESS', status: 'pending' },
        { id: 'B6', description: 'View reports → No export allowed', expected: 'NO EXPORT', status: 'pending' },
      ],
      expectedOutcomes: ['Country scope enforced', 'Approval boundary respected']
    },
    {
      id: 'C',
      title: 'Super Admin (Continent)',
      icon: <Globe className="h-5 w-5" />,
      tests: [
        { id: 'C1', description: 'Login → Continent dashboard loads', expected: 'SUCCESS', status: 'pending' },
        { id: 'C2', description: 'View countries → Correct mapping', expected: 'SUCCESS', status: 'pending' },
        { id: 'C3', description: 'Approve MEDIUM risk → SUCCESS', expected: 'SUCCESS', status: 'pending' },
        { id: 'C4', description: 'HIGH risk → Sent to Master Admin', expected: 'ESCALATED', status: 'pending' },
        { id: 'C5', description: 'Assign task to Area Manager → Visible', expected: 'SUCCESS', status: 'pending' },
        { id: 'C6', description: 'Security alerts → View only', expected: 'VIEW ONLY', status: 'pending' },
      ],
      expectedOutcomes: ['Continent scope enforced', 'Escalation works']
    },
    {
      id: 'D',
      title: 'Master Admin',
      icon: <Shield className="h-5 w-5" />,
      tests: [
        { id: 'D1', description: 'Login → Global control visible', expected: 'SUCCESS', status: 'pending' },
        { id: 'D2', description: 'Ghost login any role → UI matches target', expected: 'SUCCESS', status: 'pending' },
        { id: 'D3', description: 'Approve HIGH risk → EXECUTED', expected: 'EXECUTED', status: 'pending' },
        { id: 'D4', description: 'Update global rule → Applied system-wide', expected: 'SUCCESS', status: 'pending' },
        { id: 'D5', description: 'View audit → Immutable, no export', expected: 'NO EXPORT', status: 'pending' },
        { id: 'D6', description: 'Security overview → Alerts visible', expected: 'SUCCESS', status: 'pending' },
      ],
      expectedOutcomes: ['Final authority works', 'Ghost access logged']
    },
    {
      id: 'E',
      title: 'Security Overlay (All Roles)',
      icon: <Lock className="h-5 w-5" />,
      tests: [
        { id: 'E1', description: 'Copy text → FAIL', expected: 'BLOCKED', status: 'pending' },
        { id: 'E2', description: 'Screenshot attempt → BLOCKED', expected: 'BLOCKED', status: 'pending' },
        { id: 'E3', description: 'Screen recording → BLOCKED', expected: 'BLOCKED', status: 'pending' },
        { id: 'E4', description: 'Export / download → FAIL', expected: 'BLOCKED', status: 'pending' },
        { id: 'E5', description: 'Device change → FLAGGED', expected: 'FLAGGED', status: 'pending' },
        { id: 'E6', description: 'IP jump → ALERT', expected: 'ALERT', status: 'pending' },
      ],
      expectedOutcomes: ['Zero data leakage', 'All incidents logged']
    },
    {
      id: 'F',
      title: 'Audit & Logging',
      icon: <FileText className="h-5 w-5" />,
      tests: [
        { id: 'F1', description: 'Every action → Audit entry created', expected: 'SUCCESS', status: 'pending' },
        { id: 'F2', description: 'Approval decision → Linked reference', expected: 'SUCCESS', status: 'pending' },
        { id: 'F3', description: 'Escalation → Full chain visible', expected: 'SUCCESS', status: 'pending' },
        { id: 'F4', description: 'Logs → Read-only', expected: 'READ ONLY', status: 'pending' },
      ],
      expectedOutcomes: ['Complete traceability']
    },
  ]);

  const updateTestStatus = (groupId: string, testId: string, status: 'pass' | 'fail') => {
    setTestGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tests: group.tests.map(test => 
            test.id === testId ? { ...test, status } : test
          )
        };
      }
      return group;
    }));
  };

  const resetAllTests = () => {
    setTestGroups(prev => prev.map(group => ({
      ...group,
      tests: group.tests.map(test => ({ ...test, status: 'pending' as const }))
    })));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">PASS</Badge>;
      case 'fail': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">FAIL</Badge>;
      default: return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">PENDING</Badge>;
    }
  };

  const totalTests = testGroups.reduce((acc, g) => acc + g.tests.length, 0);
  const passedTests = testGroups.reduce((acc, g) => acc + g.tests.filter(t => t.status === 'pass').length, 0);
  const failedTests = testGroups.reduce((acc, g) => acc + g.tests.filter(t => t.status === 'fail').length, 0);
  const pendingTests = totalTests - passedTests - failedTests;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Test Plan — Control Layer
          </h2>
          <p className="text-muted-foreground mt-1">
            Execute role-wise, bottom → top. Every action must create an audit log.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAllTests} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{totalTests}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{passedTests}</div>
            <div className="text-sm text-green-400/70">Passed</div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{failedTests}</div>
            <div className="text-sm text-red-400/70">Failed</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">{pendingTests}</div>
            <div className="text-sm text-yellow-400/70">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Test Sequence Order */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">TEST SEQUENCE (MANDATORY ORDER)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {['1) Managers', '2) Area Manager', '3) Super Admin', '4) Master Admin'].map((step, idx) => (
              <React.Fragment key={step}>
                <Badge variant="outline" className="text-foreground">{step}</Badge>
                {idx < 3 && <span className="text-muted-foreground">→</span>}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Groups */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4 pr-4">
          {testGroups.map((group) => (
            <Card key={group.id} className="bg-card/50 border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                      {group.icon}
                    </span>
                    TEST GROUP {group.id} — {group.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    {getStatusBadge(
                      group.tests.every(t => t.status === 'pass') ? 'pass' :
                      group.tests.some(t => t.status === 'fail') ? 'fail' : 'pending'
                    )}
                  </div>
                </div>
                {group.appliesTo && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-muted-foreground mr-2">APPLIES TO:</span>
                    {group.appliesTo.map(role => (
                      <Badge key={role} variant="outline" className="text-xs">{role}</Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.tests.map((test) => (
                    <div 
                      key={test.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <span className="font-mono text-sm text-muted-foreground">{test.id}</span>
                        <span className="text-sm text-foreground">{test.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{test.expected}</Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0 text-green-500 hover:bg-green-500/20"
                          onClick={() => updateTestStatus(group.id, test.id, 'pass')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-500 hover:bg-red-500/20"
                          onClick={() => updateTestStatus(group.id, test.id, 'fail')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">EXPECTED:</span>
                  {group.expectedOutcomes.map((outcome, idx) => (
                    <Badge key={idx} className="bg-primary/20 text-primary border-primary/30 text-xs">
                      ✔ {outcome}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Pass/Fail Criteria */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-500/5 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              PASS IF
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-400/80 space-y-1">
            <p>• All tests meet expected result</p>
            <p>• No cross-role data visible</p>
            <p>• No UI mixing</p>
            <p>• No security bypass</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-400 text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              FAIL IF
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-red-400/80 space-y-1">
            <p>• Any approval bypassed</p>
            <p>• Any export succeeds</p>
            <p>• Any wrong screen opens</p>
          </CardContent>
        </Card>
      </div>

      {/* Final Quality Check */}
      <Card className="bg-primary/5 border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-sm">FINAL QUALITY CHECK (MANDATORY — LAST)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            'Re-run entire test sequence once more',
            'Cross-verify audit logs with actions',
            'Confirm approval ladder (Area → Super → Master)',
            'Validate security on every role',
            'Mark COMPLETE only if ZERO failure found'
          ].map((check, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Checkbox id={`check-${idx}`} />
              <label htmlFor={`check-${idx}`} className="text-sm text-foreground cursor-pointer">
                {check}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPlanScreen;
