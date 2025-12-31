import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, ChevronDown, ChevronUp, AlertTriangle, 
  Unlock, RefreshCw, Shield, FileText, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValaStatusBadge } from './ValaStatusBadge';
import { toast } from 'sonner';

interface FlaggedItem {
  id: string;
  valaId: string;
  riskLevel: 'high' | 'critical';
  reason: string;
  timestamp: number;
  aiScore: number;
}

interface ValaMasterSummaryProps {
  flaggedItems: FlaggedItem[];
  onUnlock?: (itemId: string) => void;
  onOverride?: (itemId: string) => void;
}

export function ValaMasterSummary({ flaggedItems, onUnlock, onOverride }: ValaMasterSummaryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleUnlock = (itemId: string) => {
    onUnlock?.(itemId);
    toast.success('Item unlocked by Master Admin');
  };

  const handleOverride = (itemId: string) => {
    onOverride?.(itemId);
    toast.success('Override applied by Master Admin');
  };

  const summaryStats = {
    totalFlagged: flaggedItems.length,
    critical: flaggedItems.filter(i => i.riskLevel === 'critical').length,
    high: flaggedItems.filter(i => i.riskLevel === 'high').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-mono font-semibold text-zinc-100 tracking-wider">
              MASTER ADMIN
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Final authority • Summary view only
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg text-center">
          <p className="text-3xl font-bold font-mono text-zinc-100">{summaryStats.totalFlagged}</p>
          <p className="text-xs text-zinc-500 font-mono mt-1">FLAGGED ITEMS</p>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <p className="text-3xl font-bold font-mono text-red-400">{summaryStats.critical}</p>
          <p className="text-xs text-red-400/70 font-mono mt-1">CRITICAL</p>
        </div>
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center">
          <p className="text-3xl font-bold font-mono text-orange-400">{summaryStats.high}</p>
          <p className="text-xs text-orange-400/70 font-mono mt-1">HIGH RISK</p>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-center gap-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
        <Eye className="w-4 h-4 text-zinc-500" />
        <p className="text-xs text-zinc-500 font-mono">
          Drill-down available only on AI-flagged items. Unlock/override available here only.
        </p>
      </div>

      {/* Flagged Items */}
      <div className="space-y-2">
        {flaggedItems.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-mono text-sm">No flagged items requiring attention</p>
          </div>
        ) : (
          flaggedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
            >
              {/* Item Header */}
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-4 h-4 ${
                    item.riskLevel === 'critical' ? 'text-red-400' : 'text-orange-400'
                  }`} />
                  <span className="font-mono text-sm text-zinc-300">{item.valaId}</span>
                  <ValaStatusBadge 
                    status="blocked" 
                    size="sm" 
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono ${
                    item.riskLevel === 'critical' ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    AI Score: {item.aiScore}
                  </span>
                  {expandedId === item.id ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-zinc-800"
                  >
                    <div className="p-4 space-y-4">
                      {/* Reason */}
                      <div>
                        <p className="text-xs text-zinc-500 font-mono mb-1">FLAG REASON</p>
                        <p className="text-sm text-zinc-300">{item.reason}</p>
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-zinc-600 font-mono">
                        Flagged: {new Date(item.timestamp).toLocaleString()}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUnlock(item.id)}
                          size="sm"
                          className="font-mono text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                        >
                          <Unlock className="w-3 h-3 mr-2" />
                          UNLOCK
                        </Button>
                        <Button
                          onClick={() => handleOverride(item.id)}
                          size="sm"
                          variant="outline"
                          className="font-mono text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          <RefreshCw className="w-3 h-3 mr-2" />
                          OVERRIDE
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
