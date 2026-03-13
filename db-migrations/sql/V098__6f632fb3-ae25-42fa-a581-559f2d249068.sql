-- Add missing columns to auto_scaling_policies
ALTER TABLE public.auto_scaling_policies 
ADD COLUMN IF NOT EXISTS disk_threshold_percent INTEGER DEFAULT 85,
ADD COLUMN IF NOT EXISTS scale_up_storage INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS max_storage INTEGER DEFAULT 2000,
ADD COLUMN IF NOT EXISTS cooldown_seconds INTEGER DEFAULT 300,
ADD COLUMN IF NOT EXISTS last_triggered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS consecutive_triggers INTEGER DEFAULT 0;

-- Create server_actions table for tracking all actions
CREATE TABLE IF NOT EXISTS public.server_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  action_type VARCHAR(30) DEFAULT 'manual',
  requested_by UUID,
  status VARCHAR(30) DEFAULT 'pending',
  previous_config JSONB,
  new_config JSONB,
  error_message TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scaling_events table for detailed scaling history
CREATE TABLE IF NOT EXISTS public.scaling_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES public.auto_scaling_policies(id),
  trigger_reason VARCHAR(50) NOT NULL,
  trigger_value INTEGER,
  threshold_value INTEGER,
  scale_direction VARCHAR(10) DEFAULT 'up',
  cpu_before INTEGER,
  cpu_after INTEGER,
  ram_before INTEGER,
  ram_after INTEGER,
  storage_before INTEGER,
  storage_after INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  cooldown_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create websocket_connections table for tracking active connections
CREATE TABLE IF NOT EXISTS public.websocket_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  channel VARCHAR(100) NOT NULL,
  session_id VARCHAR(100),
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_ping_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create websocket_events table for event history
CREATE TABLE IF NOT EXISTS public.websocket_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  server_id UUID,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.server_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scaling_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websocket_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websocket_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Server managers can manage server_actions"
ON public.server_actions FOR ALL
USING (public.is_server_manager(auth.uid()));

CREATE POLICY "Server managers can view scaling_events"
ON public.scaling_events FOR ALL
USING (public.is_server_manager(auth.uid()));

CREATE POLICY "Users can manage own websocket_connections"
ON public.websocket_connections FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Server managers can view websocket_events"
ON public.websocket_events FOR SELECT
USING (public.is_server_manager(auth.uid()));

-- Function to check and execute auto-scaling
CREATE OR REPLACE FUNCTION public.check_auto_scaling(p_server_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_policy RECORD;
  v_metrics RECORD;
  v_server RECORD;
  v_should_scale BOOLEAN := false;
  v_reason VARCHAR(50);
  v_trigger_value INTEGER;
  v_result JSONB;
BEGIN
  -- Get policy
  SELECT * INTO v_policy FROM auto_scaling_policies 
  WHERE server_id = p_server_id AND is_enabled = true;
  
  IF v_policy IS NULL THEN
    RETURN jsonb_build_object('should_scale', false, 'reason', 'no_policy');
  END IF;
  
  -- Check cooldown
  IF v_policy.last_scale_at IS NOT NULL AND 
     v_policy.last_scale_at + (COALESCE(v_policy.cooldown_minutes, 5) || ' minutes')::interval > now() THEN
    RETURN jsonb_build_object('should_scale', false, 'reason', 'cooldown_active');
  END IF;
  
  -- Get latest metrics (average of last 3)
  SELECT 
    AVG(cpu_percent)::INTEGER as avg_cpu,
    AVG(ram_percent)::INTEGER as avg_ram,
    AVG(disk_percent)::INTEGER as avg_disk
  INTO v_metrics
  FROM (
    SELECT cpu_percent, ram_percent, disk_percent
    FROM server_metrics_cache
    WHERE server_id = p_server_id
    ORDER BY recorded_at DESC
    LIMIT 3
  ) sub;
  
  -- Get server current config
  SELECT * INTO v_server FROM server_instances WHERE id = p_server_id;
  
  -- Check thresholds
  IF v_metrics.avg_cpu >= v_policy.cpu_threshold_percent THEN
    v_should_scale := true;
    v_reason := 'cpu_threshold';
    v_trigger_value := v_metrics.avg_cpu;
  ELSIF v_metrics.avg_ram >= v_policy.ram_threshold_percent THEN
    v_should_scale := true;
    v_reason := 'ram_threshold';
    v_trigger_value := v_metrics.avg_ram;
  END IF;
  
  IF v_should_scale THEN
    -- Check max limits
    IF v_server.cpu_cores >= v_policy.max_cpu AND v_server.ram_gb >= v_policy.max_ram THEN
      RETURN jsonb_build_object('should_scale', false, 'reason', 'max_limit_reached');
    END IF;
    
    -- Update consecutive triggers
    UPDATE auto_scaling_policies 
    SET consecutive_triggers = COALESCE(consecutive_triggers, 0) + 1,
        last_triggered_at = now()
    WHERE id = v_policy.id;
    
    -- Only scale if consecutive triggers >= required
    IF COALESCE(v_policy.consecutive_triggers, 0) + 1 >= COALESCE(v_policy.consecutive_checks_required, 3) THEN
      RETURN jsonb_build_object(
        'should_scale', true,
        'reason', v_reason,
        'trigger_value', v_trigger_value,
        'scale_cpu', LEAST(v_server.cpu_cores + v_policy.scale_up_cpu, v_policy.max_cpu),
        'scale_ram', LEAST(v_server.ram_gb + v_policy.scale_up_ram, v_policy.max_ram),
        'current_cpu', v_server.cpu_cores,
        'current_ram', v_server.ram_gb
      );
    ELSE
      RETURN jsonb_build_object('should_scale', false, 'reason', 'waiting_consecutive', 'count', v_policy.consecutive_triggers + 1);
    END IF;
  ELSE
    -- Reset consecutive triggers if healthy
    UPDATE auto_scaling_policies 
    SET consecutive_triggers = 0
    WHERE id = v_policy.id AND consecutive_triggers > 0;
  END IF;
  
  RETURN jsonb_build_object('should_scale', false, 'reason', 'healthy');
END;
$$;

-- Function to execute scaling
CREATE OR REPLACE FUNCTION public.execute_auto_scale(
  p_server_id UUID,
  p_new_cpu INTEGER,
  p_new_ram INTEGER,
  p_reason VARCHAR(50),
  p_trigger_value INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_server RECORD;
  v_policy RECORD;
  v_action_id UUID;
  v_event_id UUID;
BEGIN
  -- Get current server state
  SELECT * INTO v_server FROM server_instances WHERE id = p_server_id FOR UPDATE;
  SELECT * INTO v_policy FROM auto_scaling_policies WHERE server_id = p_server_id;
  
  -- Create action record
  INSERT INTO server_actions (
    server_id, action, action_type, status,
    previous_config, new_config, requested_at
  ) VALUES (
    p_server_id, 'scale_up', 'auto',  'in_progress',
    jsonb_build_object('cpu', v_server.cpu_cores, 'ram', v_server.ram_gb),
    jsonb_build_object('cpu', p_new_cpu, 'ram', p_new_ram),
    now()
  ) RETURNING id INTO v_action_id;
  
  -- Create scaling event
  INSERT INTO scaling_events (
    server_id, policy_id, trigger_reason, trigger_value,
    threshold_value, scale_direction,
    cpu_before, cpu_after, ram_before, ram_after,
    status, cooldown_until
  ) VALUES (
    p_server_id, v_policy.id, p_reason, p_trigger_value,
    CASE WHEN p_reason = 'cpu_threshold' THEN v_policy.cpu_threshold_percent ELSE v_policy.ram_threshold_percent END,
    'up',
    v_server.cpu_cores, p_new_cpu, v_server.ram_gb, p_new_ram,
    'completed', now() + (COALESCE(v_policy.cooldown_minutes, 5) || ' minutes')::interval
  ) RETURNING id INTO v_event_id;
  
  -- Update server
  UPDATE server_instances
  SET cpu_cores = p_new_cpu,
      ram_gb = p_new_ram,
      updated_at = now()
  WHERE id = p_server_id;
  
  -- Update policy
  UPDATE auto_scaling_policies
  SET last_scale_at = now(),
      consecutive_triggers = 0
  WHERE server_id = p_server_id;
  
  -- Complete action
  UPDATE server_actions
  SET status = 'completed', completed_at = now()
  WHERE id = v_action_id;
  
  -- Log websocket event
  INSERT INTO websocket_events (channel, event_type, server_id, payload)
  VALUES (
    'server_actions',
    'scale',
    p_server_id,
    jsonb_build_object(
      'type', 'scale',
      'server_id', p_server_id,
      'action', 'scale_up',
      'cpu', '+' || (p_new_cpu - v_server.cpu_cores),
      'ram', '+' || (p_new_ram - v_server.ram_gb) || 'GB',
      'status', 'success',
      'timestamp', now()
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'action_id', v_action_id,
    'event_id', v_event_id,
    'previous', jsonb_build_object('cpu', v_server.cpu_cores, 'ram', v_server.ram_gb),
    'new', jsonb_build_object('cpu', p_new_cpu, 'ram', p_new_ram)
  );
END;
$$;

-- Enable realtime for websocket events
ALTER PUBLICATION supabase_realtime ADD TABLE public.websocket_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scaling_events;