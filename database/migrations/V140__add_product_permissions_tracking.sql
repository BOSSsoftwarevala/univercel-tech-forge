-- V140__add_product_permissions_tracking.sql
CREATE TABLE IF NOT EXISTS public.product_manager_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    permission_type VARCHAR(100) NOT NULL,
    granted_by UUID NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    reason TEXT,
    CONSTRAINT fk_perm_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_granted_by FOREIGN KEY (granted_by) REFERENCES public.users(id),
    UNIQUE(user_id, permission_type)
);
CREATE TABLE IF NOT EXISTS public.product_action_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    requested_by UUID NOT NULL,
    requested_at TIMESTAMPTZ DEFAULT now(),
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    action_details JSONB,
    CONSTRAINT fk_approval_product FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_approval_requested_by FOREIGN KEY (requested_by) REFERENCES public.users(id),
    CONSTRAINT fk_approval_approved_by FOREIGN KEY (approved_by) REFERENCES public.users(id)
);
CREATE INDEX IF NOT EXISTS idx_perms_user ON public.product_manager_permissions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_approvals_product ON public.product_action_approvals(product_id);
