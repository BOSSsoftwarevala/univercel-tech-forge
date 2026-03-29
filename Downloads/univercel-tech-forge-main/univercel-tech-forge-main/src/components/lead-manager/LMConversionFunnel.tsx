import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ArrowDown,
  Inbox,
  CheckCircle,
  UserPlus,
  CreditCard,
  Ban,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FunnelStage {
  stage: string;
  icon: React.ReactNode;
  count: number;
  percentage: number;
  dropOff: number;
  color: string;
}

const mockFunnel: FunnelStage[] = [
  {
    stage: 'New Leads',
    icon: <Inbox className="h-5 w-5" />,
    count: 980,
    percentage: 100,
    dropOff: 0,
    color: 'bg-blue-500'
  },
  {
    stage: 'Qualified',
    icon: <CheckCircle className="h-5 w-5" />,
    count: 746,
    percentage: 76.1,
    dropOff: 23.9,
    color: 'bg-cyan-500'
  },
  {
    stage: 'Assigned',
    icon: <UserPlus className="h-5 w-5" />,
    count: 698,
    percentage: 71.2,
    dropOff: 6.4,
    color: 'bg-purple-500'
  },
  {
    stage: 'Converted',
    icon: <CreditCard className="h-5 w-5" />,
    count: 294,
    percentage: 30.0,
    dropOff: 57.8,
    color: 'bg-green-500'
  },
  {
    stage: 'Rejected',
    icon: <Ban className="h-5 w-5" />,
    count: 234,
    percentage: 23.9,
    dropOff: 0,
    color: 'bg-red-500'
  }
];

export const LMConversionFunnel: React.FC = () => {
  const overallConversion = mockFunnel.find(s => s.stage === 'Converted')?.percentage || 0;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Conversion Funnel
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            {overallConversion}% Overall
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Funnel Visualization */}
        <div className="space-y-1">
          {mockFunnel.filter(s => s.stage !== 'Rejected').map((stage, index) => {
            const widthPercentage = Math.max(30, stage.percentage);
            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className={`${stage.color} rounded-lg p-3 transition-all duration-300`}
                  style={{ width: `${widthPercentage}%`, marginLeft: `${(100 - widthPercentage) / 2}%` }}
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      {stage.icon}
                      <span className="font-medium text-sm">{stage.stage}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{stage.count}</span>
                      <span className="text-xs ml-1 opacity-80">({stage.percentage}%)</span>
                    </div>
                  </div>
                </div>
                {index < mockFunnel.filter(s => s.stage !== 'Rejected').length - 1 && stage.dropOff > 0 && (
                  <div className="flex items-center justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-red-400 ml-1">-{stage.dropOff}%</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Status Flow Reminder */}
        <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
          <p className="text-xs font-medium text-center mb-2">Locked Status Flow</p>
          <div className="flex items-center justify-center gap-1 text-xs">
            <Badge variant="outline" className="text-xs">New</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline" className="text-xs">Qualified</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline" className="text-xs">Assigned</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Converted</Badge>
            <span className="text-muted-foreground">/</span>
            <Badge variant="destructive" className="text-xs">Rejected</Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-blue-400">76%</p>
            <p className="text-xs text-muted-foreground">Qualification Rate</p>
          </div>
          <div className="bg-muted/30 border border-border/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-purple-400">42%</p>
            <p className="text-xs text-muted-foreground">Assign-to-Convert</p>
          </div>
          <div className="bg-muted/30 border border-border/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-400">30%</p>
            <p className="text-xs text-muted-foreground">Overall Conversion</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Skip NOT allowed • Conversion requires payment proof
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
