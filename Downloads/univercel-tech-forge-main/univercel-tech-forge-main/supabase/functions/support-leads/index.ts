import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/utils.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...data } = await req.json()

    switch (action) {
      case 'create':
        return handleCreateLead(data)
      case 'update':
        return handleUpdateLead(data)
      case 'auto_assign':
        return handleAutoAssignLead(data)
      case 'assign':
        return handleAssignLead(data)
      case 'get_status':
        return handleGetLeadStatus(data)
      case 'list':
        return handleListLeads(data)
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Leads API Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleCreateLead(data: any) {
  // Check for duplicate email
  const { data: existing } = await supabase
    .from('leads')
    .select('id')
    .eq('email', data.email)
    .limit(1)

  if (existing && existing.length > 0) {
    return new Response(JSON.stringify({ 
      error: 'Lead with this email already exists' 
    }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Generate lead ID
  const count = await supabase
    .from('leads')
    .select('id', { count: 'exact' })
  const leadNumber = (count.count || 0) + 1
  const leadId = `LEAD-${String(leadNumber).padStart(3, '0')}`

  // Calculate lead score based on input
  const leadScore = calculateLeadScore(data)

  const { data: lead, error } = await supabase
    .from('leads')
    .insert([{
      lead_id: leadId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      product_interest: data.productInterest,
      country: data.country,
      budget_range: data.budgetRange,
      lead_score: leadScore,
      conversion_probability: leadScore / 100,
      source: data.source || 'direct',
      status: 'new'
    }])
    .select()

  if (error) throw error

  // Auto-assign if score is high enough
  if (leadScore >= 75) {
    const assigned = await autoAssignLeadToAgent(lead[0].id)
    if (assigned) {
      lead[0].assigned_to = assigned.agent_id
    }
  }

  await logAction('create_lead', 'lead', lead[0].id, leadId, null, { lead_id: leadId })

  return new Response(JSON.stringify({ success: true, lead: lead[0] }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleUpdateLead(data: any) {
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('lead_id', data.leadId)
    .single()

  if (leadError) throw leadError

  const updateData: any = {}
  if (data.status) updateData.status = data.status
  if (data.leadScore !== undefined) updateData.lead_score = data.leadScore
  if (data.notes) updateData.metadata = { ...lead.metadata, notes: data.notes }

  const { data: updated, error } = await supabase
    .from('leads')
    .update(updateData)
    .eq('id', lead.id)
    .select()

  if (error) throw error

  await logAction('update_lead', 'lead', lead.id, data.leadId, lead, updated[0])

  return new Response(JSON.stringify({ success: true, lead: updated[0] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAutoAssignLead(data: any) {
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('lead_id', data.leadId)
    .single()

  if (!lead) throw new Error('Lead not found')

  const assigned = await autoAssignLeadToAgent(lead.id)
  if (!assigned) {
    throw new Error('No available agents for auto-assignment')
  }

  const { data: updated, error } = await supabase
    .from('leads')
    .update({ assigned_to: assigned.id })
    .eq('id', lead.id)
    .select()

  if (error) throw error

  // Log the assignment
  await supabase.from('lead_assignments').insert([{
    lead_id: lead.id,
    assigned_to: assigned.id,
    auto_assigned: true,
    reason: 'Auto-assignment based on lead score and agent availability'
  }])

  await logAction('auto_assign_lead', 'lead', lead.id, data.leadId, 
    { assigned_to: null }, { assigned_to: assigned.id })

  return new Response(JSON.stringify({ success: true, lead: updated[0], agent: assigned }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAssignLead(data: any) {
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('lead_id', data.leadId)
    .single()

  if (!lead) throw new Error('Lead not found')

  const { data: agent } = await supabase
    .from('support_agents')
    .select('*')
    .eq('agent_id', data.agentId)
    .single()

  if (!agent) throw new Error('Agent not found')

  const { data: updated, error } = await supabase
    .from('leads')
    .update({ assigned_to: agent.id })
    .eq('id', lead.id)
    .select()

  if (error) throw error

  await supabase.from('lead_assignments').insert([{
    lead_id: lead.id,
    assigned_to: agent.id,
    auto_assigned: false,
    reason: 'Manual assignment'
  }])

  await logAction('assign_lead', 'lead', lead.id, data.leadId, 
    { assigned_to: lead.assigned_to }, { assigned_to: agent.id })

  return new Response(JSON.stringify({ success: true, lead: updated[0] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleGetLeadStatus(data: any) {
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('lead_id', data.leadId)
    .single()

  if (error) throw error

  return new Response(JSON.stringify({ success: true, lead }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleListLeads(data: any) {
  let query = supabase
    .from('leads')
    .select('*')

  if (data.status) {
    query = query.eq('status', data.status)
  }

  if (data.assignedOnly) {
    query = query.not('assigned_to', 'is', null)
  }

  const { data: leads, error } = await query.order('created_at', { ascending: false })

  if (error) throw error

  return new Response(JSON.stringify({ success: true, leads }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Helper: Auto-assign lead to best available agent
async function autoAssignLeadToAgent(leadId: string) {
  // Get all available agents sorted by active ticket count (least busy first)
  const { data: agents, error } = await supabase
    .from('support_agents')
    .select('*')
    .eq('status', 'available')
    .order('active_tickets_count', { ascending: true })
    .limit(1)

  if (error || !agents || agents.length === 0) {
    return null
  }

  return agents[0]
}

// Helper: Calculate lead score based on various factors
function calculateLeadScore(data: any): number {
  let score = 50 // Base score

  // Budget range multiplier
  const budgetScores: Record<string, number> = {
    'enterprise': 95,
    'high': 85,
    'medium': 60,
    'low': 40
  }
  score = budgetScores[data.budgetRange] || 50

  // Company size signal
  if (data.company) score += 10

  // Multiple contact fields signal
  if (data.phone && data.email) score += 10

  // High interest product categories
  const highValueProducts = ['pos', 'erp', 'crm', 'hrm', 'hospital', 'education']
  if (data.productInterest && highValueProducts.some(p => data.productInterest.toLowerCase().includes(p))) {
    score += 15
  }

  return Math.min(100, score)
}

async function logAction(
  actionType: string, 
  resourceType: string, 
  resourceId: string, 
  resourceName: string,
  oldValue: any,
  newValue: any
) {
  try {
    await supabase.from('action_logs').insert([{
      action_type: actionType,
      resource_type: resourceType,
      resource_id: resourceId,
      resource_name: resourceName,
      old_value: oldValue,
      new_value: newValue,
      status: 'success'
    }])
  } catch (err) {
    console.error('Error logging action:', err)
  }
}
