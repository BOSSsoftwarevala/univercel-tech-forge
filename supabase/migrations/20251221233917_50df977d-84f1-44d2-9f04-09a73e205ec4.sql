-- Create enum for event types
CREATE TYPE public.offer_event_type AS ENUM ('festival', 'sports', 'custom');

-- Create global offers table
CREATE TABLE public.global_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage INTEGER NOT NULL DEFAULT 40,
    event_type offer_event_type NOT NULL DEFAULT 'festival',
    event_name TEXT,
    country_code TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_auto_detected BOOLEAN DEFAULT false,
    theme_primary_color TEXT DEFAULT '#8B5CF6',
    theme_secondary_color TEXT DEFAULT '#06B6D4',
    theme_accent_color TEXT DEFAULT '#F59E0B',
    banner_text TEXT,
    icon TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.global_offers ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active offers
CREATE POLICY "Anyone can view active offers"
ON public.global_offers
FOR SELECT
USING (is_active = true AND now() BETWEEN start_date AND end_date);

-- Policy: Super Admin can do everything
CREATE POLICY "Super Admin full access to offers"
ON public.global_offers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Create predefined festivals table for auto-detection
CREATE TABLE public.festival_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    duration_days INTEGER DEFAULT 1,
    country_codes TEXT[] DEFAULT ARRAY['GLOBAL'],
    default_discount INTEGER DEFAULT 40,
    theme_primary TEXT DEFAULT '#8B5CF6',
    theme_secondary TEXT DEFAULT '#06B6D4',
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on festival calendar
ALTER TABLE public.festival_calendar ENABLE ROW LEVEL SECURITY;

-- Everyone can read festival calendar
CREATE POLICY "Anyone can view festival calendar"
ON public.festival_calendar
FOR SELECT
USING (is_active = true);

-- Super Admin manages festival calendar
CREATE POLICY "Super Admin manages festival calendar"
ON public.festival_calendar
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Insert common global festivals
INSERT INTO public.festival_calendar (name, month, day, duration_days, country_codes, default_discount, theme_primary, theme_secondary, icon) VALUES
('New Year', 1, 1, 3, ARRAY['GLOBAL'], 40, '#FFD700', '#FF6B6B', '🎉'),
('Valentine''s Day', 2, 14, 1, ARRAY['GLOBAL'], 30, '#FF69B4', '#FF1493', '💕'),
('Holi', 3, 25, 2, ARRAY['IN', 'NP', 'GLOBAL'], 40, '#FF6B6B', '#4ECDC4', '🎨'),
('Earth Day', 4, 22, 1, ARRAY['GLOBAL'], 25, '#22C55E', '#10B981', '🌍'),
('Mother''s Day', 5, 12, 1, ARRAY['GLOBAL'], 35, '#EC4899', '#F472B6', '💐'),
('Father''s Day', 6, 16, 1, ARRAY['GLOBAL'], 35, '#3B82F6', '#60A5FA', '👔'),
('Independence Day India', 8, 15, 1, ARRAY['IN'], 50, '#FF9933', '#138808', '🇮🇳'),
('Diwali', 11, 1, 5, ARRAY['IN', 'NP', 'GLOBAL'], 50, '#FFD700', '#FF6B6B', '🪔'),
('Black Friday', 11, 29, 4, ARRAY['GLOBAL'], 50, '#000000', '#FFD700', '🛍️'),
('Christmas', 12, 25, 3, ARRAY['GLOBAL'], 40, '#DC2626', '#22C55E', '🎄'),
('Boxing Day', 12, 26, 1, ARRAY['GLOBAL'], 45, '#DC2626', '#FFFFFF', '🎁');

-- Create sports events table
CREATE TABLE public.sports_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sport_type TEXT NOT NULL,
    team1_name TEXT,
    team2_name TEXT,
    team1_color TEXT,
    team2_color TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    default_discount INTEGER DEFAULT 40,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sports_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view active sports events
CREATE POLICY "Anyone can view active sports events"
ON public.sports_events
FOR SELECT
USING (is_active = true);

-- Super Admin manages sports events
CREATE POLICY "Super Admin manages sports events"
ON public.sports_events
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_global_offers_updated_at
BEFORE UPDATE ON public.global_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();