/**
 * PROMISES & SLA SCREEN
 * Promises Given/Received, Deadlines, Risk Levels, Escalation
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  Eye,
  Calendar,
} from 'lucide-react';

const promisesGiven = [
  {
    id: 'PG-001',
    description: 'Deliver School Software to ABC Client',
    deadline: '2024-01-20',
    daysLeft: 5,
    risk: 'low',
    progress: 80,
  },
  {
    id: 'PG-002',
    description: 'Complete CRM customization',
    deadline: '2024-01-18',
    daysLeft: 3,
    risk: 'medium',
    progress: 45,
  },
  {
    id: 'PG-003',
    description: 'Training session for ERP client',
    deadline: '2024-01-16',
    daysLeft: 1,
    risk: 'high',
    progress: 20,
  },
];

const promisesReceived = [
  {
    id: 'PR-001',
    from: 'Software Vala HQ',
    description: 'API integration support',
    deadline: '2024-01-22',
    status: 'on_track',
  },
  {
    id: 'PR-002',
    from: 'Technical Team',
    description: 'Bug fix for order module',
    deadline: '2024-01-17',
    status: 'delayed',
  },
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low':
      return 'bg-emerald-500/20 text-emerald-400';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'high':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function FOPromisesSLAScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Promises & SLA</h1>
        <p className="text-muted-foreground">Track commitments and service level agreements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Promises</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">On Track</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">At Risk</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Critical</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="given" className="space-y-4">
        <TabsList>
          <TabsTrigger value="given">Promises Given</TabsTrigger>
          <TabsTrigger value="received">Promises Received</TabsTrigger>
        </TabsList>

        <TabsContent value="given" className="space-y-4">
          {promisesGiven.map((promise) => (
            <Card key={promise.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm">{promise.id}</span>
                      <Badge className={getRiskColor(promise.risk)}>
                        {promise.risk} risk
                      </Badge>
                    </div>
                    <p className="font-semibold">{promise.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Deadline: {promise.deadline}
                      <Badge variant="outline" className="ml-2">
                        {promise.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    {promise.risk === 'high' && (
                      <Button size="sm" variant="destructive" className="gap-1">
                        <ArrowUp className="h-3 w-3" />
                        Escalate
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{promise.progress}%</span>
                  </div>
                  <Progress value={promise.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {promisesReceived.map((promise) => (
            <Card key={promise.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{promise.id}</span>
                        <Badge
                          className={
                            promise.status === 'on_track'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {promise.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="font-semibold">{promise.description}</p>
                      <p className="text-xs text-muted-foreground">
                        From: {promise.from} • Deadline: {promise.deadline}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOPromisesSLAScreen;
