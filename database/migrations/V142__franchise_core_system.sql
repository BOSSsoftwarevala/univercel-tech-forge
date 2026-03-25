-- Franchise Core System Schema

-- 1. franchises
CREATE TABLE IF NOT EXISTS public.franchises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    owner_id uuid NOT NULL,
    status text NOT NULL CHECK (status IN ('active','suspended','terminated')),
    city text NOT NULL,
    country text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. franchise_staff
CREATE TABLE IF NOT EXISTS public.franchise_staff (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id uuid NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    role text NOT NULL,
    performance numeric DEFAULT 0,
    status text NOT NULL CHECK (status IN ('active','inactive','suspended'))
);

-- 3. franchise_leads
CREATE TABLE IF NOT EXISTS public.franchise_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id uuid NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    source text,
    status text NOT NULL CHECK (status IN ('new','assigned','in_progress','closed','lost')),
    assigned_to uuid REFERENCES public.franchise_staff(id),
    score numeric DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. franchise_sales
CREATE TABLE IF NOT EXISTS public.franchise_sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id uuid NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    lead_id uuid NOT NULL REFERENCES public.franchise_leads(id) ON DELETE SET NULL,
    amount numeric NOT NULL,
    status text NOT NULL CHECK (status IN ('pending','completed','cancelled')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. franchise_commissions
CREATE TABLE IF NOT EXISTS public.franchise_commissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id uuid NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    sale_id uuid NOT NULL REFERENCES public.franchise_sales(id) ON DELETE CASCADE,
    percentage numeric NOT NULL,
    amount numeric NOT NULL,
    status text NOT NULL CHECK (status IN ('pending','approved','credited'))
);

-- 6. franchise_wallet
CREATE TABLE IF NOT EXISTS public.franchise_wallet (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id uuid NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    balance numeric NOT NULL DEFAULT 0
);

-- 7. franchise_wallet_logs
CREATE TABLE IF NOT EXISTS public.franchise_wallet_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id uuid NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('credit','debit')),
    amount numeric NOT NULL,
    reason text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. franchise_activity_logs
CREATE TABLE IF NOT EXISTS public.franchise_activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id uuid NOT NULL REFERENCES public.franchises(id) ON DELETE CASCADE,
    action text NOT NULL,
    user_id uuid NOT NULL,
    timestamp timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_franchise_staff_franchise_id ON public.franchise_staff(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_leads_franchise_id ON public.franchise_leads(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_leads_status ON public.franchise_leads(status);
CREATE INDEX IF NOT EXISTS idx_franchise_leads_created_at ON public.franchise_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_franchise_sales_franchise_id ON public.franchise_sales(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_sales_created_at ON public.franchise_sales(created_at);
CREATE INDEX IF NOT EXISTS idx_franchise_commissions_franchise_id ON public.franchise_commissions(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_wallet_franchise_id ON public.franchise_wallet(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_wallet_logs_franchise_id ON public.franchise_wallet_logs(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_activity_logs_franchise_id ON public.franchise_activity_logs(franchise_id);

-- Enable RLS on all tables
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_wallet_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (example, expand as needed)
-- Franchise owner: can access only own franchise data
CREATE POLICY franchise_owner_select ON public.franchises FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY franchise_owner_update ON public.franchises FOR UPDATE USING (owner_id = auth.uid());
-- Staff: can access only assigned franchise
CREATE POLICY staff_select ON public.franchise_staff FOR SELECT USING (user_id = auth.uid());
-- Admin: full access (assume role check in app logic or add policy for admin role)
