import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export interface ChatMessage {
  id: string;
  message: string;
  maskedSender: string;
  timestamp: string;
  isAutoTranslated?: boolean;
  senderId: string;
  taskId: string | null;
}

export const useRealtimeChat = (taskId?: string | null) => {
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);

  // Fetch messages for a task
  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ['task-chat', taskId],
    queryFn: async () => {
      if (!taskId) return [];

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', taskId)
        .order('timestamp', { ascending: true })
        .limit(100);

      if (error) throw error;

      return (data || []).map(m => ({
        id: m.message_id,
        message: m.message_text,
        maskedSender: m.masked_sender || 'Anonymous',
        timestamp: m.timestamp,
        isAutoTranslated: !!m.translated_text,
        senderId: m.sender_id || '',
        taskId: m.thread_id
      })) as ChatMessage[];
    },
    enabled: !!taskId,
    staleTime: 0
  });

  // Realtime subscription for chat messages
  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`chat-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${taskId}`
        },
        (payload) => {
          console.log('New chat message:', payload);
          queryClient.invalidateQueries({ queryKey: ['task-chat', taskId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, queryClient]);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      if (!taskId) throw new Error('No task selected');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate masked sender name
      const maskedSender = `Dev_${user.id.slice(0, 4).toUpperCase()}`;

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: taskId,
          sender_id: user.id,
          masked_sender: maskedSender,
          message_text: messageText,
          cannot_delete: true,
          cannot_edit: true
        });

      if (error) throw error;
      return messageText;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-chat', taskId] });
    }
  });

  return {
    messages: messages || [],
    isLoading,
    isTyping,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
    refetch
  };
};

export default useRealtimeChat;
