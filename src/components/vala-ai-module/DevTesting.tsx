/**
 * DEV TESTING
 * AI-powered automated testing
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube, 
  Play,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bot,
  Loader2,
  MousePointer,
  Route,
  Plug,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  category: string;
  icon: React.ElementType;
  passed: number;
  failed: number;
  total: number;
  status: 'passed' | 'failed' | 'running' | 'pending';
}

const testCategories: TestResult[] = [
  { id: 'buttons', category: 'All Buttons', icon: MousePointer, passed: 127, failed: 0, total: 127, status: 'passed' },
  { id: 'flows', category: 'All Flows', icon: Route, passed: 43, failed: 2, total: 45, status: 'failed' },
  { id: 'apis', category: 'All APIs', icon: Plug, passed: 89, failed: 0, total: 89, status: 'passed' },
  { id: 'permissions', category: 'Permissions', icon: Shield, passed: 56, failed: 0, total: 56, status: 'passed' },
];

export const DevTesting: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>(testCategories);

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate test run
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(i);
    }
    
    setIsRunning(false);
    toast.success('All tests completed!');
  };

  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TestTube className="w-5 h-5 text-cyan-400" />
            Testing
          </h1>
          <p className="text-sm text-muted-foreground">AI-powered automated testing</p>
        </div>
        <Button 
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run All Tests
            </>
          )}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold text-foreground">{totalTests}</p>
              </div>
              <TestTube className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-emerald-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-emerald-400">{totalPassed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card className={cn("bg-card/80", totalFailed > 0 ? "border-red-500/30" : "border-border/50")}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className={cn("text-2xl font-bold", totalFailed > 0 ? "text-red-400" : "text-foreground")}>{totalFailed}</p>
              </div>
              <XCircle className={cn("w-8 h-8", totalFailed > 0 ? "text-red-400" : "text-muted-foreground")} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Running Progress */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card/80 border-cyan-500/30">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-5 h-5 text-cyan-400" />
                <span className="font-medium text-foreground">AI Testing in Progress...</span>
                <span className="ml-auto text-lg font-bold text-cyan-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Test Categories */}
      <div className="space-y-4">
        {results.map((test, index) => {
          const Icon = test.icon;
          const passRate = (test.passed / test.total) * 100;
          
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "bg-card/80",
                test.status === 'passed' ? "border-emerald-500/30" :
                test.status === 'failed' ? "border-red-500/30" : "border-border/50"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        test.status === 'passed' ? "bg-emerald-500/20" :
                        test.status === 'failed' ? "bg-red-500/20" : "bg-muted/50"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          test.status === 'passed' ? "text-emerald-400" :
                          test.status === 'failed' ? "text-red-400" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{test.category}</p>
                        <p className="text-xs text-muted-foreground">{test.passed} passed, {test.failed} failed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "text-xs",
                        test.status === 'passed' ? "bg-emerald-500/20 text-emerald-400" :
                        test.status === 'failed' ? "bg-red-500/20 text-red-400" : "bg-muted/50 text-muted-foreground"
                      )}>
                        {test.status === 'passed' ? 'Pass' : test.status === 'failed' ? 'Fail' : 'Pending'}
                      </Badge>
                      {test.failed > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 text-primary">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Auto Re-fix
                        </Button>
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={passRate} 
                    className={cn("h-2", test.status === 'failed' && "[&>div]:bg-red-500")}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
