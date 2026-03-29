import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValaSecureWorkspace } from '@/components/vala-control/ValaSecureWorkspace';
import { ValaMasterSummary } from '@/components/vala-control/ValaMasterSummary';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const generateValaId = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `VALA-${Math.abs(hash).toString(36).toUpperCase().padStart(8, '0')}`;
};

// Mock flagged items
const mockFlaggedItems = [
  {
    id: 'FLAG-001',
    valaId: 'VALA-1B5F4E3D',
    riskLevel: 'high' as const,
    reason: 'Multiple failed authentication attempts detected within short timeframe. Session anomaly flagged by AI behavior analysis.',
    timestamp: Date.now() - 3600000,
    aiScore: 38
  },
  {
    id: 'FLAG-002',
    valaId: 'VALA-2C6G5F4E',
    riskLevel: 'critical' as const,
    reason: 'Potential account compromise detected. Geographic location mismatch with registered device. Clipboard access attempted.',
    timestamp: Date.now() - 1800000,
    aiScore: 22
  },
  {
    id: 'FLAG-003',
    valaId: 'VALA-4D8H7G6F',
    riskLevel: 'critical' as const,
    reason: 'Unusual data access pattern. Attempted to access records outside assigned scope. Screenshot key blocked 3 times.',
    timestamp: Date.now() - 900000,
    aiScore: 15
  }
];

export default function ValaMasterWorkspace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [valaId, setValaId] = useState('');
  const [flaggedItems, setFlaggedItems] = useState(mockFlaggedItems);

  useEffect(() => {
    if (user?.id) {
      const id = generateValaId(user.id);
      setValaId(id);

      supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'session_start',
        module: 'vala_master',
        meta_json: { vala_id: id, role: 'master' }
      });
    }
  }, [user?.id]);

  const handleSessionExpire = () => {
    navigate('/auth');
  };

  const handleUnlock = async (itemId: string) => {
    if (!user?.id) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'master_unlock',
      module: 'vala_master',
      meta_json: {
        vala_id: valaId,
        unlocked_item: itemId,
        timestamp: Date.now()
      }
    });

    setFlaggedItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleOverride = async (itemId: string) => {
    if (!user?.id) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'master_override',
      module: 'vala_master',
      meta_json: {
        vala_id: valaId,
        overridden_item: itemId,
        timestamp: Date.now()
      }
    });

    setFlaggedItems(prev => prev.filter(i => i.id !== itemId));
  };

  if (!valaId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="font-mono text-zinc-500">INITIALIZING...</div>
      </div>
    );
  }

  return (
    <ValaSecureWorkspace
      roleTitle="MASTER ADMIN"
      valaId={valaId}
      onSessionExpire={handleSessionExpire}
    >
      <ValaMasterSummary 
        flaggedItems={flaggedItems}
        onUnlock={handleUnlock}
        onOverride={handleOverride}
      />
    </ValaSecureWorkspace>
  );
}
