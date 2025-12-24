import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RemoteAssistSession {
  id: string;
  session_code: string;
  status: string;
  mode: string;
  user_role?: string;
  support_agent_id?: string;
  agent_masked_id?: string;
  agent_watermark_text?: string;
  user_consent_given: boolean;
  expires_at: string;
  max_duration_minutes: number;
}

interface CursorHighlight {
  x: number;
  y: number;
  highlight_type: 'click' | 'circle' | 'arrow';
  message?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: number;
}

export const useRemoteAssist = (role: 'user' | 'agent') => {
  const { toast } = useToast();
  const [session, setSession] = useState<RemoteAssistSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [cursorHighlight, setCursorHighlight] = useState<CursorHighlight | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create session (user-side)
  const createSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('create_remote_assist_session');
      
      if (error) throw error;
      
      const result = data as any;
      if (result?.success) {
        setSession({
          id: result.session_id,
          session_code: result.session_code,
          status: 'pending',
          mode: 'guided_cursor',
          user_consent_given: false,
          expires_at: result.expires_at,
          max_duration_minutes: 30
        });
        
        toast({
          title: "Support Session Created",
          description: `Share this code with support: ${result.session_code}`,
        });
        
        return result;
      } else {
        throw new Error(result?.error || 'Failed to create session');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  // Join session (agent-side)
  const joinSession = useCallback(async (sessionCode: string) => {
    try {
      const { data, error } = await supabase.rpc('join_remote_assist_session', {
        p_session_code: sessionCode
      });
      
      if (error) throw error;
      
      const result = data as any;
      if (result?.success) {
        setSession({
          id: result.session_id,
          session_code: sessionCode,
          status: 'pending',
          mode: result.mode,
          user_role: result.user_role,
          user_consent_given: false,
          expires_at: '',
          max_duration_minutes: 30,
          agent_masked_id: result.masked_id
        });
        
        toast({
          title: "Joined Session",
          description: "Waiting for user consent to start screen sharing...",
        });
        
        return result;
      } else {
        throw new Error(result?.error || 'Failed to join session');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  // Give consent (user-side)
  const giveConsent = useCallback(async () => {
    if (!session) return false;
    
    try {
      const { data, error } = await supabase.rpc('give_remote_assist_consent', {
        p_session_id: session.id
      });
      
      if (error) throw error;
      
      const result = data as any;
      if (result?.success) {
        setSession(prev => prev ? { ...prev, status: 'active', user_consent_given: true } : null);
        
        // Connect WebSocket
        await connectWebSocket();
        
        toast({
          title: "Screen Sharing Started",
          description: "Support agent can now see your screen. A watermark will be visible.",
        });
        
        return true;
      } else {
        throw new Error(result?.error || 'Failed to give consent');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  }, [session, toast]);

  // Connect WebSocket
  const connectWebSocket = useCallback(async () => {
    if (!session) return;
    
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.access_token) {
        throw new Error('Not authenticated');
      }

      const projectId = 'feqdqyadkijpohyllfdq';
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/remote-assist-relay?session_id=${session.id}&role=${role}&token=${authSession.access_token}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsPeerConnected(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to support session",
          variant: "destructive"
        });
      };

    } catch (error: any) {
      console.error('Connect error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [session, role, toast]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'connected':
        setTimeRemaining(message.max_duration_minutes * 60);
        break;

      case 'peer_connected':
        setIsPeerConnected(true);
        toast({
          title: message.role === 'user' ? "User Connected" : "Support Agent Connected",
          description: "Screen sharing is now active",
        });
        break;

      case 'peer_disconnected':
        setIsPeerConnected(false);
        toast({
          title: message.role === 'user' ? "User Disconnected" : "Support Agent Disconnected",
          variant: "destructive"
        });
        break;

      case 'cursor_highlight':
        setCursorHighlight({
          x: message.x,
          y: message.y,
          highlight_type: message.highlight_type,
          message: message.message
        });
        // Clear after 3 seconds
        setTimeout(() => setCursorHighlight(null), 3000);
        break;

      case 'chat':
        setChatMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          content: message.content,
          sender: message.sender,
          timestamp: message.timestamp
        }]);
        break;

      case 'session_ended':
        toast({
          title: "Session Ended",
          description: message.reason,
        });
        setSession(null);
        setIsConnected(false);
        setIsPeerConnected(false);
        break;
    }
  }, [toast]);

  // Send cursor highlight (agent-side)
  const sendCursorHighlight = useCallback((x: number, y: number, highlightType: 'click' | 'circle' | 'arrow', message?: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor_highlight',
        x,
        y,
        highlight_type: highlightType,
        message
      }));
    }
  }, []);

  // Send chat message
  const sendChatMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        content
      }));
      
      // Add to local messages
      setChatMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content,
        sender: role,
        timestamp: Date.now()
      }]);
    }
  }, [role]);

  // End session
  const endSession = useCallback(async (reason?: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'end_session',
        reason: reason || 'Session ended by ' + role
      }));
    }
    
    setSession(null);
    setIsConnected(false);
    setIsPeerConnected(false);
    setChatMessages([]);
    setCursorHighlight(null);
  }, [role]);

  // Timer for session duration
  useEffect(() => {
    if (isConnected && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endSession('Session timeout');
            return 0;
          }
          // Warn at 5 minutes
          if (prev === 300) {
            toast({
              title: "5 Minutes Remaining",
              description: "Session will end automatically in 5 minutes",
              variant: "destructive"
            });
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected, timeRemaining, endSession, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Subscribe to session updates
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`remote-assist-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'remote_assist_sessions',
          filter: `id=eq.${session.id}`
        },
        (payload) => {
          const updated = payload.new as any;
          setSession(prev => prev ? {
            ...prev,
            status: updated.status,
            support_agent_id: updated.support_agent_id,
            agent_masked_id: updated.agent_masked_id,
            agent_watermark_text: updated.agent_watermark_text,
            user_consent_given: updated.user_consent_given
          } : null);

          // If agent joined, notify user
          if (role === 'user' && updated.support_agent_id && !session.support_agent_id) {
            toast({
              title: "Support Agent Joined",
              description: `Agent ${updated.agent_masked_id} is ready to help. Click "Start Sharing" to begin.`,
            });
          }

          // If consent given and we're agent, connect WebSocket
          if (role === 'agent' && updated.user_consent_given && !session.user_consent_given) {
            connectWebSocket();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, role, toast, connectWebSocket]);

  return {
    session,
    isConnected,
    isPeerConnected,
    cursorHighlight,
    chatMessages,
    timeRemaining,
    createSession,
    joinSession,
    giveConsent,
    connectWebSocket,
    sendCursorHighlight,
    sendChatMessage,
    endSession
  };
};
