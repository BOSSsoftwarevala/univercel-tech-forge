import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValaSecureWorkspace } from '@/components/vala-control/ValaSecureWorkspace';
import { ValaIsolatedModule } from '@/components/vala-control/ValaIsolatedModule';
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

export default function ValaRegionalWorkspace() {
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
        module: 'vala_regional',
        meta_json: { vala_id: id, role: 'regional' }
      });
    }
  }, [user?.id]);

  const handleSessionExpire = () => {
    navigate('/auth');
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
      roleTitle="AREA / REGIONAL CONTROL"
      valaId={valaId}
      onSessionExpire={handleSessionExpire}
    >
      <ValaIsolatedModule roleLevel="regional" valaId={valaId} />
    </ValaSecureWorkspace>
  );
}
