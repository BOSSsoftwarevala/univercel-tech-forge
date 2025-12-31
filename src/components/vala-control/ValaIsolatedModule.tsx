import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Hash, RefreshCw, AlertCircle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValaActionCard } from './ValaActionCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ValaAction {
  id: string;
  title: string;
  timestamp: number;
  status: 'pending' | 'locked' | 'forwarded' | 'blocked';
  stage: 'debug' | 'check' | 'lock' | 'forward' | 'complete';
  checksum: string;
}

interface ValaIsolatedModuleProps {
  roleLevel: 'operation' | 'regional' | 'ai_head' | 'master';
  valaId: string;
}

// Generate checksum
const generateChecksum = (data: unknown): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
};

export function ValaIsolatedModule({ roleLevel, valaId }: ValaIsolatedModuleProps) {
  const { user } = useAuth();
  const [actions, setActions] = useState<ValaAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data based on role level
  const loadActions = useCallback(() => {
    setLoading(true);

    // Simulated isolated data per role
    const mockActions: ValaAction[] = [
      {
        id: `ACT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        title: roleLevel === 'operation' ? 'Process Request #1247' :
               roleLevel === 'regional' ? 'Regional Review #0892' :
               roleLevel === 'ai_head' ? 'Behavior Analysis #0341' :
               'Final Approval #0023',
        timestamp: Date.now() - Math.random() * 3600000,
        status: 'pending',
        stage: 'debug',
        checksum: generateChecksum({ role: roleLevel, ts: Date.now() })
      },
      {
        id: `ACT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        title: roleLevel === 'operation' ? 'Data Entry #1248' :
               roleLevel === 'regional' ? 'Compliance Check #0893' :
               roleLevel === 'ai_head' ? 'Risk Flag #0342' :
               'Override Request #0024',
        timestamp: Date.now() - Math.random() * 7200000,
        status: 'pending',
        stage: 'debug',
        checksum: generateChecksum({ role: roleLevel, ts: Date.now() + 1 })
      }
    ];

    setTimeout(() => {
      setActions(mockActions);
      setLoading(false);
    }, 500);
  }, [roleLevel]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  // Handle process action
  const handleProcess = async (actionId: string) => {
    if (!user?.id) return;

    // Log to audit (append-only)
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'action_forwarded',
      module: 'vala_control',
      meta_json: {
        vala_id: valaId,
        action_id: actionId,
        role_level: roleLevel,
        checksum: generateChecksum({ actionId, valaId, roleLevel }),
        timestamp: Date.now()
      }
    });

    // Update local state
    setActions(prev => prev.map(a => 
      a.id === actionId 
        ? { ...a, status: 'forwarded' as const, stage: 'complete' as const }
        : a
    ));
  };

  const roleTitles = {
    operation: 'OPERATION MODULE',
    regional: 'REGIONAL CONTROL',
    ai_head: 'AI OBSERVATION',
    master: 'MASTER CONTROL'
  };

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded">
            <Inbox className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-lg font-mono font-semibold text-zinc-100 tracking-wider">
              {roleTitles[roleLevel]}
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Isolated workspace • No cross-role access
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadActions}
          disabled={loading}
          className="font-mono text-xs border-zinc-700 text-zinc-400 hover:bg-zinc-800"
        >
          <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
          REFRESH
        </Button>
      </div>

      {/* Actions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-6 h-6 text-zinc-500" />
          </motion.div>
        </div>
      ) : actions.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="font-mono text-sm">No pending actions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((action) => (
            <ValaActionCard
              key={action.id}
              actionId={action.id}
              title={action.title}
              timestamp={action.timestamp}
              status={action.status}
              stage={action.stage}
              checksum={action.checksum}
              onProcess={handleProcess}
              disabled={roleLevel === 'ai_head'} // AI cannot execute
            />
          ))}
        </div>
      )}

      {/* Role-specific Notice */}
      {roleLevel === 'ai_head' && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <p className="text-xs text-amber-400 font-mono">
            AI OBSERVATION ONLY — Cannot execute, approve, or edit actions
          </p>
        </div>
      )}
    </div>
  );
}
