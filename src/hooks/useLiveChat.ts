import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface ChatSession {
  id: string
  chat_id: string
  visitor_name: string
  visitor_email: string
  assigned_to: string | null
  status: 'waiting' | 'active' | 'resolved' | 'transferred'
  sentiment: 'positive' | 'neutral' | 'negative'
  message_count: number
  started_at: string
  accepted_at?: string
  resolved_at?: string
}

interface ChatMessage {
  id: string
  chat_session_id: string
  sender_type: 'visitor' | 'agent' | 'system'
  message_text: string
  is_read: boolean
  created_at: string
}

export function useLiveChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const realtimeSubscription = useRef<any>(null)

  // Fetch all chat sessions
  const fetchSessions = useCallback(async (status?: string) => {
    setLoading(true)
    try {
      let query = supabase.from('chat_sessions').select('*')
      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query.order('started_at', { ascending: false })
      if (error) throw error

      setSessions(data || [])
    } catch (err: any) {
      toast.error('Failed to fetch chat sessions')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch messages for a chat
  const fetchMessages = useCallback(async (chatSessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_session_id', chatSessionId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setCurrentMessages(data || [])

      // Mark as read
      await supabase
        .from('chat_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('chat_session_id', chatSessionId)
        .eq('is_read', false)
    } catch (err: any) {
      toast.error('Failed to fetch messages')
    }
  }, [])

  // Create new chat session
  const createChatSession = useCallback(async (visitorName: string, visitorEmail: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chats`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_session',
            visitorName,
            visitorEmail
          })
        }
      )

      if (!response.ok) throw new Error('Failed to create chat session')

      const { session } = await response.json()
      setSessions([session as ChatSession, ...sessions])
      toast.success(`Chat session ${session.chat_id} created`)
      return session
    } catch (err: any) {
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [sessions])

  // Send message (with real-time sync)
  const sendMessage = useCallback(async (chatId: string, message: string, senderType = 'visitor') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
          },
          body: JSON.stringify({
            action: 'send_message',
            chatId,
            message,
            senderType
          })
        }
      )

      if (!response.ok) throw new Error('Failed to send message')

      const { message: msg } = await response.json()
      
      // Update local state
      setCurrentMessages([...currentMessages, msg])

      return msg
    } catch (err: any) {
      toast.error('Failed to send message')
      throw err
    }
  }, [currentMessages])

  // Accept chat
  const acceptChat = useCallback(async (chatId: string, agentId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'accept_chat',
            chatId,
            agentId
          })
        }
      )

      if (!response.ok) throw new Error('Failed to accept chat')

      const { session } = await response.json()
      setSessions(sessions.map(s => s.id === session.id ? session : s))
      toast.success(`Chat accepted by ${agentId}`)
      return session
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }, [sessions])

  // Resolve chat
  const resolveChat = useCallback(async (chatId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'resolve_chat',
            chatId
          })
        }
      )

      if (!response.ok) throw new Error('Failed to resolve chat')

      const { session } = await response.json()
      setSessions(sessions.map(s => s.id === session.id ? session : s))
      toast.success('Chat resolved')
      return session
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }, [sessions])

  // Transfer chat
  const transferChat = useCallback(async (chatId: string, toAgentId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'transfer_chat',
            chatId,
            toAgentId
          })
        }
      )

      if (!response.ok) throw new Error('Failed to transfer chat')

      const { session } = await response.json()
      setSessions(sessions.map(s => s.id === session.id ? session : s))
      toast.success(`Chat transferred to ${toAgentId}`)
      return session
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }, [sessions])

  // Setup real-time listener for messages
  const subscribeToChat = useCallback((chatSessionId: string) => {
    if (realtimeSubscription.current) {
      supabase.removeChannel(realtimeSubscription.current)
    }

    realtimeSubscription.current = supabase
      .channel(`chat-${chatSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_session_id=eq.${chatSessionId}`
        },
        (payload) => {
          setCurrentMessages(prev => [...prev, payload.new as ChatMessage])
        }
      )
      .subscribe()

    return () => {
      if (realtimeSubscription.current) {
        supabase.removeChannel(realtimeSubscription.current)
      }
    }
  }, [])

  return {
    sessions,
    currentMessages,
    loading,
    fetchSessions,
    fetchMessages,
    createChatSession,
    sendMessage,
    acceptChat,
    resolveChat,
    transferChat,
    subscribeToChat
  }
}
