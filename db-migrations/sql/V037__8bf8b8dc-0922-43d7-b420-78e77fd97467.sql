-- Create demo_login_roles table for storing login credentials per demo
CREATE TABLE public.demo_login_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID NOT NULL REFERENCES public.demos(id) ON DELETE CASCADE,
    role_name TEXT NOT NULL,
    username TEXT NOT NULL,
    password_encrypted TEXT NOT NULL,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    CONSTRAINT unique_demo_role UNIQUE(demo_id, role_name)
);

-- Add status column to demos if not exists (for pending/active/disabled)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'demo_lifecycle_status'
    ) THEN
        CREATE TYPE demo_lifecycle_status AS ENUM ('pending', 'active', 'disabled', 'archived');
    END IF;
END$$;

-- Add demo_type column for categorization (School, Hospital, ERP, etc.)
ALTER TABLE public.demos 
ADD COLUMN IF NOT EXISTS demo_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS lifecycle_status TEXT DEFAULT 'pending' CHECK (lifecycle_status IN ('pending', 'active', 'disabled', 'archived')),
ADD COLUMN IF NOT EXISTS login_url TEXT,
ADD COLUMN IF NOT EXISTS total_login_roles INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_bulk_created BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS activated_by UUID;

-- Enable RLS on demo_login_roles
ALTER TABLE public.demo_login_roles ENABLE ROW LEVEL SECURITY;

-- Only Demo Manager can view login credentials
CREATE POLICY "Demo manager can view login roles"
ON public.demo_login_roles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('demo_manager', 'super_admin')
    )
);

-- Only Demo Manager can insert login roles
CREATE POLICY "Demo manager can insert login roles"
ON public.demo_login_roles
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'demo_manager'
    )
);

-- Only Demo Manager can update login roles
CREATE POLICY "Demo manager can update login roles"
ON public.demo_login_roles
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'demo_manager'
    )
);

-- Only Demo Manager can delete login roles
CREATE POLICY "Demo manager can delete login roles"
ON public.demo_login_roles
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'demo_manager'
    )
);

-- Create function to update login role count on demos
CREATE OR REPLACE FUNCTION public.update_demo_login_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.demos 
        SET total_login_roles = (
            SELECT COUNT(*) FROM public.demo_login_roles 
            WHERE demo_id = NEW.demo_id AND is_active = true
        )
        WHERE id = NEW.demo_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.demos 
        SET total_login_roles = (
            SELECT COUNT(*) FROM public.demo_login_roles 
            WHERE demo_id = OLD.demo_id AND is_active = true
        )
        WHERE id = OLD.demo_id;
        RETURN OLD;
    END IF;
END;
$$;

-- Create trigger for login count update
DROP TRIGGER IF EXISTS update_demo_login_count_trigger ON public.demo_login_roles;
CREATE TRIGGER update_demo_login_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.demo_login_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_demo_login_count();

-- Create function for bulk demo creation (Demo Manager only)
CREATE OR REPLACE FUNCTION public.bulk_create_demos(
    _demos JSONB
)
RETURNS TABLE(demo_id UUID, demo_name TEXT, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    demo_item JSONB;
    new_demo_id UUID;
    login_role JSONB;
    user_role TEXT;
BEGIN
    -- Check if user is demo_manager
    SELECT role INTO user_role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
    
    IF user_role != 'demo_manager' THEN
        RAISE EXCEPTION 'Access denied: Only Demo Manager can bulk create demos';
    END IF;
    
    FOR demo_item IN SELECT * FROM jsonb_array_elements(_demos)
    LOOP
        -- Insert demo
        INSERT INTO public.demos (
            title,
            url,
            login_url,
            demo_type,
            category,
            description,
            lifecycle_status,
            is_bulk_created,
            created_by,
            status
        ) VALUES (
            demo_item->>'name',
            COALESCE(demo_item->>'url', demo_item->>'login_url'),
            demo_item->>'login_url',
            demo_item->>'demo_type',
            COALESCE(demo_item->>'category', demo_item->>'demo_type'),
            demo_item->>'description',
            'pending',
            true,
            auth.uid(),
            'maintenance'
        )
        RETURNING id INTO new_demo_id;
        
        -- Insert login roles if provided
        IF demo_item->'login_roles' IS NOT NULL THEN
            FOR login_role IN SELECT * FROM jsonb_array_elements(demo_item->'login_roles')
            LOOP
                INSERT INTO public.demo_login_roles (
                    demo_id,
                    role_name,
                    username,
                    password_encrypted,
                    display_order,
                    created_by
                ) VALUES (
                    new_demo_id,
                    login_role->>'role_name',
                    login_role->>'username',
                    login_role->>'password',
                    COALESCE((login_role->>'display_order')::INTEGER, 1),
                    auth.uid()
                );
            END LOOP;
        END IF;
        
        -- Log the creation
        INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
        VALUES (
            auth.uid(),
            'bulk_demo_created',
            'demo',
            user_role::app_role,
            jsonb_build_object(
                'demo_id', new_demo_id,
                'demo_name', demo_item->>'name',
                'demo_type', demo_item->>'demo_type',
                'login_roles_count', COALESCE(jsonb_array_length(demo_item->'login_roles'), 0)
            )
        );
        
        -- Return result
        demo_id := new_demo_id;
        demo_name := demo_item->>'name';
        status := 'created';
        RETURN NEXT;
    END LOOP;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_demo_login_roles_demo_id ON public.demo_login_roles(demo_id);
CREATE INDEX IF NOT EXISTS idx_demos_demo_type ON public.demos(demo_type);
CREATE INDEX IF NOT EXISTS idx_demos_lifecycle_status ON public.demos(lifecycle_status);