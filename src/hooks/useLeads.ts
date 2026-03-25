import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface Lead {
  id: string
  lead_id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  product_interest: string | null
  country: string | null
  budget_range: string | null
  status: 'new' | 'contacted' | 'demo_scheduled' | 'qualified' | 'converted' | 'lost'
  lead_score: number
  conversion_probability: number
  assigned_to: string | null
  source: string
  created_at: string
  updated_at: string
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all leads
  const fetchLeads = useCallback(async (filters?: { status?: string; assignedOnly?: boolean }) => {
    setLoading(true)
    try {
      let query = supabase.from('leads').select('*')

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.assignedOnly) {
        query = query.not('assigned_to', 'is', null)
      }

      const { data, error: err } = await query.order('created_at', { ascending: false })

      if (err) throw err

      setLeads(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create lead
  const createLead = useCallback(async (leadData: {
    name: string
    email: string
    phone?: string
    company?: string
    productInterest?: string
    country?: string
    budgetRange?: string
    source?: string
  }) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
          },
          body: JSON.stringify({
            action: 'create',
            ...leadData
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create lead')
      }

      const { lead } = await response.json()
      setLeads([lead as Lead, ...leads])
      toast.success(`Lead ${lead.lead_id} created`)
      return lead
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [leads])

  // Update lead
  const updateLead = useCallback(async (leadId: string, updates: {
    status?: string
    leadScore?: number
    notes?: string
  }) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'update',
            leadId,
            ...updates
          })
        }
      )

      if (!response.ok) throw new Error('Failed to update lead')

      const { lead } = await response.json()
      setLeads(leads.map(l => l.id === lead.id ? lead : l))
      toast.success('Lead updated')
      return lead
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [leads])

  // Auto-assign lead to available agent
  const autoAssignLead = useCallback(async (leadId: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'auto_assign',
            leadId
          })
        }
      )

      if (!response.ok) throw new Error('Failed to auto-assign lead')

      const { lead, agent } = await response.json()
      setLeads(leads.map(l => l.id === lead.id ? lead : l))
      toast.success(`Lead assigned to ${agent.name}`)
      return { lead, agent }
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [leads])

  // Manually assign lead to agent
  const assignLead = useCallback(async (leadId: string, agentId: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'assign',
            leadId,
            agentId
          })
        }
      )

      if (!response.ok) throw new Error('Failed to assign lead')

      const { lead } = await response.json()
      setLeads(leads.map(l => l.id === lead.id ? lead : l))
      toast.success(`Lead assigned to ${agentId}`)
      return lead
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [leads])

  // Get lead status
  const getLeadStatus = useCallback(async (leadId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            action: 'get_status',
            leadId
          })
        }
      )

      if (!response.ok) throw new Error('Failed to get lead status')

      const { lead } = await response.json()
      return lead
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }, [])

  return {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLead,
    autoAssignLead,
    assignLead,
    getLeadStatus
  }
}
