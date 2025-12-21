import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, TrendingDown, Activity, Target,
  AlertTriangle, Zap, BarChart3, LineChart, PieChart,
  ArrowUpRight, ArrowDownRight, RefreshCw, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Prediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface AnomalyAlert {
  id: string;
  metric: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  detectedAt: Date;
  value: number;
  expectedRange: [number, number];
}

const mockPredictions: Prediction[] = [
  {
    id: '1',
    metric: 'Lead Conversion Rate',
    currentValue: 23.5,
    predictedValue: 28.2,
    confidence: 87,
    trend: 'up',
    timeframe: '7 days',
    impact: 'high',
    recommendation: 'Increase demo capacity to handle predicted surge',
  },
  {
    id: '2',
    metric: 'Developer Task Queue',
    currentValue: 45,
    predictedValue: 72,
    confidence: 92,
    trend: 'up',
    timeframe: '48 hours',
    impact: 'high',
    recommendation: 'Consider hiring or reallocating developers',
  },
  {
    id: '3',
    metric: 'Support Ticket Volume',
    currentValue: 156,
    predictedValue: 134,
    confidence: 78,
    trend: 'down',
    timeframe: '14 days',
    impact: 'medium',
    recommendation: 'Optimize support team schedule for lower volume',
  },
  {
    id: '4',
    metric: 'Revenue (₹ Lakhs)',
    currentValue: 45.2,
    predictedValue: 52.8,
    confidence: 81,
    trend: 'up',
    timeframe: '30 days',
    impact: 'high',
    recommendation: 'Prepare finance team for higher payouts',
  },
  {
    id: '5',
    metric: 'Churn Risk',
    currentValue: 8.2,
    predictedValue: 6.5,
    confidence: 74,
    trend: 'down',
    timeframe: '30 days',
    impact: 'medium',
    recommendation: 'Continue current retention initiatives',
  },
];

const mockAnomalies: AnomalyAlert[] = [
  {
    id: '1',
    metric: 'API Response Time',
    severity: 'warning',
    message: 'Response time 40% above normal',
    detectedAt: new Date(Date.now() - 300000),
    value: 420,
    expectedRange: [200, 300],
  },
  {
    id: '2',
    metric: 'Login Attempts',
    severity: 'critical',
    message: 'Unusual spike in failed logins detected',
    detectedAt: new Date(Date.now() - 600000),
    value: 847,
    expectedRange: [50, 150],
  },
];

export function PredictiveAnalyticsEngine() {
  const [predictions, setPredictions] = useState<Prediction[]>(mockPredictions);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(mockAnomalies);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modelAccuracy, setModelAccuracy] = useState(94.2);

  const refreshPredictions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setModelAccuracy(prev => Math.min(99, prev + Math.random() * 0.5));
    }, 2000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/50';
      case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/50';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/50';
      default: return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-500';
      case 'warning': return 'bg-orange-500/20 border-orange-500/50 text-orange-500';
      case 'info': return 'bg-blue-500/20 border-blue-500/50 text-blue-500';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Predictive Analytics Engine
          </h2>
          <p className="text-sm text-muted-foreground">AI-powered forecasting & anomaly detection</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary">{modelAccuracy.toFixed(1)}% Model Accuracy</span>
          </div>
          <Button variant="outline" onClick={refreshPredictions} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing && 'animate-spin'}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Anomaly Alerts */}
      {anomalies.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            AI Anomaly Detection
          </h3>
          {anomalies.map((anomaly, index) => (
            <motion.div
              key={anomaly.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${getSeverityColor(anomaly.severity)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{anomaly.metric}</span>
                      <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-80">{anomaly.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg">{anomaly.value}</p>
                  <p className="text-xs opacity-60">
                    Expected: {anomaly.expectedRange[0]}-{anomaly.expectedRange[1]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Predictions Grid */}
      <div className="grid gap-4">
        {predictions.map((prediction, index) => {
          const change = ((prediction.predictedValue - prediction.currentValue) / prediction.currentValue * 100);
          const isPositive = prediction.trend === 'up' && prediction.metric !== 'Churn Risk';
          
          return (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-foreground">{prediction.metric}</h3>
                    <Badge variant="outline" className={getImpactColor(prediction.impact)}>
                      {prediction.impact} impact
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-xl font-mono font-bold text-foreground">
                        {prediction.currentValue}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {prediction.trend === 'up' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                      <span className="font-mono">{Math.abs(change).toFixed(1)}%</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Predicted ({prediction.timeframe})</p>
                      <p className="text-xl font-mono font-bold text-primary">
                        {prediction.predictedValue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <Progress value={prediction.confidence} className="flex-1 h-2" />
                    <span className="text-xs font-mono text-primary">{prediction.confidence}%</span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary">💡 Recommendation:</span> {prediction.recommendation}
                  </p>
                </div>

                <div className="w-24 h-24 flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-border"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={`${prediction.confidence * 2.2} 220`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {prediction.trend === 'up' ? (
                        <TrendingUp className={`w-6 h-6 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                      ) : (
                        <TrendingDown className={`w-6 h-6 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default PredictiveAnalyticsEngine;
