/**
 * TASK MANAGER - TASK REVIEW
 * Quality Review • SLA Review • Outcome Review
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCheck, CheckCircle, RefreshCw, ArrowUpCircle, Star, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const reviews = [
  { id: 'REV-001', task: 'Customer onboarding complete', successScore: 95, riskLevel: 'Low', type: 'quality' },
  { id: 'REV-002', task: 'Payment processing batch', successScore: 87, riskLevel: 'Medium', type: 'sla' },
  { id: 'REV-003', task: 'License renewal automation', successScore: 92, riskLevel: 'Low', type: 'outcome' },
  { id: 'REV-004', task: 'Server maintenance window', successScore: 78, riskLevel: 'High', type: 'quality' },
  { id: 'REV-005', task: 'Data sync verification', successScore: 100, riskLevel: 'None', type: 'outcome' },
];

export const TMTaskReview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quality');

  const filteredReviews = reviews.filter(r => r.type === activeTab);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'None': return 'bg-green-500/20 text-green-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'High': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Review</h1>
          <p className="text-muted-foreground">Quality assurance and outcome verification</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="quality">Quality Review</TabsTrigger>
            <TabsTrigger value="sla">SLA Review</TabsTrigger>
            <TabsTrigger value="outcome">Outcome Review</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredReviews.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.id}</p>
                            <Badge className={getRiskColor(item.riskLevel)}>{item.riskLevel} Risk</Badge>
                          </div>
                          <p className="text-sm text-foreground">{item.task}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Success Score:</span>
                            <Progress value={item.successScore} className="w-24 h-2" />
                            <span className="text-xs text-foreground">{item.successScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Passed
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Rework
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ArrowUpCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TMTaskReview;
