import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface SupportTicket {
  id: string
  ticket_id: string
  subject: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent'
  status: 'new' | 'assigned' | 'in_progress' | 'waiting' | 'resolved' | 'closed' | 'escalated'
  assigned_to: string | null
  user_id: string
  created_at: string
  updated_at: string
  resolved_at: string | null
  sla_deadline: string | null
}

export function useSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch tickets from database
  const fetchTickets = useCallback(async (filters?: { status?: string; assignedOnly?: boolean }) => {
    setLoading(true)
    try {
      let query = supabase
        .from('support_tickets')
        .select('*')

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.assignedOnly) {
        query = query.not('assigned_to', 'is', null)
      }

      const { data, error: err } = await query.order('created_at', { ascending: false })

      if (err) throw err

      setTickets(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error('Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create ticket via API
  const createTicket = useCallback(async (subject: string, description: string, category: string, priority = 'medium') => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'create',
            subject,
            description,
            category,
            priority
          })
        }
      )

      if (!response.ok) throw new Error('Failed to create ticket')

      const { ticket } = await response.json()
      setTickets([ticket as SupportTicket, ...tickets])
      toast.success(`Ticket ${ticket.ticket_id} created`)
      return ticket
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [tickets])

  // Assign ticket to agent
  const assignTicket = useCallback(async (ticketId: string, agentId: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'assign',
            ticketId,
            agentId
          })
        }
      )

      if (!response.ok) throw new Error('Failed to assign ticket')

      const { ticket } = await response.json()
      setTickets(tickets.map(t => t.id === ticket.id ? ticket : t))
      toast.success(`Ticket assigned`)
      return ticket
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [tickets])

  // Resolve ticket
  const resolveTicket = useCallback(async (ticketId: string, message?: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'resolve',
            ticketId,
            message
          })
        }
      )

      if (!response.ok) throw new Error('Failed to resolve ticket')

      const { ticket } = await response.json()
      setTickets(tickets.map(t => t.id === ticket.id ? ticket : t))
      toast.success('Ticket resolved')
      return ticket
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [tickets])

  // Reply to ticket
  const replyToTicket = useCallback(async (ticketId: string, message: string, isInternal = false) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'reply',
            ticketId,
            message,
            isInternal
          })
        }
      )

      if (!response.ok) throw new Error('Failed to send reply')

      const { message: msg } = await response.json()
      toast.success('Reply sent')
      return msg
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    }
  }, [])

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    assignTicket,
    resolveTicket,
    replyToTicket
  }
}
