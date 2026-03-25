// Continent Super Admin - AI Insights Screen (Read-Only)
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AIInsightsView = () => {
  const insights = [
    {
      id: '1',
      type: 'Risk Prediction',
      title: 'Egypt Region At Risk',
      description: 'Based on current trends, Egypt region may miss Q4 targets by 15%. Recommend additional support.',
      confidence: 87,
      severity: 'High',
      icon: AlertTriangle,
    },
    {
      id: '2',
      type: 'Growth Opportunity',
      title: 'Kenya Market Expansion',
      description: 'AI analysis suggests 40% growth potential in Kenya with targeted marketing in urban areas.',
      confidence: 92,
      severity: 'Positive',
      icon: TrendingUp,
    },
    {
      id: '3',
      type: 'Performance Insight',
      title: 'South Africa Exceeding Targets',
      description: 'South Africa consistently outperforming by 12%. Consider replicating strategies across continent.',
      confidence: 95,
      severity: 'Positive',
      icon: TrendingUp,
    },
    {
      id: '4',
      type: 'Risk Prediction',
      title: 'SLA Breach Pattern Detected',
      description: 'Ghana region showing increasing SLA breaches. Pattern suggests resource allocation issues.',
      confidence: 78,
      severity: 'Medium',
      icon: AlertTriangle,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'border-red-500/30 bg-red-500/5';
      case 'Medium': return 'border-amber-500/30 bg-amber-500/5';
      case 'Positive': return 'border-emerald-500/30 bg-emerald-500/5';
      default: return 'border-border';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-500';
    if (confidence >= 80) return 'text-blue-500';
    return 'text-amber-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
        <p className="text-muted-foreground">AI-powered predictions and recommendations (Read-Only)</p>
      </div>

      {/* AI Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-purple-500/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-500">4</p>
              <p className="text-sm text-muted-foreground">Active Insights</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-lg">
              <p className="text-2xl font-bold text-emerald-500">2</p>
              <p className="text-sm text-muted-foreground">Growth Opportunities</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg">
              <p className="text-2xl font-bold text-amber-500">2</p>
              <p className="text-sm text-muted-foreground">Risk Predictions</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">88%</p>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-card border ${getSeverityColor(insight.severity)}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <insight.icon className={`h-5 w-5 ${
                      insight.severity === 'Positive' ? 'text-emerald-500' : 
                      insight.severity === 'High' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <Badge variant="secondary">{insight.type}</Badge>
                  </div>
                  <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}% confidence
                  </span>
                </div>
                <CardTitle className="text-lg text-foreground mt-2">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{insight.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-border">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Acknowledge
                  </Button>
                  <Button size="sm" variant="outline" className="border-border">
                    <Eye className="h-3 w-3 mr-1" />
                    View Context
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsView;
