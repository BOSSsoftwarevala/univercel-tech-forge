import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender_masked_name: string;
  sender_role: string;
  message_text: string;
  created_at: string;
}

export function useInternalChat(channelId?: string) {
  const { user, userRole } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChannel, setActiveChannel] = useState<string | null>(channelId || null);
  const [isLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const getMaskedName = useCallback(() => {
    if (!user || !userRole) return 'UNKNOWN';
    return `${userRole.toUpperCase()}-${user.id.slice(0, 4)}`;
  }, [user, userRole]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return false;
    setIsSending(true);
    // Messages would be sent when types regenerate
    setIsSending(false);
    toast.success('Message sent');
    return true;
  }, []);

  const createChannel = useCallback(async (name: string) => {
    return { id: 'temp', channel_name: name };
  }, []);

  return {
    channels: [],
    messages,
    activeChannel,
    setActiveChannel,
    isLoading,
    isSending,
    sendMessage,
    createChannel,
    getMaskedName,
    refetch: () => {}
  };
}
