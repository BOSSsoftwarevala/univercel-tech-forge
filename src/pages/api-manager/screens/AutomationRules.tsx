import React from 'react';
import { Zap, Plus, Pause, Play, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AutomationRules: React.FC = () => {
  const rules = [
    { 
      id: 'RULE-001',
      trigger: 'New Lead Created',
      condition: 'Lead score > 80',
      action: 'Auto-assign to top franchise',
      status: 'active'
    },
    { 
      id: 'RULE-002',
      trigger: 'API Error Rate > 5%',
      condition: 'Sustained for 5 minutes',
      action: 'Alert + Scale up instances',
      status: 'active'
    },
    { 
      id: 'RULE-003',
      trigger: 'AI Cost > $50/hour',
      condition: 'Any model',
      action: 'Throttle requests + Alert',
      status: 'active'
    },
    { 
      id: 'RULE-004',
      trigger: 'User Inactivity',
      condition: '> 30 days',
      action: 'Send re-engagement email',
      status: 'paused'
    },
    { 
      id: 'RULE-005',
      trigger: 'Payment Failed',
      condition: 'Any subscription',
      action: 'Retry + Alert support',
      status: 'active'
    },
  ];

  const ruleStats = [
    { label: 'Active Rules', value: 4, color: 'text-green-400' },
    { label: 'Paused', value: 1, color: 'text-yellow-400' },
    { label: 'Triggered Today', value: 156, color: 'text-blue-400' },
    { label: 'Failed Executions', value: 2, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Automation Rules</h2>
          <p className="text-muted-foreground">Configure automated workflows and triggers</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Rule (Approval Required)
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {ruleStats.map((stat, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rules Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Automation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 bg-muted/30 rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">{rule.id}</span>
                    <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                      {rule.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {rule.status === 'active' ? (
                      <Button size="sm" variant="outline" className="text-yellow-400 border-yellow-400/50">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-green-400 border-green-400/50">
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Trigger</p>
                    <p className="text-foreground">{rule.trigger}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Condition</p>
                    <p className="text-foreground">{rule.condition}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Action</p>
                    <p className="text-foreground">{rule.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationRules;
