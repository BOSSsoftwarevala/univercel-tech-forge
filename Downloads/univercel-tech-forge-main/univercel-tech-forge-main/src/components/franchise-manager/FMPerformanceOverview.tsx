import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart3, TrendingUp, TrendingDown, Target, Users, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface FranchisePerformance {
  id: string;
  franchiseName: string;
  franchiseCode: string;
  territory: string;
  leadQuality: number;
  conversionContribution: number;
  slaAdherence: number;
  complaintRate: number;
  trend: 'up' | 'down' | 'stable';
  ranking: number;
}

const mockPerformance: FranchisePerformance[] = [
  {
    id: 'FP-001',
    franchiseName: 'TechVentures Mumbai',
    franchiseCode: 'MUM-CENT-001',
    territory: 'Mumbai Central',
    leadQuality: 87,
    conversionContribution: 23,
    slaAdherence: 94,
    complaintRate: 2,
    trend: 'up',
    ranking: 1
  },
  {
    id: 'FP-002',
    franchiseName: 'Digital Dynamics Delhi',
    franchiseCode: 'DEL-NOR-002',
    territory: 'Delhi North',
    leadQuality: 72,
    conversionContribution: 18,
    slaAdherence: 88,
    complaintRate: 5,
    trend: 'stable',
    ranking: 2
  },
  {
    id: 'FP-003',
    franchiseName: 'SaaS Solutions Bangalore',
    franchiseCode: 'BLR-EAST-003',
    territory: 'Bangalore East',
    leadQuality: 45,
    conversionContribution: 8,
    slaAdherence: 62,
    complaintRate: 12,
    trend: 'down',
    ranking: 3
  }
];

const overallStats = {
  totalFranchises: 3,
  activeFranchises: 2,
  avgLeadQuality: 68,
  avgConversion: 16,
  avgSLA: 81,
  avgComplaints: 6
};

export function FMPerformanceOverview() {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'stable':
        return <Target className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number, inverse = false) => {
    if (inverse) {
      if (score <= 3) return 'text-green-400';
      if (score <= 7) return 'text-yellow-400';
      return 'text-destructive';
    }
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-destructive';
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
          <Badge variant="outline" className="bg-muted/50 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            READ-ONLY
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center"
          >
            <div className="text-2xl font-bold text-primary">{overallStats.totalFranchises}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center"
          >
            <div className="text-2xl font-bold text-green-400">{overallStats.activeFranchises}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center"
          >
            <div className={`text-2xl font-bold ${getScoreColor(overallStats.avgLeadQuality)}`}>
              {overallStats.avgLeadQuality}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Lead Quality</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center"
          >
            <div className={`text-2xl font-bold ${getScoreColor(overallStats.avgConversion)}`}>
              {overallStats.avgConversion}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Conversion</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center"
          >
            <div className={`text-2xl font-bold ${getScoreColor(overallStats.avgSLA)}`}>
              {overallStats.avgSLA}%
            </div>
            <div className="text-xs text-muted-foreground">Avg SLA</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center"
          >
            <div className={`text-2xl font-bold ${getScoreColor(overallStats.avgComplaints, true)}`}>
              {overallStats.avgComplaints}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Complaints</div>
          </motion.div>
        </div>

        {/* Individual Franchise Performance */}
        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {mockPerformance.map((perf, index) => (
              <motion.div
                key={perf.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-border/50 bg-background/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      #{perf.ranking}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{perf.franchiseName}</span>
                        <Badge variant="outline" className="text-xs">{perf.franchiseCode}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{perf.territory}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(perf.trend)}
                    <span className="text-xs text-muted-foreground capitalize">{perf.trend}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Lead Quality</span>
                      <span className={`font-medium ${getScoreColor(perf.leadQuality)}`}>
                        {perf.leadQuality}%
                      </span>
                    </div>
                    <Progress 
                      value={perf.leadQuality} 
                      className={`h-2 ${perf.leadQuality >= 80 ? '[&>div]:bg-green-500' : perf.leadQuality >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-destructive'}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Conversion</span>
                      <span className="font-medium">{perf.conversionContribution}%</span>
                    </div>
                    <Progress value={perf.conversionContribution} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">SLA Adherence</span>
                      <span className={`font-medium ${getScoreColor(perf.slaAdherence)}`}>
                        {perf.slaAdherence}%
                      </span>
                    </div>
                    <Progress 
                      value={perf.slaAdherence} 
                      className={`h-2 ${perf.slaAdherence >= 80 ? '[&>div]:bg-green-500' : perf.slaAdherence >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-destructive'}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Complaints</span>
                      <span className={`font-medium ${getScoreColor(perf.complaintRate, true)}`}>
                        {perf.complaintRate}%
                      </span>
                    </div>
                    <Progress 
                      value={perf.complaintRate * 10} 
                      className={`h-2 ${perf.complaintRate <= 3 ? '[&>div]:bg-green-500' : perf.complaintRate <= 7 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-destructive'}`}
                    />
                  </div>
                </div>

                {perf.complaintRate > 7 && (
                  <div className="mt-3 p-2 rounded bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      High complaint rate - requires attention
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Performance data is read-only. Edit operations are blocked.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
