
-- Lead Activities table (tracks all lead interactions)
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL DEFAULT 'note',
    description TEXT NOT NULL,
    performed_by TEXT,
    performed_by_role TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lead Settings table (persistent config for lead manager)
CREATE TABLE IF NOT EXISTS public.lead_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}',
    is_enabled BOOLEAN DEFAULT true,
    category TEXT NOT NULL DEFAULT 'general',
    updated_by TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lead Routing Rules table
CREATE TABLE IF NOT EXISTS public.lead_routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL DEFAULT 'round_robin',
    conditions JSONB DEFAULT '{}',
    assigned_to_pool TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    execution_count INTEGER DEFAULT 0,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lead Integration Configs
CREATE TABLE IF NOT EXISTS public.lead_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    integration_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'disconnected',
    config JSONB DEFAULT '{}',
    last_sync_at TIMESTAMPTZ,
    sync_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Lead managers view activities" ON public.lead_activities FOR SELECT TO authenticated USING (public.can_view_leads(auth.uid()));
CREATE POLICY "Lead managers insert activities" ON public.lead_activities FOR INSERT TO authenticated WITH CHECK (public.can_manage_leads(auth.uid()));

CREATE POLICY "Lead managers manage settings" ON public.lead_settings FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "Lead managers view settings" ON public.lead_settings FOR SELECT TO authenticated USING (public.can_view_leads(auth.uid()));

CREATE POLICY "Lead managers manage routing" ON public.lead_routing_rules FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "Lead managers view routing" ON public.lead_routing_rules FOR SELECT TO authenticated USING (public.can_view_leads(auth.uid()));

CREATE POLICY "Lead managers manage integrations" ON public.lead_integrations FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "Lead managers view integrations" ON public.lead_integrations FOR SELECT TO authenticated USING (public.can_view_leads(auth.uid()));

-- Indexes
CREATE INDEX idx_lead_activities_lead ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON public.lead_activities(activity_type);
CREATE INDEX idx_lead_settings_key ON public.lead_settings(setting_key);
CREATE INDEX idx_lead_routing_active ON public.lead_routing_rules(is_active);
