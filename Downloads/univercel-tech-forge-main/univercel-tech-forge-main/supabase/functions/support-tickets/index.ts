import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/utils.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

interface SupportTicketRequest {
  subject: string
  description: string
  category: string
  priority?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...data } = await req.json()

    switch (action) {
      case 'create':
        return handleCreateTicket(data as SupportTicketRequest)
      case 'assign':
        return handleAssignTicket(data as any)
      case 'resolve':
        return handleResolveTicket(data as any)
      case 'reply':
        return handleReplyToTicket(data as any)
      case 'list':
        return handleListTickets(data as any)
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Support API Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleCreateTicket(data: SupportTicketRequest) {
  const authHeader = Deno.env.get('SUPABASE_AUTH_HEADER') || ''
  const userId = authHeader.split('.')[0] // Extract from JWT

  // Generate ticket ID
  const count = await supabase
    .from('support_tickets')
    .select('id', { count: 'exact' })
  const ticketNumber = (count.count || 0) + 1
  const ticketId = `TKT-${String(ticketNumber).padStart(3, '0')}`

  // Create SLA deadline (48 hours based on priority)
  const slaDays = data.priority === 'critical' ? 0.5 : data.priority === 'high' ? 1 : 2
  const slaDeadline = new Date(Date.now() + slaDays * 24 * 60 * 60 * 1000).toISOString()

  const { data: ticket, error } = await supabase
    .from('support_tickets')
    .insert([{
      ticket_id: ticketId,
      user_id: userId,
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority || 'medium',
      sla_deadline: slaDeadline
    }])
    .select()

  if (error) throw error

  // Log action
  await logAction('create_ticket', 'ticket', ticket[0].id, ticketId, null, { ticket_id: ticketId })

  // Send notification
  await sendNotification('ticket_created', ticket[0].id, ticketId)

  return new Response(JSON.stringify({ success: true, ticket: ticket[0] }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAssignTicket(data: { ticketId: string; agentId: string }) {
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .select('id, assigned_to')
    .eq('ticket_id', data.ticketId)
    .single()

  if (ticketError) throw ticketError

  const { data: agent } = await supabase
    .from('support_agents')
    .select('id')
    .eq('agent_id', data.agentId)
    .single()

  if (!agent) throw new Error('Agent not found')

  const { data: updated, error } = await supabase
    .from('support_tickets')
    .update({
      assigned_to: agent.id,
      status: 'assigned'
    })
    .eq('id', ticket.id)
    .select()

  if (error) throw error

  await logAction('assign_ticket', 'ticket', ticket.id, data.ticketId, 
    { assigned_to: ticket.assigned_to }, { assigned_to: agent.id })

  await sendNotification('ticket_assigned', ticket.id, data.ticketId)

  return new Response(JSON.stringify({ success: true, ticket: updated[0] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleResolveTicket(data: { ticketId: string; message?: string }) {
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .select('id')
    .eq('ticket_id', data.ticketId)
    .single()

  if (ticketError) throw ticketError

  const { data: updated, error } = await supabase
    .from('support_tickets')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString()
    })
    .eq('id', ticket.id)
    .select()

  if (error) throw error

  if (data.message) {
    await supabase.from('support_messages').insert([{
      ticket_id: ticket.id,
      sender_id: Deno.env.get('SUPABASE_AUTH_HEADER') || '',
      sender_type: 'agent',
      message_text: data.message
    }])
  }

  await logAction('resolve_ticket', 'ticket', ticket.id, data.ticketId, 
    { status: 'open' }, { status: 'resolved' })

  await sendNotification('ticket_resolved', ticket.id, data.ticketId)

  return new Response(JSON.stringify({ success: true, ticket: updated[0] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleReplyToTicket(data: { ticketId: string; message: string; isInternal?: boolean }) {
  const userId = Deno.env.get('SUPABASE_AUTH_HEADER') || ''

  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .select('id')
    .eq('ticket_id', data.ticketId)
    .single()

  if (ticketError) throw ticketError

  const { data: message, error } = await supabase
    .from('support_messages')
    .insert([{
      ticket_id: ticket.id,
      sender_id: userId,
      sender_type: 'agent',
      message_text: data.message,
      is_internal: data.isInternal || false
    }])
    .select()

  if (error) throw error

  await logAction('reply_ticket', 'ticket', ticket.id, data.ticketId, null, { message_id: message[0].id })

  return new Response(JSON.stringify({ success: true, message: message[0] }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleListTickets(data: { status?: string; assigned?: boolean }) {
  const userId = Deno.env.get('SUPABASE_AUTH_HEADER') || ''

  let query = supabase
    .from('support_tickets')
    .select('*')

  if (data.status) {
    query = query.eq('status', data.status)
  }

  if (data.assigned === false) {
    query = query.is('assigned_to', null)
  }

  const { data: tickets, error } = await query

  if (error) throw error

  return new Response(JSON.stringify({ success: true, tickets }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
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

async function sendNotification(type: string, resourceId: string, resourceName: string) {
  try {
    // Send to notification system
    // This can be extended to send to NotificationContext, email, push, etc.
    console.log(`[NOTIFICATION] ${type}: ${resourceName}`)
  } catch (err) {
    console.error('Error sending notification:', err)
  }
}
