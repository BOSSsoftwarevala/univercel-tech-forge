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
      case 'create_session':
        return handleCreateChatSession(data)
      case 'send_message':
        return handleSendMessage(data)
      case 'accept_chat':
        return handleAcceptChat(data)
      case 'resolve_chat':
        return handleResolveChat(data)
      case 'transfer_chat':
        return handleTransferChat(data)
      case 'list_sessions':
        return handleListSessions(data)
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleCreateChatSession(data: any) {
  const count = await supabase
    .from('chat_sessions')
    .select('id', { count: 'exact' })
  const chatNumber = (count.count || 0) + 1
  const chatId = `CHAT-${String(chatNumber).padStart(3, '0')}`

  const { data: session, error } = await supabase
    .from('chat_sessions')
    .insert([{
      chat_id: chatId,
      visitor_name: data.visitorName,
      visitor_email: data.visitorEmail,
      visitor_id: data.visitorId || null
    }])
    .select()

  if (error) throw error

  await logAction('create_chat', 'chat', session[0].id, chatId, null, { session_id: session[0].id })

  return new Response(JSON.stringify({ success: true, session: session[0] }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleSendMessage(data: any) {
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('chat_id', data.chatId)
    .single()

  if (!session) throw new Error('Chat session not found')

  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert([{
      chat_session_id: session.id,
      sender_id: data.senderId || null,
      sender_type: data.senderType || 'visitor',
      message_text: data.message
    }])
    .select()

  if (error) throw error

  // Increment message count
  await supabase
    .from('chat_sessions')
    .update({ message_count: (session.message_count || 0) + 1 })
    .eq('id', session.id)

  await logAction('send_message', 'chat', session.id, data.chatId, null, { message_id: message[0].id })

  return new Response(JSON.stringify({ success: true, message: message[0] }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleAcceptChat(data: any) {
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('chat_id', data.chatId)
    .single()

  if (!session) throw new Error('Chat session not found')

  const { data: agent } = await supabase
    .from('support_agents')
    .select('id')
    .eq('agent_id', data.agentId)
    .single()

  if (!agent) throw new Error('Agent not found')

  const { data: updated, error } = await supabase
    .from('chat_sessions')
    .update({
      assigned_to: agent.id,
      status: 'active',
      accepted_at: new Date().toISOString()
    })
    .eq('id', session.id)
    .select()

  if (error) throw error

  await logAction('accept_chat', 'chat', session.id, data.chatId, 
    { status: 'waiting' }, { status: 'active', assigned_to: agent.id })

  return new Response(JSON.stringify({ success: true, session: updated[0] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleResolveChat(data: any) {
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('chat_id', data.chatId)
    .single()

  if (!session) throw new Error('Chat session not found')

  const { data: updated, error } = await supabase
    .from('chat_sessions')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString()
    })
    .eq('id', session.id)
    .select()

  if (error) throw error

  await logAction('resolve_chat', 'chat', session.id, data.chatId, 
    { status: 'active' }, { status: 'resolved' })

  return new Response(JSON.stringify({ success: true, session: updated[0] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleTransferChat(data: any) {
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('id, assigned_to')
    .eq('chat_id', data.chatId)
    .single()

  if (!session) throw new Error('Chat session not found')

  const { data: agent } = await supabase
    .from('support_agents')
    .select('id')
    .eq('agent_id', data.toAgentId)
    .single()

  if (!agent) throw new Error('Agent not found')

  const { data: updated, error } = await supabase
    .from('chat_sessions')
    .update({
      assigned_to: agent.id,
      transferred_from: session.assigned_to,
      status: 'transferred'
    })
    .eq('id', session.id)
    .select()

  if (error) throw error

  await logAction('transfer_chat', 'chat', session.id, data.chatId, 
    { assigned_to: session.assigned_to }, { assigned_to: agent.id })

  return new Response(JSON.stringify({ success: true, session: updated[0] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleListSessions(data: any) {
  let query = supabase.from('chat_sessions').select('*')

  if (data.status) {
    query = query.eq('status', data.status)
  }

  const { data: sessions, error } = await query

  if (error) throw error

  return new Response(JSON.stringify({ success: true, sessions }), {
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
