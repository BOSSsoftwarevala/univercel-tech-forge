import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, AlertTriangle, TrendingUp, Eye, Activity,
  Zap, Shield, Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Types
export interface AIAlert {
  id: string;
  timestamp: Date;
  type: 'anomaly' | 'pattern' | 'threat' | 'behavior';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  actor?: string;
  confidence: number;
  acknowledged: boolean;
}

interface AIWatcherContextType {
  alerts: AIAlert[];
  isWatching: boolean;
  confidenceScore: number;
  acknowledgeAlert: (id: string) => void;
}

// Context
const AIWatcherContext = createContext<AIWatcherContextType | null>(null);

export const useAIWatcher = () => {
  const context = useContext(AIWatcherContext);
  if (!context) throw new Error('useAIWatcher must be used within AIWatcherProvider');
  return context;
};

// Generate mock alerts
const generateMockAlerts = (): AIAlert[] => [
  { id: 'AI-001', timestamp: new Date(Date.now() - 60000), type: 'anomaly', severity: 'high', message: 'Unusual login pattern detected for SA-0012', actor: 'SA-0012', confidence: 87, acknowledged: false },
  { id: 'AI-002', timestamp: new Date(Date.now() - 120000), type: 'behavior', severity: 'medium', message: 'Elevated API request rate from Mumbai region', confidence: 72, acknowledged: true },
  { id: 'AI-003', timestamp: new Date(Date.now() - 180000), type: 'threat', severity: 'critical', message: 'Potential credential stuffing attempt', actor: 'Unknown', confidence: 94, acknowledged: false },
  { id: 'AI-004', timestamp: new Date(Date.now() - 240000), type: 'pattern', severity: 'low', message: 'New device fingerprint for existing user', actor: 'User-4521', confidence: 65, acknowledged: true },
];

// Provider
export function AIWatcherProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AIAlert[]>(generateMockAlerts);
  const [isWatching, setIsWatching] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(92);

  useEffect(() => {
    const interval = setInterval(() => {
      setConfidenceScore(prev => Math.min(100, Math.max(85, prev + (Math.random() - 0.5) * 3)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  return (
    <AIWatcherContext.Provider value={{ alerts, isWatching, confidenceScore, acknowledgeAlert }}>
      {children}
    </AIWatcherContext.Provider>
  );
}

// AI Watcher Panel
export function AIWatcherPanel() {
  const { alerts, isWatching, confidenceScore } = useAIWatcher();
  const unacknowledged = alerts.filter(a => !a.acknowledged);

  return (
    <Card className="relative bg-gradient-to-br from-purple-950/80 to-indigo-950/80 border-purple-500/20 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            {isWatching && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400 animate-pulse" />}
          </div>
          <div>
            <h3 className="font-bold text-purple-300">AI WATCHER</h3>
            <p className="text-[10px] text-purple-400/60">Behavioral Analysis Engine</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-purple-400/60">Confidence</p>
          <p className="text-lg font-bold text-purple-300">{confidenceScore.toFixed(0)}%</p>
        </div>
      </div>

      {/* Alerts */}
      <div className="p-3 space-y-2">
        {alerts.slice(0, 4).map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border transition-all ${
              alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
              alert.severity === 'high' ? 'bg-amber-500/10 border-amber-500/30' :
              alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-purple-500/10 border-purple-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Badge className={`text-[10px] ${
                alert.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                alert.severity === 'high' ? 'bg-amber-500/20 text-amber-300' :
                alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-purple-500/20 text-purple-300'
              }`}>
                {alert.type}
              </Badge>
              <span className="text-[10px] text-white/40">{alert.confidence}% conf</span>
            </div>
            <p className="text-xs text-white/80">{alert.message}</p>
          </motion.div>
        ))}
      </div>

      {unacknowledged.length > 0 && (
        <div className="p-3 border-t border-purple-500/20">
          <Badge className="bg-purple-500/20 text-purple-300">
            {unacknowledged.length} unacknowledged
          </Badge>
        </div>
      )}
    </Card>
  );
}

// Risk Engine
interface RiskScore {
  overall: number;
  financial: number;
  security: number;
  compliance: number;
}

export function useRiskEngine() {
  const [riskScores, setRiskScores] = useState<RiskScore>({
    overall: 23,
    financial: 18,
    security: 34,
    compliance: 12,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskScores(prev => ({
        overall: Math.min(100, Math.max(0, prev.overall + (Math.random() - 0.5) * 5)),
        financial: Math.min(100, Math.max(0, prev.financial + (Math.random() - 0.5) * 5)),
        security: Math.min(100, Math.max(0, prev.security + (Math.random() - 0.5) * 5)),
        compliance: Math.min(100, Math.max(0, prev.compliance + (Math.random() - 0.5) * 5)),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const calculateActionRisk = (action: string, amount?: number): number => {
    let baseRisk = 20;
    if (action.includes('withdraw')) baseRisk += 30;
    if (action.includes('suspend')) baseRisk += 25;
    if (action.includes('delete')) baseRisk += 40;
    if (amount && amount > 100000) baseRisk += 20;
    return Math.min(100, baseRisk);
  };

  return { riskScores, calculateActionRisk };
}

// Risk Panel
export function RiskPanel() {
  const { riskScores } = useRiskEngine();

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-green-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-950/50 to-orange-950/50 border-amber-500/20 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-amber-300">RISK ENGINE</h3>
          <p className="text-[10px] text-amber-400/60">Real-time Scoring</p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(riskScores).map(([key, score]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60 capitalize">{key}</span>
              <span className={`text-sm font-bold ${getRiskColor(score)}`}>{score.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getProgressColor(score)}`}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Rental Engine
export interface RentalItem {
  id: string;
  feature: string;
  module: string;
  expiresAt: Date;
  usagePercent: number;
  tier: 'basic' | 'premium' | 'enterprise';
}

export function useRentalEngine() {
  const [rentals] = useState<RentalItem[]>([
    { id: 'R-001', feature: 'Dashboard Widgets', module: 'Overview', expiresAt: new Date(Date.now() + 86400000), usagePercent: 45, tier: 'premium' },
    { id: 'R-002', feature: 'Geo-Access Control', module: 'Continents', expiresAt: new Date(Date.now() + 172800000), usagePercent: 23, tier: 'enterprise' },
    { id: 'R-003', feature: 'Fast-Track Approvals', module: 'Approvals', expiresAt: new Date(Date.now() + 43200000), usagePercent: 78, tier: 'premium' },
    { id: 'R-004', feature: 'SOC Live Access', module: 'Security', expiresAt: new Date(Date.now() + 7200000), usagePercent: 92, tier: 'enterprise' },
  ]);

  const getTimeRemaining = (expiresAt: Date): string => {
    const diff = expiresAt.getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return { rentals, getTimeRemaining };
}

// Rental Panel
export function RentalPanel() {
  const { rentals, getTimeRemaining } = useRentalEngine();

  return (
    <Card className="p-4 bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border-cyan-500/20 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-cyan-300">RENTAL ENGINE</h3>
          <p className="text-[10px] text-cyan-400/60">Active Subscriptions</p>
        </div>
      </div>

      <div className="space-y-2">
        {rentals.map((rental) => (
          <div key={rental.id} className="p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/80">{rental.feature}</span>
              <Badge className={`text-[9px] ${
                rental.tier === 'enterprise' ? 'bg-purple-500/20 text-purple-300' :
                rental.tier === 'premium' ? 'bg-amber-500/20 text-amber-300' :
                'bg-slate-500/20 text-slate-300'
              }`}>
                {rental.tier}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/50">
              <span>{rental.module}</span>
              <span className="text-cyan-400">{getTimeRemaining(rental.expiresAt)}</span>
            </div>
            <Progress value={rental.usagePercent} className="h-1 mt-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}
