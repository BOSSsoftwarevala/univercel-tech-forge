/**
 * OVER AI - Global Header
 * LOCKED - DO NOT MODIFY THEME/COLORS/SPACING
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Zap, Shield, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { AIStatus } from './types';

interface OverAIHeaderProps {
  userRole: string;
}

export function OverAIHeader({ userRole }: OverAIHeaderProps) {
  const [status, setStatus] = useState<AIStatus>('active');
  const [responseSpeed, setResponseSpeed] = useState(47);
  const [systemLoad, setSystemLoad] = useState(34);
  const [activeFlows, setActiveFlows] = useState(1247);
  const [errorsResolved, setErrorsResolved] = useState(89);

  // Simulate live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseSpeed(Math.floor(Math.random() * 30) + 35);
      setSystemLoad(Math.floor(Math.random() * 20) + 30);
      setActiveFlows((prev) => prev + Math.floor(Math.random() * 10) - 5);
      setErrorsResolved((prev) => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (s: AIStatus) => {
    switch (s) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'degraded':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  const getStatusIcon = (s: AIStatus) => {
    switch (s) {
      case 'active':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'degraded':
        return <AlertCircle className="w-3 h-3" />;
      case 'critical':
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#0a0a10] via-[#0d0d14] to-[#0a0a10] backdrop-blur-xl border-b border-cyan-500/20 z-50 flex items-center justify-between px-6">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">OVER AI</h1>
          <p className="text-[10px] text-cyan-400/70 uppercase tracking-wider">Core Intelligence Engine</p>
        </div>
      </div>

      {/* Center: Live Metrics */}
      <div className="flex items-center gap-6">
        {/* AI Status */}
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(status)}>
            {getStatusIcon(status)}
            <span className="ml-1 uppercase text-xs">{status}</span>
          </Badge>
        </div>

        {/* Response Speed */}
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-white/70">Speed:</span>
          <span className="text-cyan-400 font-mono font-bold">{responseSpeed}ms</span>
        </div>

        {/* System Load */}
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-white/70">Load:</span>
          <span className="text-blue-400 font-mono font-bold">{systemLoad}%</span>
        </div>

        {/* Active Flows */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-violet-400" />
          <span className="text-white/70">Flows:</span>
          <span className="text-violet-400 font-mono font-bold">{activeFlows.toLocaleString()}</span>
        </div>

        {/* Errors Auto-Resolved */}
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-white/70">Auto-Fixed:</span>
          <span className="text-emerald-400 font-mono font-bold">{errorsResolved}</span>
        </div>
      </div>

      {/* Right: Role Badge */}
      <div className="flex items-center gap-3">
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 uppercase text-xs">
          {userRole.replace('_', ' ')}
        </Badge>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </header>
  );
}

export default OverAIHeader;
