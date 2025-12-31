import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Globe,
  Users,
  Share2,
  Store,
  Code,
  TrendingUp,
  TrendingDown,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SourceMetric {
  source: 'frontend' | 'reseller' | 'influencer' | 'franchise' | 'api';
  icon: React.ReactNode;
  totalLeads: number;
  qualified: number;
  converted: number;
  rejected: number;
  qualityScore: number;
  trend: 'up' | 'down' | 'stable';
  conversionRate: number;
}

const mockSources: SourceMetric[] = [
  {
    source: 'frontend',
    icon: <Globe className="h-4 w-4" />,
    totalLeads: 245,
    qualified: 198,
    converted: 67,
    rejected: 47,
    qualityScore: 82,
    trend: 'up',
    conversionRate: 33.8
  },
  {
    source: 'reseller',
    icon: <Share2 className="h-4 w-4" />,
    totalLeads: 156,
    qualified: 142,
    converted: 89,
    rejected: 14,
    qualityScore: 94,
    trend: 'up',
    conversionRate: 62.7
  },
  {
    source: 'influencer',
    icon: <Users className="h-4 w-4" />,
    totalLeads: 312,
    qualified: 187,
    converted: 45,
    rejected: 125,
    qualityScore: 58,
    trend: 'down',
    conversionRate: 24.1
  },
  {
    source: 'franchise',
    icon: <Store className="h-4 w-4" />,
    totalLeads: 89,
    qualified: 85,
    converted: 52,
    rejected: 4,
    qualityScore: 96,
    trend: 'stable',
    conversionRate: 61.2
  },
  {
    source: 'api',
    icon: <Code className="h-4 w-4" />,
    totalLeads: 178,
    qualified: 134,
    converted: 41,
    rejected: 44,
    qualityScore: 71,
    trend: 'up',
    conversionRate: 30.6
  }
];

const getSourceColor = (source: string) => {
  const colors: Record<string, string> = {
    frontend: 'text-blue-400',
    reseller: 'text-green-400',
    influencer: 'text-purple-400',
    franchise: 'text-orange-400',
    api: 'text-cyan-400'
  };
  return colors[source] || 'text-gray-400';
};

const getQualityColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
  }
};

export const LMSourceBreakdown: React.FC = () => {
  const totalLeads = mockSources.reduce((acc, s) => acc + s.totalLeads, 0);
  const totalConverted = mockSources.reduce((acc, s) => acc + s.converted, 0);
  const avgQuality = Math.round(
    mockSources.reduce((acc, s) => acc + s.qualityScore, 0) / mockSources.length
  );

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Lead Source Breakdown
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Read-Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-2 text-center">
            <p className="text-xl font-bold">{totalLeads}</p>
            <p className="text-xs text-muted-foreground">Total Leads</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-green-400">{totalConverted}</p>
            <p className="text-xs text-muted-foreground">Converted</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
            <p className="text-xl font-bold text-blue-400">{avgQuality}%</p>
            <p className="text-xs text-muted-foreground">Avg Quality</p>
          </div>
        </div>

        {/* Source List */}
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
          {mockSources.map((source, index) => (
            <motion.div
              key={source.source}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-muted/30 border border-border/50 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={getSourceColor(source.source)}>{source.icon}</span>
                  <span className="font-medium text-sm capitalize">{source.source}</span>
                  {getTrendIcon(source.trend)}
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {source.totalLeads} leads
                </Badge>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Quality Score</span>
                    <span className={`font-mono ${
                      source.qualityScore >= 80 ? 'text-green-400' :
                      source.qualityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{source.qualityScore}%</span>
                  </div>
                  <Progress 
                    value={source.qualityScore} 
                    className="h-1.5"
                  />
                </div>

                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div className="text-center">
                    <p className="text-muted-foreground">Qualified</p>
                    <p className="font-medium text-blue-400">{source.qualified}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Converted</p>
                    <p className="font-medium text-green-400">{source.converted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Rejected</p>
                    <p className="font-medium text-red-400">{source.rejected}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Conv %</p>
                    <p className="font-medium">{source.conversionRate}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            Source auto-tag mandatory • Lead quality &gt; quantity
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
