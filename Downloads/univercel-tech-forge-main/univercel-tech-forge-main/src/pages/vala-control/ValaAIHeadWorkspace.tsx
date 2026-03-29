import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValaSecureWorkspace } from '@/components/vala-control/ValaSecureWorkspace';
import { ValaAIReportPanel } from '@/components/vala-control/ValaAIReportPanel';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const generateValaId = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `VALA-${Math.abs(hash).toString(36).toUpperCase().padStart(8, '0')}`;
};

// Mock behavior data
const mockBehaviors = [
  {
    valaId: 'VALA-8A3F2B1C',
    score: 85,
    riskLevel: 'low' as const,
    flags: [],
    lastUpdate: Date.now() - 300000
  },
  {
    valaId: 'VALA-9C4E3D2A',
    score: 62,
    riskLevel: 'medium' as const,
    flags: ['Unusual access pattern', 'Off-hours activity'],
    lastUpdate: Date.now() - 600000
  },
  {
    valaId: 'VALA-1B5F4E3D',
    score: 38,
    riskLevel: 'high' as const,
    flags: ['Multiple failed attempts', 'Session anomaly', 'Rapid actions'],
    lastUpdate: Date.now() - 120000
  },
  {
    valaId: 'VALA-2C6G5F4E',
    score: 22,
    riskLevel: 'critical' as const,
    flags: ['Potential compromise', 'Geographic anomaly', 'Device mismatch', 'Clipboard attempt'],
    lastUpdate: Date.now() - 60000
  }
];

export default function ValaAIHeadWorkspace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [valaId, setValaId] = useState('');

  useEffect(() => {
    if (user?.id) {
      const id = generateValaId(user.id);
      setValaId(id);

      supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'session_start',
        module: 'vala_ai_head',
        meta_json: { vala_id: id, role: 'ai_head' }
      });
    }
  }, [user?.id]);

  const handleSessionExpire = () => {
    navigate('/auth');
  };

  const handleSubmitReport = async () => {
    if (!user?.id) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'ai_report_submitted',
      module: 'vala_ai_head',
      meta_json: {
        vala_id: valaId,
        report_type: 'behavior_analysis',
        items_analyzed: mockBehaviors.length,
        critical_count: mockBehaviors.filter(b => b.riskLevel === 'critical').length,
        timestamp: Date.now()
      }
    });

    toast.success('Report submitted to Master Admin');
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
      roleTitle="AI HEAD / OBSERVATION"
      valaId={valaId}
      onSessionExpire={handleSessionExpire}
    >
      <ValaAIReportPanel 
        behaviors={mockBehaviors} 
        onSubmitReport={handleSubmitReport}
      />
    </ValaSecureWorkspace>
  );
}
