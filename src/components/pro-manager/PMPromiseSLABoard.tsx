import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ArrowUpRight,
  Timer,
  Shield,
  FileText,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PromiseSLA {
  id: string;
  promiseCode: string;
  taskId: string;
  developerId: string;
  deadline: string;
  hoursRemaining: number;
  status: 'on_track' | 'near_breach' | 'breached';
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: string;
}

const mockPromises: PromiseSLA[] = [
  {
    id: 'PS-001',
    promiseCode: 'PRM-2035-0891',
    taskId: 'TSK-4521',
    developerId: 'DEV-7823',
    deadline: '2035-01-15 14:00',
    hoursRemaining: 2,
    status: 'near_breach',
    priority: 'critical',
    type: 'Feature Delivery'
  },
  {
    id: 'PS-002',
    promiseCode: 'PRM-2035-0892',
    taskId: 'TSK-4522',
    developerId: 'DEV-7824',
    deadline: '2035-01-15 18:00',
    hoursRemaining: -4,
    status: 'breached',
    priority: 'high',
    type: 'Bug Fix'
  },
  {
    id: 'PS-003',
    promiseCode: 'PRM-2035-0893',
    taskId: 'TSK-4523',
    developerId: 'DEV-7825',
    deadline: '2035-01-16 10:00',
    hoursRemaining: 18,
    status: 'on_track',
    priority: 'medium',
    type: 'Code Review'
  },
  {
    id: 'PS-004',
    promiseCode: 'PRM-2035-0894',
    taskId: 'TSK-4524',
    developerId: 'DEV-7826',
    deadline: '2035-01-15 16:00',
    hoursRemaining: 4,
    status: 'near_breach',
    priority: 'high',
    type: 'Integration'
  },
  {
    id: 'PS-005',
    promiseCode: 'PRM-2035-0895',
    taskId: 'TSK-4525',
    developerId: 'DEV-7827',
    deadline: '2035-01-14 12:00',
    hoursRemaining: -8,
    status: 'breached',
    priority: 'critical',
    type: 'Security Patch'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'on_track':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">On Track</Badge>;
    case 'near_breach':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Near Breach</Badge>;
    case 'breached':
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Breached</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>;
    case 'medium':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Medium</Badge>;
    default:
      return <Badge variant="outline">Low</Badge>;
  }
};

export const PMPromiseSLABoard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'near_breach' | 'breached'>('all');

  const filteredPromises = mockPromises.filter(p => 
    filter === 'all' || p.status === filter
  );

  const handleRecommendExtension = (promise: PromiseSLA) => {
    toast.success(`Extension recommended for ${promise.promiseCode}`, {
      description: 'Recommendation forwarded to Dev Manager for review'
    });
    console.log('[PRO-MANAGER] Extension recommended:', promise.id);
  };

  const handleRequestCorrection = (promise: PromiseSLA) => {
    toast.info(`Correction requested for ${promise.promiseCode}`, {
      description: 'Request sent to assigned developer'
    });
    console.log('[PRO-MANAGER] Correction requested:', promise.id);
  };

  const handleEscalate = (promise: PromiseSLA) => {
    toast.warning(`Escalating ${promise.promiseCode}`, {
      description: 'Forwarded to Master Admin with evidence'
    });
    console.log('[PRO-MANAGER] Escalated:', promise.id);
  };

  const nearBreachCount = mockPromises.filter(p => p.status === 'near_breach').length;
  const breachedCount = mockPromises.filter(p => p.status === 'breached').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Promise & SLA Risk Board
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            READ-ONLY VIEW
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-400">{nearBreachCount}</p>
                <p className="text-xs text-muted-foreground">Near Breach</p>
              </div>
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-400">{breachedCount}</p>
                <p className="text-xs text-muted-foreground">Breached</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'near_breach' ? 'default' : 'outline'}
            onClick={() => setFilter('near_breach')}
          >
            Near Breach
          </Button>
          <Button
            size="sm"
            variant={filter === 'breached' ? 'default' : 'outline'}
            onClick={() => setFilter('breached')}
          >
            Breached
          </Button>
        </div>

        {/* Promise List */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {filteredPromises.map((promise, index) => (
            <motion.div
              key={promise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-3 ${
                promise.status === 'breached' 
                  ? 'bg-red-500/5 border-red-500/30' 
                  : promise.status === 'near_breach'
                  ? 'bg-yellow-500/5 border-yellow-500/30'
                  : 'bg-muted/30 border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">{promise.promiseCode}</span>
                    {getStatusBadge(promise.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {promise.type} • Task: {promise.taskId}
                  </p>
                </div>
                {getPriorityBadge(promise.priority)}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {promise.deadline}
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {promise.hoursRemaining > 0 
                    ? `${promise.hoursRemaining}h remaining` 
                    : `${Math.abs(promise.hoursRemaining)}h overdue`}
                </span>
              </div>

              {/* Action Buttons - Recommend/Request/Escalate Only */}
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7"
                  onClick={() => handleRecommendExtension(promise)}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Recommend Extension
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7"
                  onClick={() => handleRequestCorrection(promise)}
                >
                  <ChevronRight className="h-3 w-3 mr-1" />
                  Request Correction
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-xs h-7"
                  onClick={() => handleEscalate(promise)}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Escalate
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Direct edit FORBIDDEN • Recommend/Request/Escalate only
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
