/**
 * STEP 12: System Validation Panel
 * Visual interface for final validation and lock
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lock, 
  Play,
  RefreshCw,
  Server,
  Users,
  Layout,
  Zap,
  Eye
} from 'lucide-react';
import { useSystemValidation, ValidationResult, RoleValidation } from '@/hooks/useSystemValidation';
import { useSystemLock } from '@/hooks/useSystemLock';
import { toast } from 'sonner';

export function SystemValidationPanel() {
  const { isValidating, report, runFullValidation, lockSystem: lockValidation } = useSystemValidation();
  const { lockState, lockSystem, getLockSummary } = useSystemLock();
  const [isLocking, setIsLocking] = useState(false);

  const handleRunValidation = async () => {
    toast.info('Starting full system validation...');
    const result = await runFullValidation();
    
    if (result.overallStatus === 'passed') {
      toast.success('System validation passed! Ready for lock.');
    } else if (result.overallStatus === 'warnings') {
      toast.warning('Validation complete with warnings. Review before locking.');
    } else {
      toast.error('Validation failed. Fix critical issues before locking.');
    }
  };

  const handleLockSystem = async () => {
    if (!report || report.overallStatus === 'failed') {
      toast.error('Cannot lock system. Validation must pass first.');
      return;
    }

    setIsLocking(true);
    try {
      await lockValidation();
      await lockSystem('system_validation');
      toast.success('System locked successfully. Production ready.');
    } catch (error) {
      toast.error('Failed to lock system.');
    } finally {
      setIsLocking(false);
    }
  };

  const lockSummary = getLockSummary();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">System Validation & Lock</h1>
            <p className="text-muted-foreground">Step 12: Final validation before production</p>
          </div>
        </div>
        <Badge 
          variant={lockState.isLocked ? 'default' : 'secondary'}
          className={lockState.isLocked ? 'bg-green-500' : ''}
        >
          {lockSummary.status}
        </Badge>
      </div>

      {/* Lock Status Banner */}
      {lockState.isLocked && (
        <Card className="border-green-500 bg-green-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-700">System Locked - Production Ready</p>
                <p className="text-sm text-green-600">{lockSummary.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleRunValidation}
          disabled={isValidating || lockState.isLocked}
          className="gap-2"
        >
          {isValidating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isValidating ? 'Validating...' : 'Run Full Validation'}
        </Button>

        <Button
          onClick={handleLockSystem}
          disabled={!report || report.overallStatus === 'failed' || lockState.isLocked || isLocking}
          variant="default"
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Lock className="h-4 w-4" />
          {isLocking ? 'Locking...' : 'Lock System'}
        </Button>
      </div>

      {/* Validation Report */}
      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Validations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Validations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {report.roleValidations.map((rv) => (
                    <RoleValidationItem key={rv.role} validation={rv} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* UI Consistency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                UI Consistency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ValidationResultList results={report.uiConsistency} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Module Isolation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Module Isolation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ValidationResultList results={report.moduleIsolation} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Security Checks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ValidationResultList results={report.securityChecks} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Functional Locks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Functional Locks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ValidationResultList results={report.functionalLocks} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ValidationResultList results={report.performanceMetrics} />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Status Summary */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              System Status Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatusCard
                label="Overall Status"
                value={report.overallStatus.toUpperCase()}
                variant={report.overallStatus === 'passed' ? 'success' : report.overallStatus === 'warnings' ? 'warning' : 'error'}
              />
              <StatusCard
                label="Roles Validated"
                value={`${report.roleValidations.filter(r => r.overallPassed).length}/${report.roleValidations.length}`}
                variant="info"
              />
              <StatusCard
                label="System Lock"
                value={report.isLocked ? 'LOCKED' : 'UNLOCKED'}
                variant={report.isLocked ? 'success' : 'warning'}
              />
              <StatusCard
                label="Version"
                value="1.0.0"
                variant="info"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RoleValidationItem({ validation }: { validation: RoleValidation }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        {validation.overallPassed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium capitalize">{validation.role.replace('_', ' ')}</span>
      </div>
      <Badge variant={validation.overallPassed ? 'default' : 'destructive'}>
        {validation.overallPassed ? 'Passed' : 'Failed'}
      </Badge>
    </div>
  );
}

function ValidationResultList({ results }: { results: ValidationResult[] }) {
  return (
    <div className="space-y-2">
      {results.map((result, index) => (
        <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
          <div className="flex items-center gap-2">
            {result.passed ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : result.severity === 'critical' ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-sm">{result.check}</span>
          </div>
          <Badge 
            variant="outline" 
            className={
              result.passed 
                ? 'border-green-500 text-green-500' 
                : result.severity === 'critical' 
                  ? 'border-red-500 text-red-500'
                  : 'border-yellow-500 text-yellow-500'
            }
          >
            {result.passed ? 'Pass' : result.severity}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function StatusCard({ 
  label, 
  value, 
  variant 
}: { 
  label: string; 
  value: string; 
  variant: 'success' | 'warning' | 'error' | 'info';
}) {
  const colorMap = {
    success: 'text-green-500 border-green-500/30 bg-green-500/10',
    warning: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10',
    error: 'text-red-500 border-red-500/30 bg-red-500/10',
    info: 'text-blue-500 border-blue-500/30 bg-blue-500/10'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorMap[variant]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
