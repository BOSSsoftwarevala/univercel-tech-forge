-- RESELLER ULTRA GOD CORE SYSTEM

-- 1. resellers
CREATE TABLE IF NOT EXISTS public.resellers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    owner_id uuid NOT NULL,
    status text NOT NULL CHECK (status IN ('active','suspended','terminated')),
    city text NOT NULL,
    country text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. reseller_staff
CREATE TABLE IF NOT EXISTS public.reseller_staff (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    role text NOT NULL,
    performance numeric DEFAULT 0,
    status text NOT NULL CHECK (status IN ('active','inactive','suspended'))
);

-- 3. reseller_leads
CREATE TABLE IF NOT EXISTS public.reseller_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    source text,
    status text NOT NULL CHECK (status IN ('new','assigned','in_progress','closed','lost')),
    assigned_to uuid REFERENCES public.reseller_staff(id),
    score numeric DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. reseller_sales
CREATE TABLE IF NOT EXISTS public.reseller_sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    lead_id uuid NOT NULL REFERENCES public.reseller_leads(id) ON DELETE SET NULL,
    amount numeric NOT NULL,
    status text NOT NULL CHECK (status IN ('pending','completed','cancelled')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. reseller_commissions
CREATE TABLE IF NOT EXISTS public.reseller_commissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    sale_id uuid NOT NULL REFERENCES public.reseller_sales(id) ON DELETE CASCADE,
    percentage numeric NOT NULL,
    amount numeric NOT NULL,
    status text NOT NULL CHECK (status IN ('pending','approved','credited'))
);

-- 6. reseller_wallets
CREATE TABLE IF NOT EXISTS public.reseller_wallets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    balance numeric NOT NULL DEFAULT 0
);

-- 7. reseller_wallet_ledger
CREATE TABLE IF NOT EXISTS public.reseller_wallet_ledger (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('credit','debit')),
    amount numeric NOT NULL,
    reason text,
    last4 text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. reseller_payouts
CREATE TABLE IF NOT EXISTS public.reseller_payouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    status text NOT NULL CHECK (status IN ('pending','approved','paid','failed')),
    last4 text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. reseller_logs
CREATE TABLE IF NOT EXISTS public.reseller_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id uuid NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    action text NOT NULL,
    user_id uuid NOT NULL,
    timestamp timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reseller_leads_reseller_id ON public.reseller_leads(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_sales_reseller_id ON public.reseller_sales(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_commissions_reseller_id ON public.reseller_commissions(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_wallets_reseller_id ON public.reseller_wallets(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_wallet_ledger_reseller_id ON public.reseller_wallet_ledger(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_payouts_reseller_id ON public.reseller_payouts(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_logs_reseller_id ON public.reseller_logs(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_wallet_ledger_last4 ON public.reseller_wallet_ledger(last4);
CREATE INDEX IF NOT EXISTS idx_reseller_payouts_last4 ON public.reseller_payouts(last4);

-- Enable RLS
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (expand as needed)
CREATE POLICY reseller_owner_select ON public.resellers FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY reseller_owner_update ON public.resellers FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY staff_select ON public.reseller_staff FOR SELECT USING (user_id = auth.uid());
-- Admin: full access (add as needed)
