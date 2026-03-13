
-- Create country_daily_offers table for 290+ country-specific daily offers
CREATE TABLE public.country_daily_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code TEXT NOT NULL,
    country_name TEXT NOT NULL,
    national_day_name TEXT NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    discount_percentage INTEGER NOT NULL DEFAULT 50,
    offer_price NUMERIC(10,2) NOT NULL DEFAULT 49.50,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.country_daily_offers ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Anyone can view country daily offers"
ON public.country_daily_offers
FOR SELECT
USING (is_active = true);

-- Super Admin manages
CREATE POLICY "Super Admin manages country daily offers"
ON public.country_daily_offers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Insert 50+ major country national days (sample, more can be added)
INSERT INTO public.country_daily_offers (country_code, country_name, national_day_name, month, day, discount_percentage, offer_price, icon) VALUES
('US', 'United States', 'Independence Day', 7, 4, 50, 49.50, '🇺🇸'),
('IN', 'India', 'Independence Day', 8, 15, 50, 49.50, '🇮🇳'),
('IN', 'India', 'Republic Day', 1, 26, 50, 49.50, '🇮🇳'),
('GB', 'United Kingdom', 'King''s Birthday', 6, 14, 50, 49.50, '🇬🇧'),
('FR', 'France', 'Bastille Day', 7, 14, 50, 49.50, '🇫🇷'),
('DE', 'Germany', 'German Unity Day', 10, 3, 50, 49.50, '🇩🇪'),
('JP', 'Japan', 'National Foundation Day', 2, 11, 50, 49.50, '🇯🇵'),
('CN', 'China', 'National Day', 10, 1, 50, 49.50, '🇨🇳'),
('BR', 'Brazil', 'Independence Day', 9, 7, 50, 49.50, '🇧🇷'),
('AU', 'Australia', 'Australia Day', 1, 26, 50, 49.50, '🇦🇺'),
('CA', 'Canada', 'Canada Day', 7, 1, 50, 49.50, '🇨🇦'),
('MX', 'Mexico', 'Independence Day', 9, 16, 50, 49.50, '🇲🇽'),
('KR', 'South Korea', 'National Foundation Day', 10, 3, 50, 49.50, '🇰🇷'),
('IT', 'Italy', 'Republic Day', 6, 2, 50, 49.50, '🇮🇹'),
('ES', 'Spain', 'National Day', 10, 12, 50, 49.50, '🇪🇸'),
('RU', 'Russia', 'Russia Day', 6, 12, 50, 49.50, '🇷🇺'),
('ZA', 'South Africa', 'Freedom Day', 4, 27, 50, 49.50, '🇿🇦'),
('NG', 'Nigeria', 'Independence Day', 10, 1, 50, 49.50, '🇳🇬'),
('KE', 'Kenya', 'Jamhuri Day', 12, 12, 50, 49.50, '🇰🇪'),
('EG', 'Egypt', 'Revolution Day', 7, 23, 50, 49.50, '🇪🇬'),
('SA', 'Saudi Arabia', 'National Day', 9, 23, 50, 49.50, '🇸🇦'),
('AE', 'UAE', 'National Day', 12, 2, 50, 49.50, '🇦🇪'),
('PK', 'Pakistan', 'Independence Day', 8, 14, 50, 49.50, '🇵🇰'),
('BD', 'Bangladesh', 'Independence Day', 3, 26, 50, 49.50, '🇧🇩'),
('ID', 'Indonesia', 'Independence Day', 8, 17, 50, 49.50, '🇮🇩'),
('PH', 'Philippines', 'Independence Day', 6, 12, 50, 49.50, '🇵🇭'),
('TH', 'Thailand', 'National Day', 12, 5, 50, 49.50, '🇹🇭'),
('VN', 'Vietnam', 'National Day', 9, 2, 50, 49.50, '🇻🇳'),
('MY', 'Malaysia', 'Merdeka Day', 8, 31, 50, 49.50, '🇲🇾'),
('SG', 'Singapore', 'National Day', 8, 9, 50, 49.50, '🇸🇬'),
('TR', 'Turkey', 'Republic Day', 10, 29, 50, 49.50, '🇹🇷'),
('GR', 'Greece', 'Independence Day', 3, 25, 50, 49.50, '🇬🇷'),
('PL', 'Poland', 'Independence Day', 11, 11, 50, 49.50, '🇵🇱'),
('NL', 'Netherlands', 'King''s Day', 4, 27, 50, 49.50, '🇳🇱'),
('SE', 'Sweden', 'National Day', 6, 6, 50, 49.50, '🇸🇪'),
('NO', 'Norway', 'Constitution Day', 5, 17, 50, 49.50, '🇳🇴'),
('DK', 'Denmark', 'Constitution Day', 6, 5, 50, 49.50, '🇩🇰'),
('FI', 'Finland', 'Independence Day', 12, 6, 50, 49.50, '🇫🇮'),
('CH', 'Switzerland', 'National Day', 8, 1, 50, 49.50, '🇨🇭'),
('AT', 'Austria', 'National Day', 10, 26, 50, 49.50, '🇦🇹'),
('PT', 'Portugal', 'Portugal Day', 6, 10, 50, 49.50, '🇵🇹'),
('IE', 'Ireland', 'St. Patrick''s Day', 3, 17, 50, 49.50, '🇮🇪'),
('AR', 'Argentina', 'Independence Day', 7, 9, 50, 49.50, '🇦🇷'),
('CL', 'Chile', 'Independence Day', 9, 18, 50, 49.50, '🇨🇱'),
('CO', 'Colombia', 'Independence Day', 7, 20, 50, 49.50, '🇨🇴'),
('PE', 'Peru', 'Independence Day', 7, 28, 50, 49.50, '🇵🇪'),
('NZ', 'New Zealand', 'Waitangi Day', 2, 6, 50, 49.50, '🇳🇿'),
('IL', 'Israel', 'Independence Day', 5, 14, 50, 49.50, '🇮🇱'),
('SS', 'South Sudan', 'Independence Day', 7, 9, 50, 49.50, '🇸🇸'),
('BI', 'Burundi', 'Independence Day', 7, 1, 50, 49.50, '🇧🇮'),
('LR', 'Liberia', 'Independence Day', 7, 26, 50, 49.50, '🇱🇷'),
('NP', 'Nepal', 'Republic Day', 5, 28, 50, 49.50, '🇳🇵');

-- Update festival calendar: Add Boss Birthday as worldwide mega event
INSERT INTO public.festival_calendar (name, month, day, duration_days, country_codes, default_discount, theme_primary, theme_secondary, icon)
VALUES ('Boss Birthday 🎂', 8, 6, 1, ARRAY['GLOBAL'], 75, '#FFD700', '#FF6B6B', '🎂')
ON CONFLICT DO NOTHING;

-- Update existing festivals discount to 75% for Holi and Diwali
UPDATE public.festival_calendar SET default_discount = 75 WHERE name IN ('Holi', 'Diwali');
