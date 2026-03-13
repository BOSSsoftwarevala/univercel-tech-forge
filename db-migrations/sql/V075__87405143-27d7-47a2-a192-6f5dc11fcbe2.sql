-- Demo Suggestions table for client requests
CREATE TABLE public.demo_suggestions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    demo_id UUID REFERENCES public.demos(id) ON DELETE SET NULL,
    demo_name VARCHAR(255),
    user_id UUID REFERENCES auth.users(id),
    domain_name VARCHAR(255),
    required_modules TEXT[],
    feature_requests TEXT,
    notes TEXT,
    user_ip VARCHAR(50),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    assigned_server VARCHAR(255),
    setup_status VARCHAR(50) DEFAULT 'pending',
    domain_connected BOOLEAN DEFAULT false,
    domain_connected_at TIMESTAMPTZ,
    server_linked BOOLEAN DEFAULT false,
    server_linked_at TIMESTAMPTZ,
    setup_started BOOLEAN DEFAULT false,
    setup_started_at TIMESTAMPTZ,
    estimated_completion TIMESTAMPTZ,
    setup_completed BOOLEAN DEFAULT false,
    setup_completed_at TIMESTAMPTZ,
    is_update_request BOOLEAN DEFAULT false,
    parent_suggestion_id UUID REFERENCES public.demo_suggestions(id),
    auto_processed BOOLEAN DEFAULT false,
    task_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Demo Cart table
CREATE TABLE public.demo_cart (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    quantity INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, demo_id),
    UNIQUE(session_id, demo_id)
);

-- Demo Favorites table
CREATE TABLE public.demo_favorites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, demo_id),
    UNIQUE(session_id, demo_id)
);

-- Setup Tasks auto-generated from suggestions
CREATE TABLE public.demo_setup_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion_id UUID REFERENCES public.demo_suggestions(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    task_status VARCHAR(50) DEFAULT 'pending',
    task_description TEXT,
    assigned_server VARCHAR(255),
    domain_name VARCHAR(255),
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    auto_created BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_setup_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for demo_suggestions (users can see their own, admins see all)
CREATE POLICY "Users can view own suggestions" ON public.demo_suggestions
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

CREATE POLICY "Anyone can create suggestions" ON public.demo_suggestions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update suggestions" ON public.demo_suggestions
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

-- RLS Policies for demo_cart
CREATE POLICY "Users manage own cart" ON public.demo_cart
    FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- RLS Policies for demo_favorites  
CREATE POLICY "Users manage own favorites" ON public.demo_favorites
    FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- RLS Policies for demo_setup_tasks
CREATE POLICY "Admin access setup tasks" ON public.demo_setup_tasks
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

-- Function to auto-process suggestion and create setup task
CREATE OR REPLACE FUNCTION public.process_demo_suggestion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_task_id UUID;
    v_server VARCHAR(255);
BEGIN
    -- Auto-assign server based on load balancing (simple round-robin simulation)
    v_server := 'SV-SERVER-' || LPAD((FLOOR(RANDOM() * 10) + 1)::TEXT, 2, '0');
    
    -- Update suggestion with assigned server
    NEW.assigned_server := v_server;
    NEW.auto_processed := true;
    NEW.setup_status := 'processing';
    
    -- Calculate estimated completion (30 min for new, 15 min for updates)
    IF NEW.is_update_request THEN
        NEW.estimated_completion := now() + INTERVAL '15 minutes';
    ELSE
        NEW.estimated_completion := now() + INTERVAL '30 minutes';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Trigger to auto-process suggestions
CREATE TRIGGER auto_process_suggestion
    BEFORE INSERT ON public.demo_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION public.process_demo_suggestion();

-- Function to create setup tasks after suggestion insert
CREATE OR REPLACE FUNCTION public.create_setup_tasks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_task_id UUID;
BEGIN
    -- Create domain connection task
    INSERT INTO demo_setup_tasks (suggestion_id, task_type, task_description, domain_name, assigned_server)
    VALUES (NEW.id, 'domain_mapping', 'Connect domain ' || COALESCE(NEW.domain_name, 'pending'), NEW.domain_name, NEW.assigned_server);
    
    -- Create server linking task
    INSERT INTO demo_setup_tasks (suggestion_id, task_type, task_description, assigned_server)
    VALUES (NEW.id, 'server_linking', 'Link to server ' || NEW.assigned_server, NEW.assigned_server);
    
    -- Create setup initialization task
    INSERT INTO demo_setup_tasks (suggestion_id, task_type, task_description, assigned_server)
    VALUES (NEW.id, 'setup_init', 'Initialize demo setup with custom modules', NEW.assigned_server)
    RETURNING id INTO v_task_id;
    
    -- Update suggestion with task reference
    UPDATE demo_suggestions SET task_id = v_task_id WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$;

-- Trigger to create tasks after suggestion
CREATE TRIGGER create_tasks_after_suggestion
    AFTER INSERT ON public.demo_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION public.create_setup_tasks();

-- Indexes
CREATE INDEX idx_demo_suggestions_demo ON public.demo_suggestions(demo_id);
CREATE INDEX idx_demo_suggestions_user ON public.demo_suggestions(user_id);
CREATE INDEX idx_demo_suggestions_status ON public.demo_suggestions(setup_status);
CREATE INDEX idx_demo_cart_user ON public.demo_cart(user_id);
CREATE INDEX idx_demo_cart_session ON public.demo_cart(session_id);
CREATE INDEX idx_demo_favorites_user ON public.demo_favorites(user_id);
CREATE INDEX idx_demo_setup_tasks_suggestion ON public.demo_setup_tasks(suggestion_id);